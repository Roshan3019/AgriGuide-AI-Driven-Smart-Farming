import { calculateFertilityCategory, generateRecommendations } from './soil-utils';

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
      const result = calculateFertilityCategory(20, 20, 20, 5, 1);
      expect(result).toBe('Low');
    });

    it('should return Very Low for very low scores', () => {
      const result = calculateFertilityCategory(5, 5, 5, 4, 0.5);
      expect(result).toBe('Very Low');
    });

    it('should adjust for pH outside optimal range', () => {
      const result = calculateFertilityCategory(70, 70, 70, 4, 3);
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
});