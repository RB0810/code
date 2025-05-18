import { useState } from 'react';
import Header from './components/Header';
import InflowOutflowChart from './components/InflowOutflowChart';
import AnomalyAlertsPanel from './components/AnomalyAlertsPanel';
import ActuatorPanel from './components/ActuatorPanel';
import { useWebSocket } from './hooks/useWebSocket';
import PHChart from './components/PHChart';
import EnergyHistogramChart from './components/EnergyChart';
import ChemicalChart from './components/ChemicalChart';

function App() {
  const {
    FlowchartData,
    lastUpdated,
    anomalies,
    systemStatus,
    energyData,
    phData,
    chemicalData,
  } = useWebSocket();

  const [activeTab, setActiveTab] = useState<'charts' | 'status'>('charts');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header lastUpdated={lastUpdated} />

      <main className="p-4 space-y-6">

        <div className="hidden lg:block space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 flex flex-col gap-4">
              <InflowOutflowChart data={FlowchartData} />
              <ChemicalChart data={chemicalData} />
            </div>
            <div className="flex flex-col gap-4">
              <ActuatorPanel status={systemStatus} layout="vertical" />
              <AnomalyAlertsPanel anomalies={anomalies} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <PHChart data={phData} />
            <EnergyHistogramChart data={energyData} />
          </div>
        </div>


        <div className="lg:hidden">
          <div className="flex border-b border-gray-300 mb-4">
            <button
              onClick={() => setActiveTab('charts')}
              className={`flex-1 text-center py-2 font-medium ${
                activeTab === 'charts' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
            >
              Time Series Plots
            </button>
            <button
              onClick={() => setActiveTab('status')}
              className={`flex-1 text-center py-2 font-medium ${
                activeTab === 'status' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'
              }`}
            >
              Status & Anomalies
            </button>
          </div>

          {activeTab === 'charts' && (
            <div className="space-y-4">
              <InflowOutflowChart data={FlowchartData} />
              <ChemicalChart data={chemicalData} />
              <PHChart data={phData} />
              <EnergyHistogramChart data={energyData} />
            </div>
          )}

          {activeTab === 'status' && (
            <div className="space-y-4">
              <ActuatorPanel status={systemStatus} layout="horizontal" />
              <AnomalyAlertsPanel anomalies={anomalies} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;