import React from 'react';

const DataCard = ({ 
  label, 
  value, 
  color = 'blue', 
  prefix = '', 
  formatNumber = true,
  children 
}) => {
  const formattedValue = formatNumber && typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div className="bg-gray-700 rounded-lg p-3">
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-xl font-bold text-${color}-400 font-mono`}>
        {prefix}{formattedValue}
        {children}
      </div>
    </div>
  );
};

export default DataCard;