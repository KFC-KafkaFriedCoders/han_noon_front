import React from 'react';
import Header from './components/Header';
import CommandInput from './components/CommandInput';
import MonitoringPanel from './components/MonitoringPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-800 text-white">
      <Header />
      <div className="container mx-auto px-4 py-2">
        <CommandInput />
        <MonitoringPanel />
      </div>
    </div>
  );
}

export default App;
