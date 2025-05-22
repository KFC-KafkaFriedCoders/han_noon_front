import React from 'react';
import { useTheme } from '../../../context/theme/ThemeContext';

const LoadingState = ({ 
  title = '데이터 준비중', 
  message = '정보를 기다리는 중입니다...', 
  icon, 
  color = 'blue' 
}) => {
  const { isDarkMode } = useTheme();
  
  const getIconClass = () => {
    switch(color) {
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      case 'orange': return 'text-orange-500';
      case 'yellow': return 'text-yellow-500';
      case 'purple': return 'text-purple-500';
      case 'teal': return 'text-teal-500';
      default: return 'text-gray-500';
    }
  };

  const getBgClass = () => {
    const bgColorMap = {
      green: isDarkMode ? 'bg-green-900/30' : 'bg-green-100',
      blue: isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100',
      orange: isDarkMode ? 'bg-orange-900/30' : 'bg-orange-100',
      yellow: isDarkMode ? 'bg-yellow-900/30' : 'bg-yellow-100',
      purple: isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100',
      teal: isDarkMode ? 'bg-teal-900/30' : 'bg-teal-100',
    };
    return bgColorMap[color] || (isDarkMode ? 'bg-gray-900/30' : 'bg-gray-100');
  };

  const defaultIcon = (
    <svg className={`w-6 h-6 ${getIconClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
    </svg>
  );

  const renderDots = (color) => (
    <>
      <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </>
  );

  return (
    <div className={`flex flex-col items-center justify-center py-6 rounded-lg transition-colors duration-300 ${
      isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className={`p-3 rounded-full mb-3 ${getBgClass()}`}>
        {icon || defaultIcon}
      </div>
      <h3 className={`font-semibold mb-1 transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        {title}
      </h3>
      <p className={`text-xs mb-3 transition-colors duration-300 ${
        isDarkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {message}
      </p>
      <div className="flex space-x-2 justify-center mt-2">
        {renderDots(color)}
      </div>
    </div>
  );
};

export default LoadingState;