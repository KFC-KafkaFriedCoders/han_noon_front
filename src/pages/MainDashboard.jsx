import React from 'react';
import HeaderNew from '../components/HeaderNew';
import CommandInput from '../components/CommandInput';
import MonitoringPanel from '../components/MonitoringPanel';
import { useTheme } from '../context/theme/ThemeContext';

const MainDashboard = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} transition-colors duration-300 ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
      <HeaderNew />
      <div className="px-4 py-2">
        <CommandInput />
        <MonitoringPanel />
      </div>
    </div>
  );
};

export default MainDashboard;