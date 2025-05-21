import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const NonResponseChart = ({
  title,
  nonResponseArr = [],
  unreadMessages = new Set(),
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="yellow"
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
      <div className="h-80 overflow-y-auto custom-scrollbar p-1">
        {nonResponseArr.length > 0 ? (
          <ul className="space-y-2">
            {nonResponseArr.map((store, index) => {
              const isUnread = unreadMessages.has(store.id);
              
              return (
                <li
                  key={store.id || index}
                  className={`relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200 ${
                    isUnread ? 'border-l-4 border-yellow-500 shadow-lg' : ''
                  }`}
                  onClick={() => onCardClick(store.id)}
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
                      <span className="text-yellow-400 font-medium">비응답 매장</span>
                      <span className="text-xs text-gray-400">
                        {store.store_brand || ''}
                      </span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded-md mb-2 flex justify-between">
                      <div>
                        <span className="text-white font-semibold">{store.store_name}</span>
                        <span className="text-gray-400 text-xs ml-2">(ID: {store.store_id})</span>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        {store.inactive_time}분
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      <span>마지막 활동: {store.last_activity}</span>
                    </div>
                    {store.server_received_time && (
                      <div className="text-xs text-gray-400 text-right mt-1">
                        수신: {store.server_received_time}
                      </div>
                    )}
                  </div>
                </li>
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