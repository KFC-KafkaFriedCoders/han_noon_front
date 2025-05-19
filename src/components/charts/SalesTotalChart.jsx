import React from "react";

const SalesTotalChart = ({
  title,
  salesArr = [],
  onCardClick = () => {},
}) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-green-500`}></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
      </div>

      <div className="h-80 overflow-y-auto">
        {salesArr.length > 0 ? (
          <ul className="space-y-2">
            {salesArr.map((msg, index) => {
              return (
                <li
                  key={msg.id || index}
                  className="bg-gray-800 text-gray-200 p-3 rounded text-sm cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onCardClick(msg.id)}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-300">
                        {msg.store_brand || '브랜드 정보 없음'}
                      </span>
                      <span className="text-xs text-gray-400">
                        매장 {msg.store_count || 0}개
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">총 매출:</span>
                      <span className="text-green-400 font-mono">
                        ₩{(msg.total_sales || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    {msg.franchise_id && (
                      <div className="text-xs text-gray-500">
                        가맹점 ID: {msg.franchise_id}
                      </div>
                    )}
                    
                    {(msg.update_time || msg.server_received_time) && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.update_time || msg.server_received_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-8">
            <div className="bg-gray-700 p-6 rounded-lg text-center max-w-sm">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">매출 데이터 준비중</h3>
              <p className="text-gray-400 text-sm">
                매출 정보를 기다리는 중입니다...
              </p>
              <div className="mt-4">
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-200"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTotalChart;
