import { useState, useEffect } from 'react';
import { getReportHistory, deleteReport, clearAllReports } from '../../../../utils/reportStorage';

/**
 * 리포트 히스토리 관리 커스텀 훅
 */
export const useReportHistory = () => {
  const [reportHistory, setReportHistory] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);

  // 히스토리 로드
  const loadReportHistory = () => {
    const history = getReportHistory();
    setReportHistory(history);
  };

  // 리포트 삭제
  const handleDeleteReport = (reportId) => {
    if (window.confirm('이 리포트를 삭제하시겠습니까?')) {
      deleteReport(reportId);
      loadReportHistory();
    }
  };

  // 전체 삭제
  const handleClearAll = () => {
    if (window.confirm('모든 리포트 히스토리를 삭제하시겠습니까?')) {
      clearAllReports();
      loadReportHistory();
    }
  };

  // 리포트 상세 보기
  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  // 상세 보기 닫기
  const handleCloseReportView = () => {
    setSelectedReport(null);
  };

  return {
    reportHistory,
    selectedReport,
    loadReportHistory,
    handleDeleteReport,
    handleClearAll,
    handleViewReport,
    handleCloseReportView
  };
};
