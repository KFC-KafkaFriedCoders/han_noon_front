import React from "react";
import { useTheme } from '../../context/theme/ThemeContext';
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';
import AlertCardItem from '../common/ui/cards/AlertCardItem';

const SamePersonChart = ({
  title,
  paymentArr = [],
  onCardClick = () => {},
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <ChartPanel 
      title={title}
      color="orange"
    >
      <div className="h-80 overflow-y-auto custom-scrollbar p-1">
        {paymentArr.length > 0 ? (
          <ul className="space-y-2">
            {paymentArr.map((msg, index) => {
              const messageText = msg.alertMessage || msg.alert_message;
              
              return (
                <AlertCardItem
                  key={msg.id || index}
                  item={msg}
                  messageText={messageText}
                  accentColor="orange"
                  timeField="server_received_time"
                  titleText="동일인 정보"
                  onClick={onCardClick}
                />
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