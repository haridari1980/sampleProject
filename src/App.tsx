import React, { useState, useEffect } from 'react';
import { Leaf, TrendingUp, Package, Route, Download } from 'lucide-react';
import { MetricCard } from './components/MetricCard';
import { CarbonCalculator } from './components/CarbonCalculator';
import { EmissionsChart } from './components/EmissionsChart';
import { TransportModeBreakdown } from './components/TransportModeBreakdown';
import { RecentCalculations } from './components/RecentCalculations';
import { CarbonCalculation } from './types/carbon';
import { generateEmissionSummary, formatEmissions } from './utils/carbonCalculations';

function App() {
  const [calculations, setCalculations] = useState<CarbonCalculation[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedCalculations = localStorage.getItem('carbonCalculations');
    if (savedCalculations) {
      setCalculations(JSON.parse(savedCalculations));
    }
  }, []);

  // Save data to localStorage whenever calculations change
  useEffect(() => {
    localStorage.setItem('carbonCalculations', JSON.stringify(calculations));
  }, [calculations]);

  const handleAddCalculation = (newCalculation: Omit<CarbonCalculation, 'id'>) => {
    const calculation: CarbonCalculation = {
      ...newCalculation,
      id: Date.now().toString()
    };
    setCalculations(prev => [...prev, calculation]);
  };

  const handleDeleteCalculation = (id: string) => {
    setCalculations(prev => prev.filter(calc => calc.id !== id));
  };

  const summary = generateEmissionSummary(calculations);

  const handleExportData = () => {
    const dataStr = JSON.stringify(calculations, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `carbon-accounting-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <Leaf className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">CarbonTrack Logistics</h1>
                <p className="text-sm text-gray-600">Supply Chain Carbon Accounting</p>
              </div>
            </div>
            <button
              onClick={handleExportData}
              disabled={calculations.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Emissions"
            value={formatEmissions(summary.totalEmissions)}
            icon={Leaf}
            trend="neutral"
          />
          <MetricCard
            title="Total Distance"
            value={`${summary.totalDistance.toLocaleString()} km`}
            icon={Route}
            trend="neutral"
          />
          <MetricCard
            title="Total Freight"
            value={`${summary.totalWeight.toFixed(1)} tonnes`}
            icon={Package}
            trend="neutral"
          />
          <MetricCard
            title="Avg Efficiency"
            value={`${summary.averageEfficiency.toFixed(3)} kg/km`}
            icon={TrendingUp}
            trend="neutral"
          />
        </div>

        {/* Calculator */}
        <div className="mb-8">
          <CarbonCalculator onAddCalculation={handleAddCalculation} />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <EmissionsChart summary={summary} />
          <TransportModeBreakdown summary={summary} />
        </div>

        {/* Recent Calculations */}
        <RecentCalculations 
          calculations={calculations} 
          onDeleteCalculation={handleDeleteCalculation}
        />
      </main>
    </div>
  );
}

export default App;