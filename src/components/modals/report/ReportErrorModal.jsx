import React from 'react';
import { IoMdClose, IoMdWarning } from 'react-icons/io';
import { HiArrowLeft, HiArrowPath } from 'react-icons/hi2';

const ReportErrorModal = ({ isDarkMode, reportData, onClose, onBackToGenerate, onRetry }) => {
  return (
    <div className={`relative w-full max-w-2xl mx-4 rounded-xl shadow-2xl ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* 헤더 */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center">
          <IoMdWarning className="text-red-500 text-2xl mr-3" />
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            리포트 생성 실패
          </h2>
        </div>
        <button
          onClick={onClose}
          className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
            isDarkMode ? 'hover:bg-white text-gray-400' : 'hover:bg-gray-500 text-gray-500'
          }`}
        >
          <IoMdClose size={20} />
        </button>
      </div>

      {/* 에러 내용 */}
      <div className={`p-6 ${
        isDarkMode ? 'bg-red-900 bg-opacity-20' : 'bg-red-50'
      }`}>
        <div className={`text-center`}>
          <div className="text-6xl mb-4">❌</div>
          <h3 className={`text-lg font-semibold mb-3 ${
            isDarkMode ? 'text-red-300' : 'text-red-700'
          }`}>
            요청 처리 중 오류가 발생했습니다
          </h3>
          <div className={`p-4 rounded-lg border ${
            isDarkMode 
              ? 'border-red-800 bg-red-900 bg-opacity-50' 
              : 'border-red-200 bg-red-100'
          }`}>
            <p className={`text-sm ${
              isDarkMode ? 'text-red-300' : 'text-red-700'
            }`}>
              {reportData?.message || '알 수 없는 오류가 발생했습니다.'}
            </p>
            {reportData?.requestedCount && reportData?.actualDataCount && (
              <p className={`text-xs mt-2 ${
                isDarkMode ? 'text-red-400' : 'text-red-600'
              }`}>
                요청: {reportData.requestedCount}건, 실제: {reportData.actualDataCount}건
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={`flex justify-between p-6 border-t ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <button
          onClick={onBackToGenerate}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <HiArrowLeft className="mr-2" size={18} />
          다시 생성
        </button>
        <div className="flex space-x-3">
          {onRetry && (
            <button
              onClick={onRetry}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              <HiArrowPath className="mr-2" size={18} />
              재시도
            </button>
          )}
          <button
            onClick={onClose}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-gray-600 hover:bg-gray-500 text-white'
                : 'bg-gray-500 hover:bg-gray-600 text-white'
            }`}
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportErrorModal;
