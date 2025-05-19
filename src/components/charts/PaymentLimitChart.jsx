import React from "react";

const PaymentLimitChart = ({
  title,
  multiLine = false,
  namespace = false,
  paymentArr = [],
}) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full mr-2 ${"bg-green-500"}`}></div>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      </div>

      <div className="h-80 overflow-y-auto">
        {paymentArr.length > 0 ? (
          <ul className="space-y-2">
            {paymentArr.map((msg, index) => {
              const messageText = msg.alert_message || msg.alertMessage;
              
              return (
                <li
                  key={index}
                  className="bg-gray-800 text-gray-200 p-2 rounded text-sm"
                >
                  <div>{messageText}</div>
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