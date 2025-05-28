import React from 'react';
import { IoMdClose, IoMdDownload, IoMdCheckmarkCircle } from 'react-icons/io';
import { HiArrowLeft } from 'react-icons/hi2';
import { downloadReportAsCSV } from '../../../utils/reportDownload';

const ReportSuccessModal = ({ isDarkMode, reportData, onClose, onBackToGenerate }) => {
  const handleDownload = () => {
    try {
      const timestamp = new Date().toLocaleString('ko-KR');
      downloadReportAsCSV(reportData.report, reportData.requestedCount, timestamp);
    } catch (error) {
      console.error('다운로드 실패:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={`relative w-full max-w-4xl mx-4 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden ${
      isDarkMode ? 'bg-gray-800' : 'bg-white'
    }`}>
      {/* 헤더 */}
      <div className={`flex items-center justify-between p-6 border-b ${
        isDarkMode ? 'border-gray-700' : 'border-gray-200'
      }`}>
        <div className="flex items-center">
          <IoMdCheckmarkCircle className="text-green-500 text-2xl mr-3" />
          <h2 className={`text-xl font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            리포트 생성 완료
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

      {/* 성공 정보 */}
      <div className={`p-6 border-b ${
        isDarkMode ? 'border-gray-700 bg-green-900 bg-opacity-20' : 'border-gray-200 bg-green-50'
      }`}>
        <div className="flex items-center justify-between">
          <div>
            <p className={`text-sm ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              요청 건수: <strong>{reportData.requestedCount}건</strong>
            </p>
            <p className={`text-sm mt-1 ${
              isDarkMode ? 'text-green-300' : 'text-green-700'
            }`}>
              처리 시간: <strong>{reportData.processingTimeMs}ms</strong>
            </p>
          </div>
          <button
            onClick={handleDownload}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            <IoMdDownload className="mr-2" size={18} />
            CSV 다운로드
          </button>
        </div>
      </div>

      {/* 리포트 내용 */}
      <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
        <pre className={`whitespace-pre-wrap text-sm leading-relaxed ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {reportData.report}
        </pre>
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
          새 리포트 생성
        </button>
        <button
          onClick={onClose}
          className={`px-6 py-2 rounded-lg font-medium transition-colors ${
            isDarkMode
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          완료
        </button>
      </div>
    </div>
  );
};

export default ReportSuccessModal;
