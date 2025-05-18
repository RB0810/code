import React, { useState, useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { EnergyDataPoint } from '../types';

const timeRanges: Record<string, number> = {
  '1M': 60 * 1000,
  '3M': 3 * 60 * 1000,
};

type Props = {
  data: EnergyDataPoint[];
};

const EnergyHistogramChart: React.FC<Props> = ({ data }) => {
  const [range, setRange] = useState<'1M' | '3M' >('1M');

  const firstTimestamp = data.length ? new Date(data[0].timestamp).getTime() : 0;

  const numericData = useMemo(() => {
    return data.map((d) => ({
      ...d,
      timeSinceStart: new Date(d.timestamp).getTime() - firstTimestamp,
    }));
  }, [data]);

  const now = numericData.length ? numericData[numericData.length - 1].timeSinceStart : 0;
  const cutoff = now - timeRanges[range];

  const filteredData = numericData.filter((d) => d.timeSinceStart >= cutoff);

  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-semibold ml-4">Energy Consumption (kWh)</h2>
        <div className="flex gap-2 text-sm">
          {(['1M', '3M'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setRange(r)}
              className={`px-2 py-1 rounded border ${
                range === r ? 'bg-orange-100 border-orange-500 text-orange-700' : 'border-gray-300'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeSinceStart"
            type="number"
            domain={[cutoff < 0 ? 0 : cutoff, now]}
            tick={false} // <-- removes all X axis labels
            axisLine={false} // optional: hides axis line too
          />
          <YAxis domain={[60, 180]} />
          <Tooltip
            labelFormatter={(val: any, payload: any[]) => {
              const timestamp = payload?.[0]?.payload?.timestamp;
              return timestamp ? new Date(timestamp).toLocaleString() : '';
            }}
            formatter={(value: any) => [`${value} kWh`, 'Energy']}
          />
          <Area
            type="monotone"
            dataKey="energy"
            stroke="#F97316"
            fill="#FDBA74"
            strokeWidth={2}
            dot={{ r: 1.5 }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnergyHistogramChart;