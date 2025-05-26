import React from 'react';
import { IoMdClose, IoMdDownload, IoMdTime } from 'react-icons/io';
import { useTheme } from '../../context/theme/ThemeContext';

const ReportResultModal = ({ isOpen, onClose, reportData, isError }) => {
  const { isDarkMode } = useTheme();

  const handleDownload = () => {
    if (!reportData?.report) return;
    
    // CSV 데이터 생성
    const csvData = parseReportToCSV(reportData.report);
    
    // BOM 추가로 한글 깨짐 방지
    const BOM = '\uFEFF';
    const csvContent = BOM + csvData;
    
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const count = reportData.requestedCount || 'Unknown';
    link.download = `한눈_AI_리포트_${count}건_${timestamp}.csv`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const parseReportToCSV = (reportText) => {
    const lines = reportText.split('\n').map(line => line.trim()).filter(line => line);
    const csvRows = [];
    
    // CSV 헤더
    csvRows.push('분류,항목,내용,금액');
    
    let currentCategory = '';

    for (const line of lines) {
      // 주요 섹션 제목 (숫자. 또는 ### 시작)
      if (line.match(/^\d+\.|^###\s*\d+/)) {
        currentCategory = line.replace(/^\d+\.\s*|^###\s*\d+\.\s*/, '').trim();
        csvRows.push(`"${currentCategory}","","",""`);
        continue;
      }
      
      // 하대 제목 (### 시작하지만 숫자 없음)
      if (line.match(/^###\s*[^\d]/)) {
        const subTitle = line.replace(/^###\s*/, '').trim();
        csvRows.push(`"${subTitle}","","",""`);
        continue;
      }
      
      // 리스트 아이템 (- 시작)
      if (line.startsWith('-')) {
        const content = line.replace(/^-\s*/, '').trim();
        
        // **이름**: 금액 형식 처리
        const match = content.match(/^\*\*(.*?)\*\*:?\s*(.*)/);
        if (match) {
          let [, name, rest] = match;
          name = name.trim();
          rest = rest.trim();
          
          // 금액 추출 ([\d,]+원 형식)
          const amountMatch = rest.match(/([\d,]+원)/);
          if (amountMatch) {
            const amount = amountMatch[1];
            const description = rest.replace(amountMatch[0], '').replace(/^\s*-\s*/, '').trim();
            csvRows.push(`"","${escapeCSV(name)}","${escapeCSV(description)}","${amount}"`);
          } else {
            csvRows.push(`"","${escapeCSV(name)}","${escapeCSV(rest)}",""`);
          }
        } else {
          // 일반 리스트 아이템
          csvRows.push(`"","","${escapeCSV(content)}",""`);
        }
        continue;
      }
      
      // 일반 텍스트 (단락 또는 설명)
      if (line.length > 0) {
        csvRows.push(`"","","${escapeCSV(line)}",""`);
      }
    }
    
    return csvRows.join('\n');
  };
  
  const escapeCSV = (text) => {
    if (!text) return '';
    // 따옴표 이스케이프 및 특수문자 처리
    return text.replace(/"/g, '""');
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
