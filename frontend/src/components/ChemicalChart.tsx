import React, { useState, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { ChemicalDataPoint } from '../types';

const timeRanges: Record<string, number> = {
  '1M': 60 * 1000,
  '5M': 5 * 60 * 1000,
  '1H' : 1* 60 * 60 * 1000,
};

type Props = {
  data: ChemicalDataPoint[];
};

const ChemicalChart: React.FC<Props> = ({ data }) => {
  const [range, setRange] = useState<'1M' | '5M' | '1H'>('1M');
  const [visibleLines, setVisibleLines] = useState<string[]>([
    'turbidity',
    'alum',
    'chlorine',
  ]);

  const colors: Record<string, string> = {
    chlorine: '#8B5CF6',
    turbidity: '#3B82F6',
    alum: '#EC4899',
  };

  const toggleLine = (key: string) => {
    setVisibleLines((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const firstTimestamp = data.length ? new Date(data[0].timestamp).getTime() : 0;

  const numericData = useMemo(() => {
    return data.map((point) => ({
      ...point,
      timeSinceStart: new Date(point.timestamp).getTime() - firstTimestamp,
    }));
  }, [data]);

  const now = numericData.length ? numericData[numericData.length - 1].timeSinceStart : 0;
  const cutoff = now - timeRanges[range];
  const filteredData = numericData.filter((d) => d.timeSinceStart >= cutoff);

  const getYDomain = () => {
    const values: number[] = [];
    filteredData.forEach((point) => {
      visibleLines.forEach((key) => {
        const val = point[key as keyof ChemicalDataPoint];
        if (typeof val === 'number' && !isNaN(val)) {
          values.push(val);
        }
      });
    });

    if (values.length === 0) return [0, 10];

    const min = Math.min(...values);
    const max = Math.max(...values);
    const padding = (max - min) * 0.2 || 1;

    return [Math.floor(min - padding), Math.ceil(max + padding)];
  };

  return (
    <div>
      <div className="flex justify-between items-start mb-3">
        <h2 className="text-lg font-semibold ml-4">Chemical Levels and Quality</h2>

        <div className="flex flex-col items-end gap-2 text-sm">
          <div className="flex gap-2">
            {(['1M', '5M', '1H'] as const).map((r) => (
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

          <div className="flex flex-col items-end gap-1">
            <div className="flex gap-4">
                {['turbidity', 'alum', 'chlorine'].map((chem) => (
                <label key={chem} className="flex items-center gap-1">
                    <input
                    type="checkbox"
                    checked={visibleLines.includes(chem)}
                    onChange={() => toggleLine(chem)}
                    />
                    <span
                    className="font-medium capitalize"
                    style={{ color: colors[chem] }}
                    >
                    {chem}
                    </span>
                </label>
                ))}
            </div>

            <div className="flex gap-6 mt-1">
            {visibleLines.includes('turbidity') && (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-blue-600" />
                    <span className="text-blue-600">turbidity</span>
                </div>
            )}

            {visibleLines.includes('alum') && (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-pink-500" />
                    <span className="text-pink-600">alum</span>
                </div>
            )}
            
            {visibleLines.includes('chlorine') && (
                <div className="flex items-center gap-2">
                    <div className="w-4 h-1 bg-purple-600" />
                    <span className="text-purple-600">chlorine</span>
                </div>
            )}
            </div>
            </div>

        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={filteredData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timeSinceStart"
            type="number"
            domain={[cutoff < 0 ? 0 : cutoff, now]}
            tick={false}
            axisLine={false}
          />
          <YAxis domain={getYDomain()} />
          <Tooltip
            labelFormatter={(val: any, payload: any[]) =>
              payload?.[0]?.payload?.timestamp
                ? new Date(payload[0].payload.timestamp).toLocaleString()
                : ''
            }
          />
          {visibleLines.includes('turbidity') && (
            <Line
              type="monotone"
              dataKey="turbidity"
              stroke={colors.turbidity}
              strokeWidth={2}
              dot={false}
              name="Turbidity"
              isAnimationActive={false}
            />
          )}
          {visibleLines.includes('alum') && (
            <Line
              type="monotone"
              dataKey="alum"
              stroke={colors.alum}
              strokeWidth={2}
              dot={false}
              name="Alum (mg/L)"
              isAnimationActive={false}
            />
          )}
          {visibleLines.includes('chlorine') && (
            <Line
              type="monotone"
              dataKey="chlorine"
              stroke={colors.chlorine}
              strokeWidth={2}
              dot={false}
              name="Chlorine (mg/L)"
              isAnimationActive={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChemicalChart;