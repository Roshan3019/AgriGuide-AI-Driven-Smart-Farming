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