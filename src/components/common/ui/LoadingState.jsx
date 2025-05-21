import React from 'react';

const LoadingState = ({ 
  title = '데이터 준비중', 
  message = '정보를 기다리는 중입니다...', 
  icon, 
  color = 'blue' 
}) => {
  const getIconClass = () => {
    switch(color) {
      case 'green': return 'text-green-500';
      case 'blue': return 'text-blue-500';
      case 'orange': return 'text-orange-500';
      case 'yellow': return 'text-yellow-500';
      case 'purple': return 'text-purple-500';
      default: return 'text-gray-500';
    }
  };

  const defaultIcon = (
    <svg className={`w-6 h-6 ${getIconClass()}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
    </svg>
  );

  return (
    <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg">
      <div className={`p-3 rounded-full mb-3 ${color === 'green' ? 'bg-green-900/30' : color === 'blue' ? 'bg-blue-900/30' : color === 'orange' ? 'bg-orange-900/30' : color === 'yellow' ? 'bg-yellow-900/30' : color === 'purple' ? 'bg-purple-900/30' : 'bg-gray-900/30'}`}>
        {icon || defaultIcon}
      </div>
      <h3 className="text-white font-semibold mb-1">{title}</h3>
      <p className="text-gray-400 text-xs mb-3">
        {message}
      </p>
      <div className="flex space-x-2 justify-center mt-2">
        {color === 'green' && (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
        {color === 'blue' && (
          <>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
        {color === 'orange' && (
          <>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
        {color === 'yellow' && (
          <>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-yellow-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
        {color === 'purple' && (
          <>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
        {color !== 'green' && color !== 'blue' && color !== 'orange' && color !== 'yellow' && color !== 'purple' && (
          <>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </>
        )}
      </div>
    </div>
  );
};

export default LoadingState;