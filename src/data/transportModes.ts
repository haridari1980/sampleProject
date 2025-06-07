import { TransportMode } from '../types/carbon';

export const transportModes: TransportMode[] = [
  {
    id: 'truck',
    name: 'Road Freight (Truck)',
    icon: 'Truck',
    emissionFactor: 0.062, // kg CO2 per tonne-km
    unit: 'tonne-km'
  },
  {
    id: 'rail',
    name: 'Rail Freight',
    icon: 'Train',
    emissionFactor: 0.022, // kg CO2 per tonne-km
    unit: 'tonne-km'
  },
  {
    id: 'sea',
    name: 'Sea Freight',
    icon: 'Ship',
    emissionFactor: 0.011, // kg CO2 per tonne-km
    unit: 'tonne-km'
  },
  {
    id: 'air',
    name: 'Air Freight',
    icon: 'Plane',
    emissionFactor: 1.016, // kg CO2 per tonne-km
    unit: 'tonne-km'
  }
];