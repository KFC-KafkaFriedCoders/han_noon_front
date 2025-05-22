import React from 'react';
import { useTheme } from '../../../context/theme/ThemeContext';

const DataCard = ({ 
  label, 
  value, 
  color = 'blue', 
  prefix = '', 
  formatNumber = true,
  children 
}) => {
  const { isDarkMode } = useTheme();
  const formattedValue = formatNumber && typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div className={`rounded-lg p-3 transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-700' : 'bg-white border border-gray-200'
    }`}>
      <div className={`text-xs mb-1 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {label}
      </div>
      <div className={`text-xl font-bold text-${color}-500 font-mono`}>
        {prefix}{formattedValue}
        {children}
      </div>
    </div>
  );
};

export default DataCard;