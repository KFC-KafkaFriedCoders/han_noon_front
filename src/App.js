import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import { BrandProvider } from './context/BrandContext';
import { ThemeProvider } from './context/theme/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrandProvider>
        <Router>
          <Routes>
            <Route path="/" element={<MainDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </BrandProvider>
    </ThemeProvider>
  );
}

export default App;
