import React from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const SalesMinuteChart = ({
  title,
  salesMinuteArr = [],
  onCardClick = () => {},
}) => {
  return (
    <ChartPanel 
      title={title}
      color="gray"
    >
      <div className="h-80 overflow-y-auto custom-scrollbar p-1">
        {salesMinuteArr.length > 0 ? (
          <ul className="space-y-2">
            {salesMinuteArr.map((data, index) => {
              const messageText = `총 매출: ₩${(data.total_sales || 0).toLocaleString()} | 매장 수: ${data.store_count || 0}개 | Franchise ID: ${data.franchise_id || 'N/A'}`;
              
              return (
                <li
                  key={data.id || index}
                  className="relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200"
                  onClick={() => onCardClick(data.id)}
                >
                  <div className="text-white">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-gray-400">
                        {data.store_brand || ''}
                      </span>
                    </div>
                    <div className="bg-gray-700 p-2 rounded-md mb-2">
                      {messageText}
                    </div>
                    {data.update_time && (
                      <div className="text-xs text-gray-400 text-right">
                        {data.update_time}
                      </div>
                    )}
                    {data.server_received_time && (
                      <div className="text-xs text-gray-500 text-right mt-1">
                        수신: {data.server_received_time}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <LoadingState 
            title="1분당 매출 데이터 준비중"
            message="1분당 매출 정보를 기다리는 중입니다..."
            color="teal"
            icon={
              <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
              </svg>
            }
          />
        )}
      </div>
    </ChartPanel>
  );
};

export default SalesMinuteChart;