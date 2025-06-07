import React, { useState } from 'react';
import { Calculator, MapPin, Package, Gauge } from 'lucide-react';
import { transportModes } from '../data/transportModes';
import { calculateEmissions, formatEmissions } from '../utils/carbonCalculations';
import { CarbonCalculation } from '../types/carbon';

interface CarbonCalculatorProps {
  onAddCalculation: (calculation: Omit<CarbonCalculation, 'id'>) => void;
}

export const CarbonCalculator: React.FC<CarbonCalculatorProps> = ({ onAddCalculation }) => {
  const [formData, setFormData] = useState({
    transportMode: 'truck',
    origin: '',
    destination: '',
    distance: '',
    weight: '',
    loadFactor: '1'
  });

  const [result, setResult] = useState<number | null>(null);

  const handleCalculate = () => {
    const distance = parseFloat(formData.distance);
    const weight = parseFloat(formData.weight);
    const loadFactor = parseFloat(formData.loadFactor);

    if (distance && weight) {
      const emissions = calculateEmissions(formData.transportMode, distance, weight, loadFactor);
      setResult(emissions);
    }
  };

  const handleSave = () => {
    if (result !== null && formData.origin && formData.destination) {
      const calculation: Omit<CarbonCalculation, 'id'> = {
        date: new Date().toISOString().split('T')[0],
        transportMode: formData.transportMode,
        distance: parseFloat(formData.distance),
        weight: parseFloat(formData.weight),
        loadFactor: parseFloat(formData.loadFactor),
        emissions: result,
        route: {
          origin: formData.origin,
          destination: formData.destination
        }
      };
      
      onAddCalculation(calculation);
      
      // Reset form
      setFormData({
        transportMode: 'truck',
        origin: '',
        destination: '',
        distance: '',
        weight: '',
        loadFactor: '1'
      });
      setResult(null);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-50 rounded-lg">
          <Calculator className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Carbon Emissions Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transport Mode
            </label>
            <select
              value={formData.transportMode}
              onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            >
              {transportModes.map((mode) => (
                <option key={mode.id} value={mode.id}>
                  {mode.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Origin
              </label>
              <input
                type="text"
                placeholder="City/Port"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Destination
              </label>
              <input
                type="text"
                placeholder="City/Port"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance (km)
            </label>
            <input
              type="number"
              placeholder="0"
              value={formData.distance}
              onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" />
                Weight (tonnes)
              </label>
              <input
                type="number"
                placeholder="0"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Gauge className="inline h-4 w-4 mr-1" />
                Load Factor
              </label>
              <input
                type="number"
                min="0"
                max="1"
                step="0.1"
                value={formData.loadFactor}
                onChange={(e) => setFormData({ ...formData, loadFactor: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <button
          onClick={handleCalculate}
          disabled={!formData.distance || !formData.weight}
          className="flex-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
        >
          Calculate Emissions for kalaivani
        </button>
        
        {result !== null && (
          <button
            onClick={handleSave}
            disabled={!formData.origin || !formData.destination}
            className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            Save to History
          </button>
        )}
      </div>

      {result !== null && (
        <div className="mt-6 p-4 bg-emerald-50 rounded-lg border-l-4 border-emerald-400">
          <div className="flex items-center justify-between">
            <span className="text-emerald-800 font-medium">Estimated Emissions:</span>
            <span className="text-xl font-bold text-emerald-900">
              {formatEmissions(result)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
