import React from 'react';
import { IoMdDownload } from 'react-icons/io';
import { HiTrash, HiEye } from 'react-icons/hi2';
import { downloadReportAsCSV } from '../../../../utils/reportDownload';

const ReportHistoryTab = ({ 
  isDarkMode, 
  reportHistory, 
  onDeleteReport, 
  onClearAll, 
  onViewReport 
}) => {
  const handleDownloadReport = (report) => {
    try {
      downloadReportAsCSV(report.content, report.count, report.createdAt);
    } catch (error) {
      console.error('리포트 다운로드 실패:', error);
      alert('리포트 다운로드 중 오류가 발생했습니다.');
    }
  };

  if (reportHistory.length === 0) {
    return (
      <div className="text-center py-8">
        <div className={`text-6xl mb-4`}>📊</div>
        <div className={`text-lg font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          생성된 리포트가 없습니다
        </div>
        <div className={`text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          새 리포트를 생성해보세요!
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 전체 삭제 버튼 */}
      <div className="flex justify-end mb-4">
        <button
          onClick={onClearAll}
          className={`px-3 py-1 text-sm rounded-lg transition-colors ${
            isDarkMode
              ? 'bg-red-900 hover:bg-red-800 text-red-300'
              : 'bg-red-100 hover:bg-red-200 text-red-700'
          }`}
        >
          전체 삭제
        </button>
      </div>

      {/* 리포트 목록 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {reportHistory.map((report) => (
          <div
            key={report.id}
            className={`p-4 rounded-lg border ${
              isDarkMode
                ? 'border-gray-600 bg-gray-700'
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className={`text-sm font-medium ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {report.createdAt}
                </div>
                <div className={`text-xs ${
                  isDarkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  {report.count}건 분석 {report.brand && `(${report.brand})`}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => onViewReport(report)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode
                      ? 'hover:bg-gray-600 text-gray-400'
                      : 'hover:bg-gray-200 text-gray-600'
                  }`}
                  title="리포트 보기"
                >
                  <HiEye size={16} />
                </button>
                <button
                  onClick={() => handleDownloadReport(report)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode
                      ? 'hover:bg-blue-800 text-blue-400'
                      : 'hover:bg-blue-100 text-blue-600'
                  }`}
                  title="CSV 다운로드"
                >
                  <IoMdDownload size={16} />
                </button>
                <button
                  onClick={() => onDeleteReport(report.id)}
                  className={`p-1 rounded transition-colors ${
                    isDarkMode
                      ? 'hover:bg-red-900 text-red-400'
                      : 'hover:bg-red-100 text-red-600'
                  }`}
                  title="삭제"
                >
                  <HiTrash size={16} />
                </button>
              </div>
            </div>
            <div className={`text-sm ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {report.summary}
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReportHistoryTab;
