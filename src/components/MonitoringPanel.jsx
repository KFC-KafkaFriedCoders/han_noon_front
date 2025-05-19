import PaymentLimitWebSocket from '../WebSocket/PaymentLimitWebSocket';

const MonitoringPanel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-2">
      <PaymentLimitWebSocket/>
    </div>
  );
};

export default MonitoringPanel;
