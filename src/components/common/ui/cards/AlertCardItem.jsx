import React from 'react';

const AlertCardItem = ({
  item,
  isUnread,
  messageText,
  accentColor = 'green',
  timeField = 'time',
  titleText = '알림',
  onClick
}) => {
  return (
    <li
      className={`relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200 ${
        isUnread ? `border-l-4 border-${accentColor}-500 shadow-lg` : ''
      }`}
      onClick={() => onClick(item.id)}
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
          <span className={`text-${accentColor}-400 font-medium`}>{titleText}</span>
          <span className="text-xs text-gray-400">
            {item.store_brand || ''}
          </span>
        </div>
        <div className="bg-gray-700 p-2 rounded-md mb-2">
          {messageText}
        </div>
        {item[timeField] && (
          <div className="text-xs text-gray-400 text-right">
            {new Date(item[timeField]).toLocaleString()}
          </div>
        )}
      </div>
    </li>
  );
};

export default React.memo(AlertCardItem);