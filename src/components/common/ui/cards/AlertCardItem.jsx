import React from 'react';

const AlertCardItem = ({
  item,
  messageText,
  accentColor = 'green',
  timeField = 'time',
  titleText = '정보',
  onClick
}) => {
  return (
    <li
      className="relative bg-gray-800 p-3 rounded-lg text-sm cursor-pointer hover:bg-gray-700 transition-all duration-200"
      onClick={() => onClick && onClick(item.id)}
    >
      <div className="text-white">
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