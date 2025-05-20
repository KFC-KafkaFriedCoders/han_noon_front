import React, { useState, useEffect } from "react";
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const FranchiseTopStores = ({
  title,
  topStoresArr = [],
  onCardClick = () => {},
}) => {
  const [animateItems, setAnimateItems] = useState([]);
  
  useEffect(() => {
    if (topStoresArr.length > 0) {
      setAnimateItems([]);
      setTimeout(() => {
        setAnimateItems(topStoresArr);
      }, 100);
    }
  }, [topStoresArr]);

  return (
    <ChartPanel 
      title={title}
      color="purple"
    >
      <div className="h-120 overflow-y-auto custom-scrollbar p-1">
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
                  className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-300 shadow-md"
                  onClick={() => onCardClick(msg.id)}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                        <span className="font-semibold text-purple-300 text-lg">
                          {storeBrand}
                        </span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {new Date(msg.timestamp || msg.server_received_time).toLocaleString()}
                      </span>
                    </div>
                    
                    {msg.top_stores && msg.top_stores.length > 0 ? (
                      <div className="space-y-4">
                        {msg.top_stores.slice(0, 3).map((store, storeIndex) => (
                          <div 
                            key={store.store_id || storeIndex} 
                            className="bg-gray-700 p-3 rounded-lg hover:bg-gray-600 transition-all duration-300"
                            style={{ transitionDelay: `${storeIndex * 100}ms` }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                                  storeIndex === 0 ? 'bg-yellow-500/20 text-yellow-300' : 
                                  storeIndex === 1 ? 'bg-gray-400/20 text-gray-300' : 
                                  'bg-amber-600/20 text-amber-400'
                                }`}>
                                  <span className="font-bold">{storeIndex + 1}</span>
                                </div>
                                <span className={`font-bold text-lg ${
                                  storeIndex === 0 ? 'text-yellow-400' : 
                                  storeIndex === 1 ? 'text-gray-300' : 
                                  'text-amber-400'
                                }`}>
                                  TOP {store.rank}
                                </span>
                              </div>
                              <span className="text-green-400 font-mono font-bold text-lg">
                                ₩{store.total_sales.toLocaleString()}
                              </span>
                            </div>
                            <div className="bg-gray-800/50 p-2 rounded-md">
                              <div className="text-white font-semibold text-base mb-1">
                                {store.store_name}
                              </div>
                              <div className="text-gray-300 text-sm">
                                <span className="inline-block mr-1">📍</span> {store.store_address}
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
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <LoadingState 
            title="TOP 매장 데이터 준비중"
            message="매장 순위 정보를 기다리는 중입니다..."
            color="purple"
            icon={
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5"></path>
              </svg>
            }
          />
        )}
      </div>
    </ChartPanel>
  );
};

export default FranchiseTopStores;