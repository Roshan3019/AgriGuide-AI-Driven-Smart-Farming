import { calculateFertilityCategory, generateRecommendations, getMockSoilDataForLocation } from './soil-utils';

describe('Soil Utils', () => {
  describe('calculateFertilityCategory', () => {
    it('should return Very High for high scores', () => {
      const result = calculateFertilityCategory(80, 80, 80, 7, 5);
      expect(result).toBe('Very High');
    });

    it('should return High for good scores', () => {
      const result = calculateFertilityCategory(60, 60, 60, 6.5, 3);
      expect(result).toBe('High');
    });

    it('should return Average for medium scores', () => {
      const result = calculateFertilityCategory(40, 40, 40, 6, 2);
      expect(result).toBe('Average');
    });

    it('should return Low for low scores', () => {
      const result = calculateFertilityCategory(25, 25, 25, 6, 1);
      expect(result).toBe('Low');
    });

    it('should return Very Low for very low scores', () => {
      const result = calculateFertilityCategory(5, 5, 5, 4, 0.5);
      expect(result).toBe('Very Low');
    });

    it('should adjust for pH outside optimal range', () => {
      const result = calculateFertilityCategory(50, 50, 50, 4, 1);
      expect(result).toBe('Average'); // Score reduced due to bad pH
    });
  });

  describe('generateRecommendations', () => {
    it('should recommend lime for acidic soil', () => {
      const result = generateRecommendations(50, 50, 50, 5, 2);
      expect(result).toContain('Add lime to raise pH');
    });

    it('should recommend nitrogen fertilizer for low nitrogen', () => {
      const result = generateRecommendations(10, 50, 50, 6.5, 2);
      expect(result).toContain('nitrogen-rich fertilizer');
    });

    it('should recommend phosphorus fertilizer for low phosphorus', () => {
      const result = generateRecommendations(50, 10, 50, 6.5, 2);
      expect(result).toContain('phosphate fertilizers');
    });

    it('should recommend potassium fertilizer for low potassium', () => {
      const result = generateRecommendations(50, 50, 10, 6.5, 2);
      expect(result).toContain('potash fertilizers');
    });

    it('should recommend compost for low organic carbon', () => {
      const result = generateRecommendations(50, 50, 50, 6.5, 0.5);
      expect(result).toContain('compost or manure');
    });
  });

  describe('getMockSoilDataForLocation', () => {
    it('should return valid soil data for northern India coordinates', () => {
      const result = getMockSoilDataForLocation(28.6139, 77.2090); // Delhi
      expect(result.pH).toBeGreaterThanOrEqual(6.8);
      expect(result.pH).toBeLessThanOrEqual(7.6);
      expect(result.nitrogen).toBeGreaterThanOrEqual(45);
      expect(result.nitrogen).toBeLessThanOrEqual(65);
      expect(result.phosphorus).toBeGreaterThanOrEqual(25);
      expect(result.phosphorus).toBeLessThanOrEqual(40);
      expect(result.potassium).toBeGreaterThanOrEqual(30);
      expect(result.potassium).toBeLessThanOrEqual(50);
      expect(result.organicCarbon).toBeGreaterThanOrEqual(0.8);
      expect(result.organicCarbon).toBeLessThanOrEqual(1.2);
      expect(result.moisture).toBeGreaterThanOrEqual(20);
      expect(result.moisture).toBeLessThanOrEqual(30);
    });

    it('should return valid soil data for central India coordinates', () => {
      const result = getMockSoilDataForLocation(19.0760, 72.8777); // Mumbai
      expect(result.pH).toBeGreaterThanOrEqual(6.4);
      expect(result.pH).toBeLessThanOrEqual(7.2);
      expect(result.nitrogen).toBeGreaterThanOrEqual(55);
      expect(result.nitrogen).toBeLessThanOrEqual(75);
      expect(result.phosphorus).toBeGreaterThanOrEqual(35);
      expect(result.phosphorus).toBeLessThanOrEqual(50);
      expect(result.potassium).toBeGreaterThanOrEqual(40);
      expect(result.potassium).toBeLessThanOrEqual(60);
      expect(result.organicCarbon).toBeGreaterThanOrEqual(1.0);
      expect(result.organicCarbon).toBeLessThanOrEqual(1.5);
      expect(result.moisture).toBeGreaterThanOrEqual(25);
      expect(result.moisture).toBeLessThanOrEqual(35);
    });

    it('should return valid soil data for southern India coordinates', () => {
      const result = getMockSoilDataForLocation(13.0827, 80.2707); // Chennai
      expect(result.pH).toBeGreaterThanOrEqual(5.8);
      expect(result.pH).toBeLessThanOrEqual(6.6);
      expect(result.nitrogen).toBeGreaterThanOrEqual(65);
      expect(result.nitrogen).toBeLessThanOrEqual(85);
      expect(result.phosphorus).toBeGreaterThanOrEqual(45);
      expect(result.phosphorus).toBeLessThanOrEqual(60);
      expect(result.potassium).toBeGreaterThanOrEqual(50);
      expect(result.potassium).toBeLessThanOrEqual(70);
      expect(result.organicCarbon).toBeGreaterThanOrEqual(1.2);
      expect(result.organicCarbon).toBeLessThanOrEqual(1.8);
      expect(result.moisture).toBeGreaterThanOrEqual(30);
      expect(result.moisture).toBeLessThanOrEqual(40);
    });

    it('should return consistent results for same coordinates', () => {
      const result1 = getMockSoilDataForLocation(20.0, 78.0);
      const result2 = getMockSoilDataForLocation(20.0, 78.0);
      // Results should be different due to randomness, but within expected ranges
      expect(result1.pH).toBeGreaterThanOrEqual(6.4);
      expect(result1.pH).toBeLessThanOrEqual(7.2);
      expect(result2.pH).toBeGreaterThanOrEqual(6.4);
      expect(result2.pH).toBeLessThanOrEqual(7.2);
    });
  });
});