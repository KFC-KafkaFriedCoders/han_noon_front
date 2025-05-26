import React, { useState } from 'react';
import { IoMdMoon, IoMdSunny } from 'react-icons/io';
import { HiClipboardDocumentList, HiEye } from 'react-icons/hi2';
import { useBrand } from '../context/BrandContext';
import { useTheme } from '../context/theme/ThemeContext';
import { useWebSocket } from '../hooks/useWebSocket';
import { convertToCSV, downloadCSV, generateFileName, combineDataSets } from '../utils/csvExport';
import kfaImg from '../assets/image.png';
import { useNavigate } from 'react-router-dom';
import ReportModal from './modals/ReportModal';
import ReportResultModal from './modals/ReportResultModal';
import { reportService } from '../api/reportService';

const HeaderNew = () => {
  const navigate = useNavigate();
  const { selectedBrand } = useBrand();
  const { isDarkMode, toggleDarkMode } = useTheme();
  
  // 리포트 모달 상태
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [reportError, setReportError] = useState(false);
  const [isHealthChecking, setIsHealthChecking] = useState(false);
  
  // 모든 WebSocket 데이터 가져오기
  const {
    paymentLimitData,
    samePersonData,
    salesTotalData,
    salesMinuteData,
    minuteTimeSeriesData,
    topStoresData,
    nonResponseData,
    timeSeriesData
  } = useWebSocket();
  
  // 리포트 버튼 클릭 - 리포트 모달 열기
  const handleReportClick = async () => {
    console.log('📋 리포트 버튼 클릭 - 리포트 모달 열기');
    
    // 헬스체크 로딩 시작
    setIsHealthChecking(true);
    
    // 서버 상태 확인 (선택사항)
    try {
      console.log('💗 서버 상태 확인 중...');
      await reportService.healthCheck();
      console.log('✅ 서버 정상 작동 중');
    } catch (error) {
      console.warn('⚠️ 서버 상태 확인 실패:', error.message);
      // 서버가 다운되어도 모달은 열어줌 (사용자가 직접 확인할 수 있도록)
    }
    
    setIsHealthChecking(false);
    setIsReportModalOpen(true);
  };

  // 리포트 생성 요청
  const handleReportSubmit = async (count) => {
    console.log(`🚀 리포트 생성 시작: ${count}건`);
    
    try {
      setReportError(false);
      
      // API 호출
      const result = await reportService.generateReport(count);
      
      console.log('✅ 리포트 생성 성공:', result);
      
      // 성공 시 결과 모달 표시
      setReportResult(result);
      setReportError(false);
      setIsReportModalOpen(false);
      setIsResultModalOpen(true);
      
    } catch (error) {
      console.error('💥 리포트 생성 실패:', error);
      
      // 실패 시 에러 모달 표시
      setReportResult({
        success: false,
        message: error.message,
        error: error.name
      });
      setReportError(true);
      setIsReportModalOpen(false);
      setIsResultModalOpen(true);
    }
  };

  // 모달 닫기
  const handleCloseModals = () => {
    setIsReportModalOpen(false);
    setIsResultModalOpen(false);
    setReportResult(null);
    setReportError(false);
  };
  
  const handleMonitoringClick = () => {
    handleCSVDownload();
  };

  const handleCSVDownload = () => {
    if (!selectedBrand) {
      alert('브랜드를 선택해주세요.');
      return;
    }

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

    if (timeSeriesData && timeSeriesData.length > 0) {
      dataSets.push({
        title: '시간별 매출 총합 추이',
        data: timeSeriesData.map(item => ({
          store_brand: selectedBrand,
          time: item.time,
          total_sales: item.totalSales,
          display_time: item.displayTime
        }))
      });
    }

    if (minuteTimeSeriesData && minuteTimeSeriesData.length > 0) {
      dataSets.push({
        title: '1분당 매출 추이 (최근 5분)',
        data: minuteTimeSeriesData.map(item => ({
          store_brand: selectedBrand,
          time: item.time,
          total_sales: item.totalSales,
          store_count: item.storeCount,
          display_time: item.displayTime,
          timestamp: item.timestamp
        }))
      });
    }

    const hasData = dataSets.some(dataset => dataset.data && dataset.data.length > 0);
    
    if (!hasData) {
      alert(`${selectedBrand} 브랜드의 데이터가 없습니다.`);
      return;
    }

    try {
      const combinedData = combineDataSets(dataSets);
      
      const csvContent = convertToCSV(combinedData);
      
      const fileName = generateFileName(selectedBrand, '프랜차이즈_데이터_');
      
      downloadCSV(csvContent, fileName);
      
      const dataCount = dataSets.reduce((sum, dataset) => sum + (dataset.data?.length || 0), 0);
      alert(`${selectedBrand} 데이터 다운로드 완료!\n총 ${dataCount}개 항목이 저장되었습니다.`);
      
    } catch (error) {
      console.error('CSV 다운로드 오류:', error);
      alert('데이터 다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <>
      <header className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
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
            
            <div className="hidden md:flex items-center">
              {selectedBrand && (
                <div className="bg-gray-700 px-4 py-1.5 rounded-full">
                  <span className="text-gray-200 font-medium">
                    현재 브랜드: <span className="text-blue-400">{selectedBrand}</span>
                  </span>
                </div>
              )}
            </div>
            
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
              <button 
              onClick={handleReportClick}
              disabled={isHealthChecking}
              className={`p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative group ${
                  isHealthChecking ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              title="AI 리포트 생성"
              >
              {isHealthChecking ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                ) : (
                <HiClipboardDocumentList size={20} />
              )}
              <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                {isHealthChecking ? '서버 상태 확인 중...' : '📊 AI 리포트 생성'}
                <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900"></div>
              </div>
            </button>
              <button 
                className="p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-full transition-colors relative group"
                onClick={handleMonitoringClick}
                title={`${selectedBrand || '선택된 브랜드'} 데이터 CSV 다운로드`}
              >
                <HiEye size={20} />
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                  📊 {selectedBrand} 데이터 다운로드
                  <div className="absolute top-full right-3 border-4 border-transparent border-t-gray-900"></div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 리포트 모달들 */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={handleCloseModals}
        onSubmit={handleReportSubmit}
      />
      
      <ReportResultModal
        isOpen={isResultModalOpen}
        onClose={handleCloseModals}
        reportData={reportResult}
        isError={reportError}
      />
    </>
  );
};

export default HeaderNew;
