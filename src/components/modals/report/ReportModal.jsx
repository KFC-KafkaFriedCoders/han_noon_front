import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { useTheme } from '../../../context/theme/ThemeContext';
import { useReportHistory } from './hooks/useReportHistory';
import ReportGenerateTab from './tabs/ReportGenerateTab';
import ReportHistoryTab from './tabs/ReportHistoryTab';
import ReportDetailModal from './ReportDetailModal';
import Portal from '../../common/Portal';

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'history'
  
  const {
    reportHistory,
    selectedReport,
    loadReportHistory,
    handleDeleteReport,
    handleClearAll,
    handleViewReport,
    handleCloseReportView
  } = useReportHistory();

  // 모달이 열릴 때 히스토리 로드
  useEffect(() => {
    if (isOpen) {
      loadReportHistory();
    }
  }, [isOpen]);

  const handleSubmit = async (selectedCount, selectedBrand) => {
    await onSubmit(selectedCount, selectedBrand);
    // 리포트 생성 후 히스토리 즉시 다시 로드
    // setTimeout 제거하고 즉시 실행
    loadReportHistory();
  };

  if (!isOpen) return null;

  return (
    <>
      <Portal containerId="report-modal-root">
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className={`relative w-full max-w-2xl mx-4 rounded-xl shadow-2xl ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          {/* 헤더 */}
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <h2 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              AI 리포트
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

          {/* 탭 메뉴 */}
          <div className={`flex border-b ${
            isDarkMode ? 'border-gray-700' : 'border-gray-200'
          }`}>
            <button
              onClick={() => setActiveTab('generate')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'generate'
                  ? isDarkMode
                    ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700'
                    : 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              새 리포트 생성
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'history'
                  ? isDarkMode
                    ? 'border-b-2 border-blue-500 text-blue-400 bg-gray-700'
                    : 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                  : isDarkMode
                    ? 'text-gray-400 hover:text-gray-300'
                    : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              생성 내역 ({reportHistory.length})
            </button>
          </div>

          {/* 탭 내용 */}
          <div className="p-6">
            {activeTab === 'generate' ? (
              <ReportGenerateTab
                isDarkMode={isDarkMode}
                onSubmit={handleSubmit}
                onClose={onClose}
              />
            ) : (
              <ReportHistoryTab
                isDarkMode={isDarkMode}
                reportHistory={reportHistory}
                onDeleteReport={handleDeleteReport}
                onClearAll={handleClearAll}
                onViewReport={handleViewReport}
              />
            )}
          </div>
        </div>
        </div>
      </Portal>

      {/* 리포트 상세 보기 모달 - 별도 Portal에서 렌더링 */}
      {selectedReport && (
        <Portal containerId="report-detail-modal-root">
          <ReportDetailModal
            isDarkMode={isDarkMode}
            selectedReport={selectedReport}
            onClose={handleCloseReportView}
          />
        </Portal>
      )}
    </>
  );
};

export default ReportModal;
