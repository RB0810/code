import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';
import type { FlowChart } from '../types';

const timeRanges: Record<string, number> = {
  '1M': 60 * 1000,
  '3M': 3 * 60 * 1000,
};

type Props = {
  data: FlowChart;
};

const InflowOutflowChart: React.FC<Props> = ({ data }) => {
  const [range, setRange] = useState<'1M' | '3M'>('1M');
  const [showInflow, setShowInflow] = useState(true);
  const [showOutflow, setShowOutflow] = useState(true);

  const firstTimestamp = data.labels.length ? new Date(data.labels[0]).getTime() : 0;

  const numericData = useMemo(() => {
    return data.labels.map((label, idx) => {
      const inflow = data.values.inflow[idx];
      const outflow = data.values.outflow[idx];
      const currentTime = new Date(label).getTime();
      return {
        timestamp: label,
        timeSinceStart: currentTime - firstTimestamp,
        inflow,
        outflow,
      };
    });
  }, [data]);

  const now = numericData.length ? numericData[numericData.length - 1].timeSinceStart : 0;
  const cutoff = now - timeRanges[range];
  const filteredData = numericData.filter((d) => d.timeSinceStart >= cutoff);

  return (
    <div>
      <div className="flex justify-between items-start mb-2 flex-wrap gap-2">
        <h2 className="text-lg font-medium ml-4">Water Flow</h2>
        <div className="flex flex-col items-end">
          <div className="flex gap-2 text-sm mb-1">
            {(['1M', '3M'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded border ${
                  range === r ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-gray-300'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <div className="flex gap-4 text-sm items-center mb-1">
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showInflow} onChange={() => setShowInflow(!showInflow)} />
              <span className="text-blue-600 font-medium">Inflow</span>
            </label>
            <label className="flex items-center gap-1">
              <input type="checkbox" checked={showOutflow} onChange={() => setShowOutflow(!showOutflow)} />
              <span className="text-orange-600 font-medium">Outflow</span>
            </label>
          </div>
          <div className="flex gap-6 text-sm">
            {showInflow && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-blue-600" />
                <span className="text-blue-600">inflow</span>
              </div>
            )}
            {showOutflow && (
              <div className="flex items-center gap-2">
                <div className="w-4 h-1 bg-orange-600" />
                <span className="text-orange-600">outflow</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeSinceStart"
            type="number"
            domain={[cutoff < 0 ? 0 : cutoff, now]}
            tick={false}
            axisLine={false}
          />
          <YAxis
            domain={[700, 2200]}
            tickFormatter={(value) => `${value} m³`}
          />
          <Tooltip
            labelFormatter={(value: any, payload: any[]) => {
              const timestamp = payload?.[0]?.payload?.timestamp;
              return timestamp ? new Date(timestamp).toLocaleString() : '';
            }}
            formatter={(value: any, name: string) => [`${value}`, name]}
          />
          {showInflow && (
            <Area
              type="monotone"
              dataKey="inflow"
              stroke="#2563eb"
              strokeWidth={1.2}
              fill="#bfdbfe"
              fillOpacity={0.4}
              isAnimationActive={false}
            />
          )}
          {showOutflow && (
            <Area
              type="monotone"
              dataKey="outflow"
              stroke="#f97316"
              strokeWidth={1.2}
              fill="#fcd34d"
              fillOpacity={0.3}
              isAnimationActive={false}
            />
          )}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default InflowOutflowChart;