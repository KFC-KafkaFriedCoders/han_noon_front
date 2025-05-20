import React from 'react';

const LoadingState = ({ 
  title = '데이터 준비중', 
  message = '정보를 기다리는 중입니다...', 
  icon, 
  color = 'blue' 
}) => {
  const defaultIcon = (
    <svg className={`w-6 h-6 text-${color}-500`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg">
      <div className={`bg-${color}-900/30 p-3 rounded-full mb-3`}>
        {icon || defaultIcon}
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-xs mb-3">
        {message}
      </p>
      <div className="flex space-x-2 justify-center">
        <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
        <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
        <div className={`w-2 h-2 bg-${color}-500 rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
      </div>
    </div>
  );
};

export default LoadingState;