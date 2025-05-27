import React, { useState, useEffect } from "react";
import { useTheme } from '../../context/theme/ThemeContext';
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';
const FranchiseTopStores = ({
  title,
  topStoresArr = [],
  onCardClick = () => {},
}) => {
  const { isDarkMode } = useTheme();
  const [animateItems, setAnimateItems] = useState([]);
  
  useEffect(() => {
    if (topStoresArr.length > 0) {
      setAnimateItems([]);
      setTimeout(() => {
        setAnimateItems(topStoresArr);
      }, 100);
    }
  }, [topStoresArr]);

  // 메달 아이콘과 색상 반환
  const getMedalIcon = (index) => {
    switch(index) {
      case 0:
        return {
          icon: '🥇',
          bgColor: 'bg-yellow-500/30',
          textColor: 'text-yellow-400',
          borderColor: 'border-yellow-400'
        };
      case 1:
        return {
          icon: '🥈',
          bgColor: 'bg-gray-400/30', 
          textColor: 'text-gray-300',
          borderColor: 'border-gray-400'
        };
      case 2:
        return {
          icon: '🥉',
          bgColor: 'bg-amber-600/30',
          textColor: 'text-amber-400',
          borderColor: 'border-amber-400'
        };
      default:
        return {
          icon: `${index + 1}`,
          bgColor: 'bg-gray-500/30',
          textColor: 'text-gray-400',
          borderColor: 'border-gray-500'
        };
    }
  };

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
                  className={`p-4 rounded-lg transition-all duration-300 shadow-md ${
                    isDarkMode 
                      ? 'bg-gray-800 ' 
                      : 'bg-white border border-gray-200'
                  }`}
                  onClick={() => onCardClick(msg.id)}
                >
                  <div className="space-y-3">
                    <div className={`flex justify-between items-center border-b pb-2 transition-colors duration-300 ${
                      isDarkMode ? 'border-gray-600' : 'border-gray-300'
                    }`}>
                      <div className="flex items-center">
                        <div className="w-2 h-2 rounded-full mr-2 bg-purple-500"></div>
                        <span className="font-semibold text-purple-500 text-lg">
                          {storeBrand}
                        </span>
                      </div>
                      <span className={`text-xs transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                      }`}>
                        {new Date(msg.timestamp || msg.server_received_time).toLocaleString()}
                      </span>
                    </div>
                    
                    {msg.top_stores && msg.top_stores.length > 0 ? (
                      <div className="space-y-4">
                        {msg.top_stores.slice(0, 3).map((store, storeIndex) => {
                          const medal = getMedalIcon(storeIndex);
                          
                          return (
                            <div 
                              key={store.store_id || storeIndex} 
                              className={`p-3 rounded-lg transition-all duration-300 border-2 ${
                                isDarkMode 
                                  ? 'bg-gray-700' 
                                  : 'bg-gray-50'
                              } ${medal.borderColor}`}
                              style={{ transitionDelay: `${storeIndex * 100}ms` }}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-3 ${medal.bgColor} border-2 ${medal.borderColor}`}>
                                    <span className="text-2xl">
                                      {medal.icon}
                                    </span>
                                  </div>
                                  <div>
                                    <span className={`font-bold text-xl ${medal.textColor}`}>
                                      TOP {storeIndex + 1}
                                    </span>
                                    <div className={`text-sm transition-colors duration-300 ${
                                      isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                    }`}>

                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-green-500 font-mono font-bold text-lg">
                                    {typeof store.total_sales === 'number' 
                                      ? `₩${new Intl.NumberFormat('ko-KR').format(store.total_sales)}` 
                                      : (typeof store.sales === 'number' 
                                        ? `₩${new Intl.NumberFormat('ko-KR').format(store.sales)}` 
                                        : '데이터 없음')}
                                  </div>
                                  <div className={`text-xs transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                  }`}>
                                    매출액
                                  </div>
                                </div>
                              </div>
                              <div className={`p-2 rounded-md transition-colors duration-300 ${
                                isDarkMode ? 'bg-gray-800/50' : 'bg-white/50'
                              }`}>
                                <div className={`font-semibold text-base mb-1 transition-colors duration-300 ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>
                                  {store.store_name}
                                </div>
                                {store.store_address && (
                                  <div className={`text-sm transition-colors duration-300 ${
                                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                  }`}>
                                    <span className="inline-block mr-1">📍</span> {store.store_address}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className={`text-center py-4 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-500' : 'text-gray-600'
                      }`}>
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