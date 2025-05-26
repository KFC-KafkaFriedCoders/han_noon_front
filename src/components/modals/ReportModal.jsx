import React, { useState, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import { HiTrash, HiEye } from 'react-icons/hi2';
import { useTheme } from '../../context/theme/ThemeContext';
import { getReportHistory, deleteReport, clearAllReports } from '../../utils/reportStorage';

const REPORT_COUNT_OPTIONS = [
  { value: 20, label: '20건' },
  { value: 50, label: '50건' },
  { value: 100, label: '100건' },
  { value: 250, label: '250건' },
  { value: 500, label: '500건' }
];

const ReportModal = ({ isOpen, onClose, onSubmit }) => {
  const { isDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('generate'); // 'generate' | 'history'
  const [selectedCount, setSelectedCount] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [reportHistory, setReportHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // 모달이 열릴 때 히스토리 로드
  useEffect(() => {
    if (isOpen) {
      loadReportHistory();
    }
  }, [isOpen]);

  const loadReportHistory = () => {
    const history = getReportHistory();
    setReportHistory(history);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await onSubmit(selectedCount);
      // 리포트 생성 후 히스토리 다시 로드
      setTimeout(() => {
        loadReportHistory();
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteReport = (reportId) => {
    if (window.confirm('이 리포트를 삭제하시겠습니까?')) {
      deleteReport(reportId);
      loadReportHistory();
    }
  };

  const handleClearAll = () => {
    if (window.confirm('모든 리포트 히스토리를 삭제하시겠습니까?')) {
      clearAllReports();
      loadReportHistory();
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleCloseReportView = () => {
    setSelectedReport(null);
  };

  if (!isOpen) return null;

  return (
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
            📊 AI 리포트
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
            // 새 리포트 생성 탭
            <>
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
            </>
          ) : (
            // 생성 내역 탭
            <>
              {reportHistory.length > 0 ? (
                <>
                  {/* 전체 삭제 버튼 */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleClearAll}
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
                              {report.count}건 분석
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewReport(report)}
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
                              onClick={() => handleDeleteReport(report.id)}
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
              ) : (
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
              )}
            </>
          )}
        </div>
      </div>

      {/* 리포트 상세 보기 모달 */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-60">
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
              </h3>
              <button
                onClick={handleCloseReportView}
                className={`p-2 rounded-full hover:bg-opacity-20 transition-colors ${
                  isDarkMode ? 'hover:bg-white text-gray-400' : 'hover:bg-gray-500 text-gray-500'
                }`}
              >
                <IoMdClose size={20} />
              </button>
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
      )}
    </div>
  );
};

export default ReportModal;
