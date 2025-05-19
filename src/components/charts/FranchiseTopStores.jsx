import React from "react";

const FranchiseTopStores = ({
  title,
  topStoresArr = [],
  onCardClick = () => {},
}) => {
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-purple-500`}></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
      </div>

      <div className="h-120 overflow-y-auto">
        {console.log("topStoresArr", topStoresArr)}
        {topStoresArr.length > 0 ? (
          <ul className="space-y-3">
            {topStoresArr.map((msg, index) => {
              const storeBrand = msg.store_brand || 
                (msg.top_stores && msg.top_stores.length > 0 
                  ? msg.top_stores[0].store_brand 
                  : '브랜드 정보 없음');
              
              return (
                <li
                  key={msg.id || index}
                  className="bg-gray-800 text-gray-200 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onCardClick(msg.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <span className="font-semibold text-purple-300 text-lg">
                        {storeBrand}
                      </span>
                      <span className="text-xs text-gray-400">
                        업데이트: {new Date(msg.timestamp || msg.server_received_time).toLocaleString()}
                      </span>
                    </div>
                    
                    {msg.top_stores && msg.top_stores.length > 0 ? (
                      <div className="space-y-4">
                        {msg.top_stores.slice(0, 3).map((store, storeIndex) => (
                          <div key={store.store_id || storeIndex} className="bg-gray-700 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-bold text-yellow-400 text-lg">
                                🏆 TOP {store.rank}
                              </span>
                              <span className="text-green-400 font-mono font-bold text-lg">
                                ₩{store.total_sales.toLocaleString()}
                              </span>
                            </div>
                            <div className="space-y-1">
                              <div className="text-white font-semibold text-base">
                                {store.store_name}
                              </div>
                              <div className="text-gray-300 text-sm">
                                📍 {store.store_address}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-gray-500 text-center py-4">
                        매장 정보가 없습니다.
                      </div>
                    )}
                    
                    {msg.franchise_id && (
                      <div className="text-xs text-gray-500 pt-2 border-t border-gray-600">
                        가맹점 ID: {msg.franchise_id}
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
                <div className="w-16 h-16 mx-auto bg-purple-500 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-2">TOP 매장 데이터 준비중</h3>
              <p className="text-gray-400 text-sm">
                매장 순위 정보를 기다리는 중입니다...
              </p>
              <div className="mt-4">
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-delay-200"></div>
                  <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FranchiseTopStores;
