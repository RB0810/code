import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceArea,
  Cell,
} from 'recharts';
import type { PHDataPoint } from '../types';

type Props = {
  data: PHDataPoint[];
};

const PHChart: React.FC<Props> = ({ data }) => {
  const firstTimestamp = data.length ? new Date(data[0].timestamp).getTime() : 0;

  const numericData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      timeSinceStart: new Date(point.timestamp).getTime() - firstTimestamp,
    }));
  }, [data]);

  const now = numericData.length ? numericData[numericData.length - 1].timeSinceStart : 0;

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold ml-4">pH Levels</h2>
      </div>

      <div className="text-xs text-gray-600 ml-4 mb-1">
        Ideal pH range highlighted (6.8 – 8)
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={numericData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeSinceStart"
            type="number"
            domain={[-500, now]}
            tick={false}
            axisLine={false}
          />
          <YAxis domain={[6.2, 8.2]} />
          <Tooltip
            formatter={(value: any) => [`${value}`, 'pH']}
            labelFormatter={(value: any, payload: any[]) => {
              const timestamp = payload?.[0]?.payload?.timestamp;
              return timestamp ? new Date(timestamp).toLocaleString() : '';
            }}
          />

          <ReferenceArea
            y1={6.8}
            y2={8.0}
            fill="#bbf7d0"
            fillOpacity={0.4}
            strokeOpacity={0}
          />

          <Bar dataKey="pH" isAnimationActive={false}>
            {numericData.map((point, idx) => {
              const isAbnormal = point.pH < 6.8 || point.pH > 8.0;
              return (
                <Cell
                  key={`cell-${idx}`}
                  fill={isAbnormal ? '#60A5FA' : '#10B981'}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PHChart;