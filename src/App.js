import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import { BrandProvider } from './context/BrandContext';

function App() {
  return (
    <BrandProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </BrandProvider>
  );
}

export default App;
