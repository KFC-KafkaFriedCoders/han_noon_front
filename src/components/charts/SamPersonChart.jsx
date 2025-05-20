import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const SamePersonChart = ({
  title,
  paymentArr = [],
  unreadMessages = new Set(),
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="orange"
      rightComponent={
        unreadMessages.size > 0 && (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              {unreadMessages.size}
            </span>
          </div>
        )
      }
    >
      <div className="h-80 overflow-y-auto">
        {paymentArr.length > 0 ? (
          <ul className="space-y-2">
            {paymentArr.map((msg, index) => {
              const messageText = msg.alertMessage || msg.alert_message;
              const isUnread = unreadMessages.has(msg.id);
              
              return (
                <li
                  key={msg.id || index}
                  className={`relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200 ${
                    isUnread ? 'border-l-4 border-red-500 shadow-lg' : ''
                  }`}
                  onClick={() => onCardClick(msg.id)}
                >
                  {isUnread && (
                    <div className="absolute top-2 right-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}
                  
                  <div className={`${isUnread ? 'pr-16' : ''} text-white`}>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-orange-400 font-medium">동일인 알림</span>
                      <span className="text-xs text-gray-400">
                        {msg.store_brand || ''}
                      </span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded-md mb-2">
                      {messageText}
                    </div>
                    {msg.server_received_time && (
                      <div className="text-xs text-gray-400 text-right">
                        {new Date(msg.server_received_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <LoadingState 
            title="동일인 결제 데이터 준비중"
            message="동일인 결제 탐지 정보를 기다리는 중입니다..."
            color="orange"
            icon={
              <svg className="w-8 h-8 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
              </svg>
            }
          />
        )}
      </div>
    </ChartPanel>
  );
};

export default SamePersonChart;