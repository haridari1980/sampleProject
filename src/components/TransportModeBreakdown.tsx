import React from 'react';
import { PieChart, Truck, Train, Ship, Plane } from 'lucide-react';
import { EmissionSummary } from '../types/carbon';
import { transportModes } from '../data/transportModes';

interface TransportModeBreakdownProps {
  summary: EmissionSummary;
}

export const TransportModeBreakdown: React.FC<TransportModeBreakdownProps> = ({ summary }) => {
  const iconMap = {
    truck: Truck,
    rail: Train,
    sea: Ship,
    air: Plane
  };

  const colorMap = {
    truck: 'bg-blue-500',
    rail: 'bg-green-500',
    sea: 'bg-cyan-500',
    air: 'bg-red-500'
  };

  const modeData = Object.entries(summary.byTransportMode).map(([modeId, emissions]) => {
    const mode = transportModes.find(m => m.id === modeId);
    const percentage = summary.totalEmissions > 0 ? (emissions / summary.totalEmissions) * 100 : 0;
    
    return {
      id: modeId,
      name: mode?.name || modeId,
      emissions,
      percentage,
      icon: iconMap[modeId as keyof typeof iconMap] || Truck,
      color: colorMap[modeId as keyof typeof colorMap] || 'bg-gray-500'
    };
  }).sort((a, b) => b.emissions - a.emissions);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-purple-50 rounded-lg">
          <PieChart className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Emissions by Transport Mode</h3>
      </div>

      <div className="space-y-4">
        {modeData.length > 0 ? (
          modeData.map((data) => {
            const Icon = data.icon;
            return (
              <div key={data.id} className="flex items-center gap-4">
                <div className={`p-2 rounded-lg ${data.color.replace('bg-', 'bg-opacity-10 bg-')}`}>
                  <Icon className={`h-4 w-4 ${data.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{data.name}</span>
                    <span className="text-sm text-gray-600">
                      {data.emissions.toFixed(1)} kg CO₂ ({data.percentage.toFixed(1)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${data.color}`}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-8 text-gray-500">
            <PieChart className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>No transport mode data available</p>
            <p className="text-sm">Add calculations to see breakdown</p>
          </div>
        )}
      </div>
    </div>
  );
};