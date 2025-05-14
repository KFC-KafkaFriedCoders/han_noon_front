import CPUChart from './charts/CPUChart';

const MonitoringPanel = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <CPUChart title="CPU Usage by Infra Namespace" multiLine namespace />
      <CPUChart title="CPU Usage by App Namespace" multiLine namespace />

      <CPUChart title="CPU Usage by Infra Namespace" multiLine namespace />
      <CPUChart title="CPU Usage by App Namespace" multiLine namespace />

      <CPUChart title="CPU Usage by Infra Namespace" multiLine namespace />
      <CPUChart title="CPU Usage by App Namespace" multiLine namespace />
    </div>
  );
};

export default MonitoringPanel;
