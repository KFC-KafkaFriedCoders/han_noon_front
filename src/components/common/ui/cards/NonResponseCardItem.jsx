import React from 'react';
import { useTheme } from '../../../../context/theme/ThemeContext';

const NonResponseCardItem = ({
  store,
  accentColor = 'yellow',
  onClick
}) => {
  const { isDarkMode } = useTheme();
  
  return (
    <li
      className={`relative p-3 rounded-lg text-sm transition-all duration-200 ${
        isDarkMode 
          ? 'bg-gray-800' 
          : 'bg-white border border-gray-200'
      }`}
      onClick={() => onClick && onClick(store.id)}
    >
      <div className={`transition-colors duration-300 ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        <div className="flex justify-between items-center mb-2">
          <span className={`text-${accentColor}-500 font-medium`}>비응답 매장</span>
          <span className={`text-xs transition-colors duration-300 ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {store.store_brand || ''}
          </span>
        </div>
        <div className={`p-2 rounded-md mb-2 flex justify-between transition-colors duration-300 ${
          isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <div>
            <span className={`font-semibold transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {store.store_name}
            </span>
            <span className={`text-xs ml-2 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              (ID: {store.store_id})
            </span>
          </div>
        </div>
      </div>
    </li>
  );
};

export default React.memo(NonResponseCardItem);