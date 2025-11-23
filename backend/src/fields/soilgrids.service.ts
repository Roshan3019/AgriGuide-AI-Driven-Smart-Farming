import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SoilGridsService {
  private readonly logger = new Logger(SoilGridsService.name);

  /**
   * Fetches baseline soil properties from SoilGrids API for a given latitude and longitude.
   * Uses the 0-30 cm depth layer to obtain representative values.
   * Returns an object with soil properties or empty object if API fails.
   */
  async fetchSoilGridsData(latitude: number, longitude: number): Promise<{
    ph?: number;
    organicCarbon?: number;
    clayPercent?: number;
    sandPercent?: number;
  }> {
    try {
      // SoilGrids API endpoint for point queries (v2.0)
      const baseUrl = 'https://rest.isric.org/soilgrids/v2.0/properties/query';

      // Query parameters for 0-30 cm depth
      // Note: SoilGrids v2.0 property names might be different
      const params = {
        lon: longitude,
        lat: latitude,
        property: ['phh2o', 'soc', 'clay', 'sand', 'ocs'], // Include ocs which we saw in response
        depth: '0-30cm',
        value: 'mean', // Use mean values
      };

      this.logger.debug(`[SoilGridsService] Fetching data for lat=${latitude}, lon=${longitude}`);
      this.logger.debug(`[SoilGridsService] Request URL: ${baseUrl}?${new URLSearchParams(params as any).toString()}`);

      const response = await axios.get(baseUrl, { params, timeout: 10000 });

      this.logger.debug(`[SoilGridsService] HTTP response status: ${response.status}`);

      if (response.status !== 200 || !response.data) {
        this.logger.warn(`[SoilGridsService] API returned status ${response.status}, data: ${JSON.stringify(response.data)}`);
        return {};
      }

      this.logger.debug(`[SoilGridsService] Full response data keys: ${Object.keys(response.data)}`);

      // The response structure might be different - let's log the full response to understand it
      this.logger.debug(`[SoilGridsService] Full response: ${JSON.stringify(response.data).substring(0, 500)}...`);

      let ph: number | undefined;
      let organicCarbon: number | undefined;
      let clayPercent: number | undefined;
      let sandPercent: number | undefined;

      // Handle the actual SoilGrids v2.0 API response structure
      if (response.data.properties && response.data.properties.layers) {
        this.logger.debug(`[SoilGridsService] Found properties.layers in response`);
        const layers = response.data.properties.layers;

        // The layers is an array of objects with name, depths, etc.
        // Find the layer for each property
        const findLayerValue = (propertyName: string): number | undefined => {
          const layer = layers.find((l: any) => l.name === propertyName);
          if (!layer) {
            this.logger.debug(`[SoilGridsService] No layer found for property: ${propertyName}`);
            return undefined;
          }

          // Find the 0-30cm depth
          const depth = layer.depths?.find((d: any) => d.label === '0-30cm');
          if (!depth) {
            this.logger.debug(`[SoilGridsService] No 0-30cm depth found for ${propertyName}`);
            return undefined;
          }

          const meanValue = depth.values?.mean;
          if (meanValue !== null && typeof meanValue === 'number') {
            // Apply scaling based on property type
            let scaledValue = meanValue;
            if (propertyName === 'phh2o') {
              scaledValue = meanValue / 10; // pH values are scaled by 10
            } else if (['soc', 'clay', 'sand'].includes(propertyName)) {
              scaledValue = meanValue / 10; // These are percentages scaled by 10
            }
            this.logger.debug(`[SoilGridsService] ${propertyName}: raw=${meanValue}, scaled=${scaledValue}`);
            return scaledValue;
          }

          this.logger.debug(`[SoilGridsService] No valid mean value for ${propertyName}: ${meanValue}`);
          return undefined;
        };

        ph = findLayerValue('phh2o');
        organicCarbon = findLayerValue('ocs') || findLayerValue('soc'); // Try ocs first, fallback to soc
        clayPercent = findLayerValue('clay');
        sandPercent = findLayerValue('sand');
      } else {
        // Fallback to properties structure
        const properties = response.data.properties;
        this.logger.debug(`[SoilGridsService] Response properties keys: ${Object.keys(properties || {})}`);

        // Extract values from the response
        // SoilGrids returns values in the range, we take the mean
        const extractValue = (propertyData: any): number | undefined => {
          if (!propertyData || !propertyData.layers || !propertyData.layers['0-30cm']) {
            this.logger.debug(`[SoilGridsService] No data found for property: ${JSON.stringify(propertyData)}`);
            return undefined;
          }
          const layer = propertyData.layers['0-30cm'];
          if (layer.mean && typeof layer.mean === 'number') {
            const scaledValue = layer.mean / 10; // SoilGrids values are often scaled by 10
            this.logger.debug(`[SoilGridsService] Extracted value: ${layer.mean} -> ${scaledValue}`);
            return scaledValue;
          }
          this.logger.debug(`[SoilGridsService] No mean value found in layer: ${JSON.stringify(layer)}`);
          return undefined;
        };

        ph = extractValue(properties.phh2o);
        organicCarbon = extractValue(properties.soc);
        clayPercent = extractValue(properties.clay);
        sandPercent = extractValue(properties.sand);
      }

      const result = {
        ph,
        organicCarbon,
        clayPercent,
        sandPercent,
      };

      this.logger.debug(`[SoilGridsService] Final mapped result: ${JSON.stringify(result)}`);

      return result;
    } catch (error) {
      this.logger.error(`[SoilGridsService] Failed to fetch data: ${error.message}`, error.stack);
      // Return empty object to fail gracefully
      return {};
    }
  }
}