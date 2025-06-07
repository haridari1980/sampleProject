import React from 'react';
import { History, MapPin, Package } from 'lucide-react';
import { CarbonCalculation } from '../types/carbon';
import { transportModes } from '../data/transportModes';
import { formatEmissions } from '../utils/carbonCalculations';

interface RecentCalculationsProps {
  calculations: CarbonCalculation[];
  onDeleteCalculation: (id: string) => void;
}

export const RecentCalculations: React.FC<RecentCalculationsProps> = ({ 
  calculations, 
  onDeleteCalculation 
}) => {
  const recentCalculations = calculations
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-lg">
          <History className="h-5 w-5 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Recent Calculations</h3>
      </div>

      <div className="space-y-3">
        {recentCalculations.length > 0 ? (
          recentCalculations.map((calc) => {
            const mode = transportModes.find(m => m.id === calc.transportMode);
            return (
              <div key={calc.id} className="p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-medium text-gray-900">{mode?.name}</span>
                      <span className="text-xs text-gray-500">•</span>
                      <span className="text-xs text-gray-500">{calc.date}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{calc.route.origin} → {calc.route.destination}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        <span>{calc.weight}t</span>
                      </div>
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">Distance: </span>
                      <span className="font-medium">{calc.distance} km</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-emerald-600 mb-1">
                      {formatEmissions(calc.emissions)}
                    </div>
                    <button
                      onClick={() => onDeleteCalculation(calc.id)}
                      className="text-xs text-red-600 hover:text-red-800 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <History className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No calculations yet</p>
            <p className="text-sm">Use the calculator to start tracking emissions</p>
          </div>
        )}
      </div>
    </div>
  );
};