import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SystemMonitor from './pages/SystemMonitor';
import MainDashboard from './pages/MainDashboard';
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainDashboard />} />
        <Route path="/monitor" element={<SystemMonitor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
