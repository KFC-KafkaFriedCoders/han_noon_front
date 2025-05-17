import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SystemMonitor from './pages/SystemMonitor';
import MainDashboard from './pages/MainDashboard';
import PaymentLimitWebSocket from './WebSocket/PaymentLimitWebSocket';
import { BrandProvider } from './context/BrandContext';

function App() {
  return (
    <BrandProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="/monitor" element={<SystemMonitor />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </BrandProvider>
  );
}

export default App;
