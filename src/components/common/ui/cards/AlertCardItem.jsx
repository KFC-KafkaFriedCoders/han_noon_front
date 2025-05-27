import React from 'react';
import { useTheme } from '../../../../context/theme/ThemeContext';

const AlertCardItem = ({
  item,
  messageText,
  accentColor = 'green',
  timeField = 'time',
  titleText = '정보',
  onClick
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <li
      className={`relative p-3 rounded-lg text-sm transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gray-800 ' 
          : 'bg-white border border-gray-200'
      }`}
      onClick={() => onClick && onClick(item.id)}
    >
      <div className={`transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-${accentColor}-500 font-medium`}>{titleText}</span>
          <span className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {item.store_brand || ''}
          </span>
        </div>
        <div className={`p-2 rounded-md mb-2 transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          {messageText}
        </div>
      </div>
    </li>
  );
};

export default React.memo(AlertCardItem);