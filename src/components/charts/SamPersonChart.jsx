import React from "react";

const SamePersonChart = ({
  title,
  multiLine = false,
  namespace = false,
  paymentArr = [],
  unreadMessages = new Set(),
  onCardClick = () => {},
}) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${"bg-green-500"}`}></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        {unreadMessages.size > 0 && (
          <div className="flex items-center">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
              {unreadMessages.size}
            </span>
          </div>
        )}
      </div>

      <div className="h-80 overflow-y-auto">
        {paymentArr.length > 0 ? (
          <ul className="space-y-2">
            {paymentArr.map((msg, index) => {
              const messageText = msg.alertMessage || msg.alert_message; // 두 속성명 모두 체크
              const isUnread = unreadMessages.has(msg.id);
              
              return (
                <li
                  key={msg.id || index}
                  className={`relative bg-gray-800 text-gray-200 p-2 rounded text-sm cursor-pointer hover:bg-gray-700 transition-colors ${
                    isUnread ? 'border-l-4 border-red-500' : ''
                  }`}
                  onClick={() => onCardClick(msg.id)}
                >
                  {isUnread && (
                    <div className="absolute top-1 right-1">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500 text-white animate-pulse">
                        NEW
                      </span>
                    </div>
                  )}
                  <div className={isUnread ? 'pr-12' : ''}>{messageText}</div>
                  {msg.server_received_time && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.server_received_time).toLocaleString()}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="bg-gray-800 p-6 rounded-lg text-center max-w-sm">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">동일인 결제 데이터 준비중</h3>
              <p className="text-gray-400 text-sm">
                동일인 결제 탐지 정보를 기다리는 중입니다...
              </p>
              <div className="mt-4">
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SamePersonChart;