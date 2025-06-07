export interface TransportMode {
  id: string;
  name: string;
  icon: string;
  emissionFactor: number; // kg CO2 per tonne-km
  unit: string;
}

export interface CarbonCalculation {
  id: string;
  date: string;
  transportMode: string;
  distance: number;
  weight: number;
  loadFactor: number;
  emissions: number;
  route: {
    origin: string;
    destination: string;
  };
}

export interface EmissionSummary {
  totalEmissions: number;
  totalDistance: number;
  totalWeight: number;
  averageEfficiency: number;
  byTransportMode: Record<string, number>;
  monthlyTrend: Array<{
    month: string;
    emissions: number;
  }>;
}