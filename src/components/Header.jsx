import React, { useState } from 'react';
import { FaRegBell } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { ImBook } from 'react-icons/im';
import { useBrand } from '../context/BrandContext';
import kfaImg from '../assets/image.png';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const [notifications] = useState(3); // 알림 수 (실제로는 알림 서비스에서 가져올 것)
  
  const handleBookClick = () => {
    navigate('/monitor');
  }

  return (
    <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* 좌측: 로고 및 브랜드명 */}
          <div className="flex items-center">
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
          </div>
          
          {/* 중앙: 현재 선택된 브랜드 표시 (모바일에서는 숨김) */}
          <div className="hidden md:flex items-center">
            {selectedBrand && (
              <div className="bg-gray-700 px-4 py-1.5 rounded-full">
                <span className="text-gray-200 font-medium">
                  현재 브랜드: <span className="text-blue-400">{selectedBrand}</span>
                </span>
              </div>
            )}
          </div>
          
          {/* 우측: 아이콘 버튼들 */}
          <div className="flex items-center space-x-2">
            <button className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
              <FaRegBell size={20} />
              {notifications > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {notifications}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors">
              <IoMdMoon size={20} />
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
            
            {/* 사용자 아바타 */}
            <div className="hidden md:block ml-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                A
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;