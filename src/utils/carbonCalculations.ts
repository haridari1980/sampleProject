import { CarbonCalculation, EmissionSummary } from '../types/carbon';
import { transportModes } from '../data/transportModes';

export const calculateEmissions = (
  transportModeId: string,
  distance: number,
  weight: number,
  loadFactor: number = 1
): number => {
  const mode = transportModes.find(m => m.id === transportModeId);
  if (!mode) return 0;
  
  // Formula: Emission Factor × Weight × Distance × Load Factor
  return mode.emissionFactor * weight * distance * loadFactor;
};

export const generateEmissionSummary = (calculations: CarbonCalculation[]): EmissionSummary => {
  const totalEmissions = calculations.reduce((sum, calc) => sum + calc.emissions, 0);
  const totalDistance = calculations.reduce((sum, calc) => sum + calc.distance, 0);
  const totalWeight = calculations.reduce((sum, calc) => sum + calc.weight, 0);
  
  const byTransportMode = calculations.reduce((acc, calc) => {
    acc[calc.transportMode] = (acc[calc.transportMode] || 0) + calc.emissions;
    return acc;
  }, {} as Record<string, number>);
  
  // Generate monthly trend (last 6 months)
  const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthKey = date.toISOString().slice(0, 7); // YYYY-MM format
    
    const monthEmissions = calculations
      .filter(calc => calc.date.startsWith(monthKey))
      .reduce((sum, calc) => sum + calc.emissions, 0);
    
    return {
      month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      emissions: monthEmissions
    };
  }).reverse();
  
  return {
    totalEmissions,
    totalDistance,
    totalWeight,
    averageEfficiency: totalEmissions / totalDistance || 0,
    byTransportMode,
    monthlyTrend
  };
};

export const formatEmissions = (emissions: number): string => {
  if (emissions >= 1000) {
    return `${(emissions / 1000).toFixed(2)} tonnes CO₂`;
  }
  return `${emissions.toFixed(2)} kg CO₂`;
};