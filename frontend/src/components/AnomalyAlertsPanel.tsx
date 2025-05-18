import React, { useState, useMemo } from 'react';
import type { Anomaly } from '../types';

type Props = {
  anomalies: Anomaly[];
};

const colorMap: Record<string, string> = {
  "High Chlorine": 'bg-red-100 border-red-400 text-red-800',
  "High Turbidity": 'bg-yellow-100 border-yellow-400 text-yellow-800',
  "Abnormal pH": 'bg-blue-100 border-blue-400 text-blue-800',
  "Backflow Risk": 'bg-purple-100 border-purple-400 text-purple-800',
  "Unknown": 'bg-gray-100 border-gray-400 text-gray-800',
};

const groupByTimestamp = (anomalies: Anomaly[]) => {
  const grouped: Record<string, Anomaly[]> = {};
  for (const anomaly of anomalies) {
    if (!grouped[anomaly.timestamp]) {
      grouped[anomaly.timestamp] = [];
    }
    grouped[anomaly.timestamp].push(anomaly);
  }
  return grouped;
};

const AnomalyAlertsPanel: React.FC<Props> = ({ anomalies }) => {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([
    "Backflow Risk", "High Turbidity", "Abnormal pH", "High Chlorine"
  ]);
  const [timeRange, setTimeRange] = useState<'All' | 'Last Minute' | 'Last 5 Minutes' | 'Last Hour'>('All');

  const firstTimestamp = anomalies.length ? new Date(anomalies[0].timestamp).getTime() : 0;

  // Prepare anomalies with simulation-relative time
  const numericAnomalies = useMemo(() => {
    return anomalies.map((a) => ({
      ...a,
      timeSinceStart: new Date(a.timestamp).getTime() - firstTimestamp,
    }));
  }, [anomalies, firstTimestamp]);

  const now = numericAnomalies.length
    ? numericAnomalies[numericAnomalies.length - 1].timeSinceStart
    : 0;

  const cutoff = useMemo(() => {
    if (timeRange === 'Last Minute') return now - 60 * 1000;
    if (timeRange === 'Last 5 Minutes') return now - 5 * 60 * 1000;
    if (timeRange === 'Last Hour') return now - 60 * 60 * 1000;
    return 0;
  }, [timeRange, now]);

  const filtered = useMemo(() => {
    return numericAnomalies.filter((a) =>
      selectedTypes.includes(a.type) &&
      (timeRange === 'All' || a.timeSinceStart >= cutoff)
    );
  }, [numericAnomalies, selectedTypes, cutoff, timeRange]);

  const grouped = groupByTimestamp(filtered.slice().reverse());

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md shadow-sm bg-white">
      <div className="flex justify-between mb-3 flex-wrap gap-2 items-start">
        <h2 className="text-lg font-semibold">Anomaly Alerts</h2>
        <div className="flex flex-col items-end text-sm gap-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as 'All' | 'Last Minute' | 'Last 5 Minutes' | 'Last Hour')}
            className="border border-gray-300 rounded px-2 py-1 text-sm"
          >
            <option>All</option>
            <option>Last Minute</option>
            <option>Last 5 Minutes</option>
            <option>Last Hour</option>
          </select>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-right">
            {Object.keys(colorMap).filter(type => type !== "Unknown").map((type) => (
              <label key={type} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                />
                <span className={`px-2 py-0.5 rounded ${colorMap[type]}`}>{type}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto space-y-4">
        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-500">No matching anomalies.</p>
        ) : (
          Object.entries(grouped).map(([timestamp, entries], groupIdx) => (
            <div key={groupIdx} className="p-3 border rounded-md bg-gray-50 shadow-sm">
              <div className="text-xs text-gray-500 mb-1">{timestamp}</div>
              <div className="space-y-2">
                {entries.map((entry, idx) => (
                  <div
                    key={idx}
                    className={`border-l-4 p-2 rounded ${colorMap[entry.type] || colorMap.Unknown}`}
                  >
                    <div className="font-semibold">{entry.type}</div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnomalyAlertsPanel;