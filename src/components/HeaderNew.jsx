import React from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { ImBook } from 'react-icons/im';
import { useBrand } from '../context/BrandContext';
import { useTheme } from '../context/theme/ThemeContext';
import kfaImg from '../assets/image.png';
import { useNavigate } from 'react-router-dom';

const HeaderNew = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  const handleBookClick = () => {
    navigate('/monitor');
  }

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 로고 및 브랜드명 */}
          <div className="flex items-center">
            <div className="bg-white p-1.5 rounded-lg shadow-md">
              <img 
                src="/kfc-logo.png" 
                alt="Logo" 
                className="h-8 w-8" 
                onError={(e) => { e.target.onerror = null; e.target.src = kfaImg; }} 
              />
            </div>
            <span className="text-xl font-bold ml-2 text-white">KFC</span>
          </div>
          
          {/* 현재 선택된 브랜드 표시 */}
          <div className="hidden md:flex items-center">
            {selectedBrand && (
              <div className="bg-gray-700 px-4 py-1.5 rounded-full">
                <span className="text-gray-200 font-medium">
                  현재 브랜드: <span className="text-blue-400">{selectedBrand}</span>
                </span>
              </div>
            )}
          </div>
          
          {/* 아이콘 버튼들 */}
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleDarkMode} 
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              aria-label={isDarkMode ? '라이트 모드로 변경' : '다크 모드로 변경'}
            >
              {isDarkMode ? (
                <IoMdSunny size={20} className="text-yellow-300" />
              ) : (
                <IoMdMoon size={20} />
              )}
            </button>
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
              <IoSettingsSharp size={20} />
            </button>
            <button 
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
              onClick={handleBookClick}
            >
              <ImBook size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNew;