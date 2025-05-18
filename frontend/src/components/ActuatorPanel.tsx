import React from 'react';
import ActuatorCard from './ActuatorCard';
import type { SystemStatus } from '../types';

type Props = {
  status: SystemStatus;
  layout?: 'horizontal' | 'vertical';
};

const ActuatorPanel: React.FC<Props> = ({ status, layout = 'horizontal' }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-medium">System Status</h2>

      <div
        className={`grid gap-4 ${
          layout === 'vertical' ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
        }`}
      >
        <ActuatorCard name="Inflow Pump" status={status.inflow_pump as any} />
        <ActuatorCard name="Chemical Doser" status={status.chemical_doser as any} />
        <ActuatorCard name="Filtration Unit" status={status.filtration_unit as any} />
      </div>
    </div>
  );
};

export default ActuatorPanel;