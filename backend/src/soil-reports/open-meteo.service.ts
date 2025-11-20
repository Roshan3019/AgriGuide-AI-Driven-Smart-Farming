import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

export interface OpenMeteoData {
  temperature: number | null;
  humidity: number | null;
  windSpeed: number | null;
  rainfall: number | null;
  soilMoisture: number | null;
  soilTemperature: number | null;
}

@Injectable()
export class OpenMeteoService {
  private readonly logger = new Logger(OpenMeteoService.name);

  /**
   * Fetches current weather and soil climate data from Open-Meteo API
   * @param latitude - Latitude coordinate
   * @param longitude - Longitude coordinate
   * @returns Promise with weather and soil data, null values if unavailable
   */
  async fetchOpenMeteoData(latitude: number, longitude: number): Promise<OpenMeteoData> {
    try {
      // Open-Meteo API endpoint for current weather and soil data
      const url = 'https://api.open-meteo.com/v1/forecast';

      const params = {
        latitude,
        longitude,
        current: [
          'temperature_2m',
          'relative_humidity_2m',
          'wind_speed_10m',
          'rain',
          'soil_moisture_0_1cm',
          'soil_temperature_0cm'
        ].join(','),
        timezone: 'auto'
      };

      this.logger.debug(`Fetching Open-Meteo data for lat: ${latitude}, lng: ${longitude}`);

      const response = await axios.get(url, { params, timeout: 10000 });

      if (response.status && response.status !== 200) {
        throw new Error(`Open-Meteo API returned status ${response.status}`);
      }

      const data = response.data;
      const current = data.current;

      if (!current) {
        this.logger.warn('No current weather data available from Open-Meteo');
        return this.getEmptyData();
      }

      // Extract values from the current data
      const result: OpenMeteoData = {
        temperature: current.temperature_2m || null,
        humidity: current.relative_humidity_2m || null,
        windSpeed: current.wind_speed_10m || null,
        rainfall: current.rain || null,
        soilMoisture: current.soil_moisture_0_1cm || null,
        soilTemperature: current.soil_temperature_0cm || null,
      };

      this.logger.debug(`Successfully fetched Open-Meteo data: ${JSON.stringify(result)}`);
      return result;

    } catch (error) {
      this.logger.error(`Failed to fetch Open-Meteo data: ${error.message}`, error.stack);
      // Return null values instead of throwing to maintain service availability
      return this.getEmptyData();
    }
  }

  private getEmptyData(): OpenMeteoData {
    return {
      temperature: null,
      humidity: null,
      windSpeed: null,
      rainfall: null,
      soilMoisture: null,
      soilTemperature: null,
    };
  }
}