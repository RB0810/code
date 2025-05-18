export type FlowChart = {
  labels: string[];
  values: {
    inflow: number[];
    outflow: number[];
  };
};

export type Anomaly = {
  timestamp: string;
  type: string;
};

export type SystemStatus = {
  inflow_pump: string;
  chemical_doser: string;
  filtration_unit: string;
};

export type EnergyDataPoint = {
  timestamp: string;
  energy: number;
};

export type PHDataPoint = {
  timestamp: string;
  pH: number;
};

export type ChemicalDataPoint = {
  timestamp: string;
  turbidity: number;
  alum: number;
  chlorine: number;
};
