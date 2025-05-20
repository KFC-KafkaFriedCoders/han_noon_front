import React from 'react';

const ChartPanel = ({ 
  title, 
  color = 'blue', 
  children, 
  rightComponent 
}) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-${color}-500`}></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        {rightComponent}
      </div>
      
      {children}
    </div>
  );
};

export default ChartPanel;