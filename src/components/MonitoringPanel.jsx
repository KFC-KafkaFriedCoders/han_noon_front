import DashBoardChart from './charts/DashBoardChart';
import PaymentLimitWebSocket from '../WebSocket/PaymentLimitWebSocket';

const MonitoringPanel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-2">
      <DashBoardChart title="누적 매출" multiLine namespace />
      <DashBoardChart title="이상 결제 탐지" multiLine namespace />

      <DashBoardChart title="무응답 탐지" multiLine namespace />
      <DashBoardChart title="실시간 금액 업데이트" multiLine namespace />

      <PaymentLimitWebSocket/>
    </div>
  );
};

export default MonitoringPanel;
