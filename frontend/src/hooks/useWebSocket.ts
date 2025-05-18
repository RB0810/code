import { useEffect, useRef, useState } from 'react';
import type { FlowChart, Anomaly, SystemStatus, EnergyDataPoint, PHDataPoint, ChemicalDataPoint } from '../types';

export function useWebSocket() {
  const ws = useRef<WebSocket | null>(null);
  const [FlowchartData, setFlowChartData] = useState<FlowChart>({
    labels: [],
    values: {
      inflow: [],
      outflow: [],
    },
  });
  const [lastUpdated, setLastUpdated] = useState<string | undefined>(undefined);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [energyData, setEnergyData] = useState<EnergyDataPoint[]>([]);
  const [phData, setPhData] = useState<PHDataPoint[]>([]);
  const [chemicalData, setChemicalData] = useState<ChemicalDataPoint[]>([]);
  const [systemStatus, setSystemStatus] = useState<SystemStatus>({
    inflow_pump: "OFF",
    chemical_doser: "OFF",
    filtration_unit: "OFF",
  });


  useEffect(() => {
    ws.current = new WebSocket('ws://localhost:8080');

    ws.current.onmessage = (event) => {
      const row = JSON.parse(event.data);

      const timestamp = row.timestamp?.split('.')[0];
      if (timestamp) setLastUpdated(timestamp);

      setFlowChartData((prev) => ({
        labels: [...prev.labels, timestamp],
        values: {
          inflow: [...prev.values.inflow, parseFloat(row.water_inflow_m3)],
          outflow: [...prev.values.outflow, parseFloat(row.water_outflow_m3)],
        },
      }));

      if (row.anomaly_alerts && row.anomaly_alerts !== "Normal") {

        const issues = row.anomaly_alerts
          .split(',')
          .map((s: string) => s.trim())
          .filter(Boolean);

        const newAnomalies: Anomaly[] = issues.map((issue: string) => ({
          timestamp,
          type: issue,
        }));

        if (newAnomalies.length > 0) {
          setAnomalies((prev) => [...prev, ...newAnomalies]);
        }
      }

      setSystemStatus({
        inflow_pump: row.inflow_pump_state,
        chemical_doser: row.chemical_doser_state,
        filtration_unit: row.filtration_unit_state,
      });

      setEnergyData((prev) => [
        ...prev,
        {
          timestamp: timestamp,
          energy: parseFloat(row.energy_kwh),
        },
      ]);

      setPhData((prev) => [
        ...prev.slice(-60),
        { timestamp: timestamp, pH: parseFloat(row.pH) },
      ]);

      setChemicalData((prev) => [
        ...prev,
        {
          timestamp: timestamp,
          turbidity: parseFloat(row.turbidity_NTU),
          alum: parseFloat(row.alum_mg_per_l),
          chlorine: parseFloat(row.chlorine_mg_per_l),
        },
      ]);

    };

    return () => {
      ws.current?.close();
    };
  }, []);

  return { FlowchartData, lastUpdated, anomalies, systemStatus, energyData, phData, chemicalData };
}