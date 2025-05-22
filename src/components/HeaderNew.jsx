import React from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { IoSettingsSharp } from 'react-icons/io5';
import { ImBook } from 'react-icons/im';
import { useBrand } from '../context/BrandContext';
import { useTheme } from '../context/theme/ThemeContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { convertToCSV, downloadCSV, generateFileName, combineDataSets } from '../utils/csvExport';
import kfaImg from '../assets/image.png';
import { useNavigate } from 'react-router-dom';

const HeaderNew = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // 모든 WebSocket 데이터 가져오기
  const {
    paymentLimitData,
    samePersonData,
    salesTotalData,
    salesMinuteData,
    topStoresData,
    nonResponseData,
    timeSeriesData
  } = useWebSocket();
  
  const handleBookClick = () => {
    handleCSVDownload();
  };

  const handleCSVDownload = () => {
    if (!selectedBrand) {
      alert('브랜드를 선택해주세요.');
      return;
    }

    // 현재 선택된 브랜드의 모든 데이터 수집
    const dataSets = [
      {
        title: '이상 결제 탐지',
        data: paymentLimitData.filter(item => item.store_brand === selectedBrand)
      },
      {
        title: '동일인 결제 탐지', 
        data: samePersonData.filter(item => item.store_brand === selectedBrand)
      },
      {
        title: '매출 총합',
        data: salesTotalData.filter(item => item.store_brand === selectedBrand)
      },
      {
        title: '1분당 매출',
        data: salesMinuteData.filter(item => item.store_brand === selectedBrand)
      },
      {
        title: '비응답 매장',
        data: nonResponseData.filter(item => item.store_brand === selectedBrand)
      }
    ];

    // TOP 매장 데이터 처리 (구조가 다름)
    const topStoresFiltered = topStoresData
      .filter(item => item.store_brand === selectedBrand)
      .flatMap(item => 
        (item.top_stores || []).map(store => ({
          ...store,
          store_brand: item.store_brand,
          timestamp: item.timestamp || item.server_received_time
        }))
      );
    
    if (topStoresFiltered.length > 0) {
      dataSets.push({
        title: 'TOP 매장 순위',
        data: topStoresFiltered
      });
    }

    // 시계열 데이터 추가
    if (timeSeriesData && timeSeriesData.length > 0) {
      dataSets.push({
        title: '시간별 매출 추이',
        data: timeSeriesData.map(item => ({
          store_brand: selectedBrand,
          time: item.time,
          total_sales: item.totalSales,
          display_time: item.displayTime
        }))
      });
    }

    // 데이터가 있는지 확인
    const hasData = dataSets.some(dataset => dataset.data && dataset.data.length > 0);
    
    if (!hasData) {
      alert(`${selectedBrand} 브랜드의 데이터가 없습니다.`);
      return;
    }

    try {
      // 통합 데이터 생성
      const combinedData = combineDataSets(dataSets);
      
      // CSV 변환
      const csvContent = convertToCSV(combinedData);
      
      // 파일명 생성
      const fileName = generateFileName(selectedBrand, '프랜차이즈_데이터_');
      
      // 다운로드 실행
      downloadCSV(csvContent, fileName);
      
      // 성공 알림
      const dataCount = dataSets.reduce((sum, dataset) => sum + (dataset.data?.length || 0), 0);
      alert(`${selectedBrand} 데이터 다운로드 완료!\n총 ${dataCount}개 항목이 저장되었습니다.`);
      
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      alert('데이터 다운로드 중 오류가 발생했습니다.');
    }
  };

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
              className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative group"
              onClick={handleBookClick}
              title={`${selectedBrand || '선택된 브랜드'} 데이터 CSV 다운로드`}
            >
              <ImBook size={20} />
              {/* 툴팁 */}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                📊 {selectedBrand} 데이터 다운로드
                <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNew;