import React from 'react';

const NonResponseCardItem = ({
  store,
  isUnread,
  accentColor = 'yellow',
  onClick
}) => {
  return (
    <li
      className={`relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200 ${
        isUnread ? `border-l-4 border-${accentColor}-500 shadow-lg` : ''
      }`}
      onClick={() => onClick(store.id)}
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
          <span className={`text-${accentColor}-400 font-medium`}>비응답 매장</span>
          <span className="text-xs text-gray-400">
            {store.store_brand || ''}
          </span>
        </div>
        <div className="bg-gray-700 p-2 rounded-md mb-2 flex justify-between">
          <div>
            <span className="text-white font-semibold">{store.store_name}</span>
            <span className="text-gray-400 text-xs ml-2">(ID: {store.store_id})</span>
          </div>
          <span className={`text-${accentColor}-400 font-bold`}>
            {store.inactive_time}초
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
};

export default React.memo(NonResponseCardItem);