import React from 'react';
import { Power, FlaskConical, SlidersHorizontal } from 'lucide-react';

type Props = {
  name: string;
  status: "ON" | "OFF" | "MAINTENANCE";
};

const statusStyles: Record<string, string> = {
  ON: 'border-green-500',
  OFF: 'bg-red-50 border-red-500',
  MAINTENANCE: 'bg-yellow-50 border-yellow-500',
};

const statusColors: Record<string, string> = {
  ON: 'bg-green-500',
  OFF: 'bg-red-500',
  MAINTENANCE: 'bg-yellow-500',
};

const iconMap: Record<string, React.ReactNode> = {
  "Inflow Pump": <Power className="text-gray-600" />,
  "Chemical Doser": <FlaskConical className="text-gray-600" />,
  "Filtration Unit": <SlidersHorizontal className="text-gray-600" />,
};

const ActuatorCard: React.FC<Props> = ({ name, status }) => {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-md border ${statusStyles[status]}`}>
      <div className="text-gray-600">{iconMap[name]}</div>
      <div className="flex flex-col">
        <div className="text-sm font-medium">{name}</div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <div className={`w-2.5 h-2.5 rounded-full ${statusColors[status]}`} />
          <span className="font-medium">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default ActuatorCard;