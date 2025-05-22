import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';
import AlertCardItem from '../common/ui/cards/AlertCardItem';

const PaymentLimitChart = ({
  title,
  paymentArr = [],
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="green"
    >
      <div className="h-80 overflow-y-auto custom-scrollbar p-1">
        {paymentArr.length > 0 ? (
          <ul className="space-y-2">
            {paymentArr.map((msg, index) => {
              const messageText = msg.alert_message || msg.alertMessage;
              
              return (
                <AlertCardItem
                  key={msg.id || index}
                  item={msg}
                  messageText={messageText}
                  accentColor="green"
                  timeField="time"
                  titleText="정보"
                  onClick={onCardClick}
                />
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