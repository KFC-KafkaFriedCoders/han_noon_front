import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const PaymentLimitChart = ({
  title,
  paymentArr = [],
  unreadMessages = new Set(),
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="green"
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
              const messageText = msg.alert_message || msg.alertMessage;
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
                      <span className="text-green-400 font-medium">알림</span>
                      <span className="text-xs text-gray-400">
                        {msg.store_brand || ''}
                      </span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded-md mb-2">
                      {messageText}
                    </div>
                    {msg.time && (
                      <div className="text-xs text-gray-400 text-right">
                        {new Date(msg.time).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <LoadingState 
            title="이상 결제 데이터 준비중"
            message="이상 결제 탐지 정보를 기다리는 중입니다..."
            color="green"
            icon={
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
              </svg>
            }
          />
        )}
      </div>
    </ChartPanel>
  );
};

export default PaymentLimitChart;