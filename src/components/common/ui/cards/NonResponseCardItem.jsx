import React from 'react';

const NonResponseCardItem = ({
  store,
  accentColor = 'yellow',
  onClick
}) => {
  return (
    <li
      className="relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200"
      onClick={() => onClick && onClick(store.id)}
    >
      <div className="text-white">
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
        </div>
      </div>
    </li>
  );
};

export default React.memo(NonResponseCardItem);