export function calculateFertilityCategory(nitrogen: number, phosphorus: number, potassium: number, pH: number, organicCarbon: number): string {
  // Simple scoring based on average NPK, adjusted by pH and organic carbon
  const npkAverage = (nitrogen + phosphorus + potassium) / 3;
  let score = npkAverage;

  // pH adjustment: optimal 6-7
  if (pH < 5.5 || pH > 7.5) score -= 10;
  else if (pH >= 6 && pH <= 7) score += 5;

  // Organic carbon bonus
  score += organicCarbon * 0.1;

  if (score >= 80) return 'Very High';
  if (score >= 60) return 'High';
  if (score >= 40) return 'Average';
  if (score >= 20) return 'Low';
  return 'Very Low';
}

export function generateRecommendations(nitrogen: number, phosphorus: number, potassium: number, pH: number, organicCarbon: number): string {
  const recommendations: string[] = [];

  if (pH < 5.5) recommendations.push('Soil is too acidic. Add lime to raise pH.');
  else if (pH > 7.5) recommendations.push('Soil is too alkaline. Add sulfur to lower pH.');
  else recommendations.push('pH is optimal.');

  if (nitrogen < 30) recommendations.push('Nitrogen is low. Apply nitrogen-rich fertilizer like urea.');
  else recommendations.push('Nitrogen levels are adequate.');

  if (phosphorus < 20) recommendations.push('Phosphorus is low. Use phosphate fertilizers.');
  else recommendations.push('Phosphorus levels are adequate.');

  if (potassium < 20) recommendations.push('Potassium is low. Apply potash fertilizers.');
  else recommendations.push('Potassium levels are adequate.');

  if (organicCarbon < 1) recommendations.push('Organic carbon is low. Add compost or manure.');
  else recommendations.push('Organic carbon levels are good.');

  return recommendations.join(' ');
}

/**
 * Mock function to simulate government soil dataset based on location.
 * This is a placeholder for future integration with real govt APIs.
 * Maps latitude/longitude to predefined zones with typical soil parameters.
 */
export function getMockSoilDataForLocation(lat: number, lng: number): {
  pH: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  organicCarbon: number;
  moisture: number;
} {
  // Simple zone mapping based on latitude (rough approximation for India)
  // Northern India (lat > 25): Slightly alkaline, medium fertility
  // Central India (lat 15-25): Neutral, good fertility
  // Southern India (lat < 15): Slightly acidic, high fertility

  let zone: 'north' | 'central' | 'south';

  if (lat > 25) {
    zone = 'north';
  } else if (lat < 15) {
    zone = 'south';
  } else {
    zone = 'central';
  }

  // Mock data based on zones
  switch (zone) {
    case 'north':
      return {
        pH: 7.2 + (Math.random() - 0.5) * 0.4, // 6.8-7.6
        nitrogen: 45 + Math.random() * 20, // 45-65
        phosphorus: 25 + Math.random() * 15, // 25-40
        potassium: 30 + Math.random() * 20, // 30-50
        organicCarbon: 0.8 + Math.random() * 0.4, // 0.8-1.2
        moisture: 20 + Math.random() * 10, // 20-30
      };
    case 'central':
      return {
        pH: 6.8 + (Math.random() - 0.5) * 0.4, // 6.4-7.2
        nitrogen: 55 + Math.random() * 20, // 55-75
        phosphorus: 35 + Math.random() * 15, // 35-50
        potassium: 40 + Math.random() * 20, // 40-60
        organicCarbon: 1.0 + Math.random() * 0.5, // 1.0-1.5
        moisture: 25 + Math.random() * 10, // 25-35
      };
    case 'south':
      return {
        pH: 6.2 + (Math.random() - 0.5) * 0.4, // 5.8-6.6
        nitrogen: 65 + Math.random() * 20, // 65-85
        phosphorus: 45 + Math.random() * 15, // 45-60
        potassium: 50 + Math.random() * 20, // 50-70
        organicCarbon: 1.2 + Math.random() * 0.6, // 1.2-1.8
        moisture: 30 + Math.random() * 10, // 30-40
      };
  }
}