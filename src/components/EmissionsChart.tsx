import React from 'react';
import { BarChart3 } from 'lucide-react';
import { EmissionSummary } from '../types/carbon';

interface EmissionsChartProps {
  summary: EmissionSummary;
}

export const EmissionsChart: React.FC<EmissionsChartProps> = ({ summary }) => {
  const maxEmissions = Math.max(...summary.monthlyTrend.map(d => d.emissions));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-amber-50 rounded-lg">
          <BarChart3 className="h-5 w-5 text-amber-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Emissions Trend</h3>
      </div>

      <div className="space-y-4">
        {summary.monthlyTrend.map((data, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="w-16 text-sm text-gray-600 font-medium">
              {data.month}
            </div>
            <div className="flex-1 relative">
              <div className="w-full bg-gray-100 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-6 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                  style={{
                    width: `${maxEmissions > 0 ? (data.emissions / maxEmissions) * 100 : 0}%`
                  }}
                >
                  {data.emissions > 0 && (
                    <span className="text-xs text-white font-medium">
                      {data.emissions.toFixed(1)} kg
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {summary.monthlyTrend.every(d => d.emissions === 0) && (
        <div className="text-center py-8 text-gray-500">
          <BarChart3 className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No emission data available yet</p>
          <p className="text-sm">Start calculating to see trends</p>
        </div>
      )}
    </div>
  );
};