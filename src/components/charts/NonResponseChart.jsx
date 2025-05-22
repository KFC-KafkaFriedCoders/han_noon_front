import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';
import NonResponseCardItem from '../common/ui/cards/NonResponseCardItem';

const NonResponseChart = ({
  title,
  nonResponseArr = [],
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="yellow"
    >
      <div className="h-80 overflow-y-auto custom-scrollbar p-1">
        {nonResponseArr.length > 0 ? (
          <ul className="space-y-2">
            {nonResponseArr.map((store, index) => {
              return (
                <NonResponseCardItem
                  key={store.id || index}
                  store={store}
                  accentColor="yellow"
                  onClick={onCardClick}
                />
              );
            })}
          </ul>
        ) : (
          <LoadingState 
            title="비응답 매장 데이터 준비중"
            message="비응답 매장 정보를 기다리는 중입니다..."
            color="yellow"
            icon={
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            }
          />
        )}
      </div>
    </ChartPanel>
  );
};

export default NonResponseChart;