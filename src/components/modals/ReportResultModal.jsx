import React, { useEffect } from 'react';
import { IoMdClose, IoMdDownload, IoMdTime } from 'react-icons/io';
import { useTheme } from '../../context/theme/ThemeContext';
import { saveReport } from '../../utils/reportStorage';
import { downloadReportAsCSV } from '../../utils/reportDownload';

const ReportResultModal = ({ isOpen, onClose, reportData, isError }) => {
  const { isDarkMode } = useTheme();

  // 성공한 리포트를 로컬스토리지에 저장
  useEffect(() => {
    if (isOpen && !isError && reportData && reportData.success && reportData.report) {
      const reportToSave = {
        success: true,
        count: reportData.requestedCount,
        content: reportData.report
      };
      
      const saved = saveReport(reportToSave);
      if (saved) {
        console.log('✅ 리포트가 히스토리에 저장되었습니다.');
      }
    }
  }, [isOpen, isError, reportData]);

  const handleDownload = () => {
    if (!reportData?.report) return;
    
    try {
      const count = reportData.requestedCount || 'Unknown';
      downloadReportAsCSV(reportData.report, count);
    } catch (error) {
      console.error('리포트 다운로드 실패:', error);
      alert('리포트 다운로드 중 오류가 발생했습니다.');
    }
  };



  const formatProcessingTime = (ms) => {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}초`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className={`relative w-full max-w-4xl h-[90vh] rounded-xl shadow-2xl flex flex-col ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* 헤더 */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex items-center">
            <h2 className={`text-xl font-bold mr-4 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {isError ? '🚨 리포트 생성 실패' : '📊 AI 분석 리포트'}
            </h2>
            {!isError && reportData && (
              <div className="flex items-center space-x-4 text-sm">
                {reportData.requestedCount && (
                  <span className={`px-2 py-1 rounded-full ${
                    isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {reportData.requestedCount}건 분석
                  </span>
                )}
                {reportData.processingTimeMs && (
                  <div className={`flex items-center ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <IoMdTime className="mr-1" />
                    {formatProcessingTime(reportData.processingTimeMs)}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {!isError && reportData?.report && (
              <button
                onClick={handleDownload}
                className={`p-2 rounded-full transition-colors ${
                  isDarkMode 
                    ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                    : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
                }`}
                title="리포트 다운로드 (CSV)"
              >
                <IoMdDownload size={20} />
              </button>
            )}
            <button
              onClick={onClose}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-gray-700 text-gray-400 hover:text-white' 
                  : 'hover:bg-gray-200 text-gray-500 hover:text-gray-700'
              }`}
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>

        {/* 내용 */}
        <div className="flex-1 overflow-y-auto">
          {isError ? (
            <div className="p-6">
              <div className={`p-6 rounded-lg ${
                isDarkMode ? 'bg-red-900 bg-opacity-50' : 'bg-red-50'
              }`}>
                <div className="flex items-center mb-4">
                  <div className="text-red-500 text-2xl mr-3">🚨</div>
                  <h3 className={`text-lg font-semibold ${
                    isDarkMode ? 'text-red-300' : 'text-red-700'
                  }`}>
                    리포트 생성 실패
                  </h3>
                </div>
                
                <div className={`p-4 rounded-lg mb-4 ${
                  isDarkMode ? 'bg-gray-800' : 'bg-white'
                }`}>
                  <p className={`text-sm font-mono ${
                    isDarkMode ? 'text-red-300' : 'text-red-600'
                  }`}>
                    {reportData?.message || '알 수 없는 오류가 발생했습니다.'}
                  </p>
                </div>
                
                {reportData?.requestedCount && reportData?.actualDataCount && (
                  <div className={`p-3 rounded-lg ${
                    isDarkMode ? 'bg-yellow-800 bg-opacity-50' : 'bg-yellow-50'
                  }`}>
                    <p className={`text-sm ${
                      isDarkMode ? 'text-yellow-300' : 'text-yellow-700'
                    }`}>
                      📊 요청 건수: <strong>{reportData.requestedCount}건</strong><br/>
                      📋 실제 데이터: <strong>{reportData.actualDataCount}건</strong>
                    </p>
                  </div>
                )}
                
                <div className="mt-4">
                  <details className={`cursor-pointer ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    <summary className="text-sm font-medium">🔍 디버깅 정보</summary>
                    <div className={`mt-2 p-3 rounded text-xs font-mono ${
                      isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                    }`}>
                      에러 타입: {reportData?.error || 'Unknown'}<br/>
                      API URL: http://localhost:8081/api/reports/generate<br/>
                      상태: 연결 실패 또는 서버 오류
                    </div>
                  </details>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className={`rounded-lg p-6 ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                {reportData?.report ? (
                  <div className="pb-4">
                    <pre className={`whitespace-pre-wrap font-mono text-sm leading-relaxed ${
                      isDarkMode ? 'text-gray-300' : 'text-gray-800'
                    }`}>
                      {reportData.report}
                    </pre>
                  </div>
                ) : (
                  <div className={`flex items-center justify-center h-32 ${
                    isDarkMode ? 'text-gray-500' : 'text-gray-400'
                  }`}>
                    <div className="text-center">
                      <div className="text-2xl mb-2">📊</div>
                      <p>리포트를 불러오는 중...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className={`p-6 border-t ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <div className="flex justify-end space-x-3">
            {!isError && reportData?.report && (
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors flex items-center"
              >
                <IoMdDownload className="mr-2" />
                CSV 다운로드
              </button>
            )}
            <button
              onClick={onClose}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportResultModal;
