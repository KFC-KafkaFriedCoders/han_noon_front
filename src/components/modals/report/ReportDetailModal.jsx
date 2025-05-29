import React from 'react';
import { IoMdClose, IoMdDownload } from 'react-icons/io';
import { downloadReportAsCSV } from '../../../utils/reportDownload';

const ReportDetailModal = ({ isDarkMode, selectedReport, onClose }) => {
  const handleDownloadReport = (report) => {
    try {
      downloadReportAsCSV(report.content, report.count, report.createdAt);
    } catch (error) {
      console.error('리포트 다운로드 실패:', error);
      alert('리포트 다운로드 중 오류가 발생했습니다.');
    }
  };

  if (!selectedReport) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[70]">
      <div className={`relative w-full max-w-4xl mx-4 rounded-xl shadow-2xl max-h-[90vh] overflow-hidden ${
        isDarkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className={`flex items-center justify-between p-4 border-b ${
          isDarkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h3 className={`text-lg font-bold ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}>
            리포트 상세 - {selectedReport.createdAt} ({selectedReport.count}건)
            {selectedReport.brand && ` - ${selectedReport.brand}`}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleDownloadReport(selectedReport)}
              className={`p-2 rounded-full transition-colors ${
                isDarkMode 
                  ? 'hover:bg-blue-800 text-blue-400 hover:text-blue-300' 
                  : 'hover:bg-blue-100 text-blue-600 hover:text-blue-700'
              }`}
              title="CSV 다운로드"
            >
              <IoMdDownload size={20} />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                isDarkMode ? 'hover:bg-white text-gray-400' : 'hover:bg-gray-500 text-gray-500'
              }`}
            >
              <IoMdClose size={20} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <pre className={`whitespace-pre-wrap text-sm ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            {selectedReport.content}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
