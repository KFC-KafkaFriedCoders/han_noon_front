import React from 'react';
import { useTheme } from '../../../context/theme/ThemeContext';

const ChartPanel = ({ 
  title, 
  color = 'blue', 
  children, 
  rightComponent 
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`p-3 rounded-lg transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gray-900 border border-gray-700' 
        : 'bg-white border border-gray-200 shadow-sm'
    }`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-${color}-500`}></div>
          <h3 className={`text-sm font-medium transition-colors duration-300 ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {title}
          </h3>
        </div>
        {rightComponent}
      </div>
      
      {children}
    </div>
  );
};

export default ChartPanel;