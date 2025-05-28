import React from 'react';
import { useReportGeneration, REPORT_COUNT_OPTIONS, REPORT_BRAND_OPTIONS } from '../hooks/useReportGeneration';

const ReportGenerateTab = ({ isDarkMode, onSubmit, onClose }) => {
  const {
    selectedCount,
    setSelectedCount,
    selectedBrand,
    setSelectedBrand,
    isLoading,
    handleSubmit
  } = useReportGeneration();

  const handleFormSubmit = () => {
    handleSubmit(onSubmit);
  };

  return (
    <>
      {/* 브랜드 선택 */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-3 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          분석할 브랜드를 선택하세요
        </label>
        <select
          value={selectedBrand}
          onChange={(e) => setSelectedBrand(e.target.value)}
          className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
            isDarkMode
              ? 'border-gray-600 bg-gray-700 text-gray-300 focus:border-blue-500'
              : 'border-gray-300 bg-white text-gray-700 focus:border-blue-500'
          }`}
        >
          {REPORT_BRAND_OPTIONS.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* 데이터 건수 선택 */}
      <div className="mb-6">
        <label className={`block text-sm font-medium mb-3 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          분석할 데이터 건수를 선택하세요
        </label>
        <div className="grid grid-cols-3 gap-3">
          {REPORT_COUNT_OPTIONS.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedCount(option.value)}
              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                selectedCount === option.value
                  ? isDarkMode
                    ? 'border-blue-500 bg-blue-500 bg-opacity-20 text-blue-400'
                    : 'border-blue-500 bg-blue-50 text-blue-600'
                  : isDarkMode
                    ? 'border-gray-600 hover:border-gray-500 text-gray-300'
                    : 'border-gray-300 hover:border-gray-400 text-gray-700'
              }`}
            >
              <div className="font-semibold">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 설명 */}
      <div className={`p-4 rounded-lg mb-6 ${
        isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
      }`}>
        <p className={`text-sm ${
          isDarkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          • AI가 {selectedBrand === '전체' ? '전체 프랜차이즈의' : `${selectedBrand}의`} 최신 <strong>{selectedCount}건</strong>의 거래 데이터를 분석합니다<br/>
          • 프랜차이즈별 매출 순위 및 평균 객단가를 제공합니다<br/>
          • 인기 메뉴 Top-3와 이상 거래를 감지합니다<br/>
          • 처리 시간: 약 10-30초 소요
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex space-x-3">
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          취소
        </button>
        <button
          onClick={handleFormSubmit}
          disabled={isLoading}
          className={`flex-1 py-3 px-4 rounded-lg font-medium text-white transition-colors ${
            isLoading
              ? 'bg-gray-500 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              생성 중...
            </div>
          ) : (
            '리포트 생성'
          )}
        </button>
      </div>
    </>
  );
};

export default ReportGenerateTab;
