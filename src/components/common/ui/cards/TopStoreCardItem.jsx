import React from 'react';

const TopStoreCardItem = ({
  storeInfo,
  rank,
  accentColor = 'purple',
}) => {
  return (
    <div className={`bg-gray-800 p-3 rounded-lg mb-2 border-l-2 border-${accentColor}-500`}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className={`w-6 h-6 rounded-full bg-${accentColor}-500 flex items-center justify-center mr-2`}>
            <span className="text-xs font-bold text-white">{rank}</span>
          </div>
          <span className="text-white font-medium">{storeInfo.store_name}</span>
        </div>
        <span className="text-xs text-gray-400">
          ID: {storeInfo.store_id}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-400 text-sm">매출액</span>
        <span className={`text-${accentColor}-400 font-bold`}>
          {typeof storeInfo.total_sales === 'number' 
            ? `${new Intl.NumberFormat('ko-KR').format(storeInfo.total_sales)} 원` 
            : (typeof storeInfo.sales === 'number' 
                ? `${new Intl.NumberFormat('ko-KR').format(storeInfo.sales)} 원` 
                : '데이터 없음')}
        </span>
      </div>
    </div>
  );
};

export default React.memo(TopStoreCardItem);