import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useTheme } from '../../context/theme/ThemeContext';

const REPORT_COUNT_OPTIONS = [
  { value: 20, label: '20건' },
  { value: 50, label: '50건' },
  { value: 100, label: '100건' },
  { value: 250, label: '250건' },
  { value: 500, label: '500건' }
];

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [selectedCount, setSelectedCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(selectedCount);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-full max-w-md mx-4 rounded-xl shadow-2xl ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* 헤더 */}
        <div className={`flex items-center justify-between p-6 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            📊 AI 리포트 생성
          </h2>
          <button
            onClick={onClose}
            className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
              isDarkMode ? 'hover:bg-white text-gray-400' : 'hover:bg-gray-500 text-gray-500'
            }`}
          >
            <IoMdClose size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div className="p-6">
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
              • AI가 최신 <strong>{selectedCount}건</strong>의 거래 데이터를 분석합니다<br/>
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
              onClick={handleSubmit}
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
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
