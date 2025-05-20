import React from 'react';
import DataDisplay from './DataDisplay';

const MonitoringPanel = () => {
  return (
    <div className="grid lg:grid-cols-2 gap-2">
      <DataDisplay />
    </div>
  );
};

export default MonitoringPanel;
