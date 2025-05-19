import React from "react";

const PaymentLimitChart = ({
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
              const messageText = msg.alert_message || msg.alertMessage;
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
                  {msg.time && (
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(msg.time).toLocaleString()}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">
              수신된 데이터가 없습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentLimitChart;