/**
 * AI 리포트 히스토리 로컬스토리지 관리 유틸리티
 */

const STORAGE_KEY = 'ai_report_history';
const MAX_REPORTS = 10;

/**
 * 리포트 히스토리 조회
 */
export const getReportHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('리포트 히스토리 조회 실패:', error);
    return [];
  }
};

/**
 * 새 리포트 저장
 */
export const saveReport = (reportData) => {
  try {
    const { count, content, success } = reportData;
    
    // 실패한 리포트는 저장하지 않음
    if (!success || !content) {
      console.log('실패한 리포트는 저장하지 않습니다.');
      return false;
    }
    
    const existingReports = getReportHistory();
    
    // 새 리포트 객체 생성
    const newReport = {
      id: `report_${Date.now()}`,
      count: count,
      content: content,
      createdAt: new Date().toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      timestamp: Date.now(),
      summary: generateSummary(content) // 간단 요약 생성
    };
    
    // 맨 앞에 추가 (최신순)
    const updatedReports = [newReport, ...existingReports];
    
    // 최대 개수 초과 시 오래된 것 제거
    if (updatedReports.length > MAX_REPORTS) {
      updatedReports.splice(MAX_REPORTS);
    }
    
    // 로컬스토리지에 저장
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedReports));
    
    console.log(`✅ 리포트 저장 완료: ${newReport.createdAt} (${count}건)`);
    return true;
    
  } catch (error) {
    console.error('리포트 저장 실패:', error);
    return false;
  }
};

/**
 * 특정 리포트 삭제
 */
export const deleteReport = (reportId) => {
  try {
    const existingReports = getReportHistory();
    const filteredReports = existingReports.filter(report => report.id !== reportId);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredReports));
    console.log(`🗑️ 리포트 삭제 완료: ${reportId}`);
    return true;
    
  } catch (error) {
    console.error('리포트 삭제 실패:', error);
    return false;
  }
};

/**
 * 모든 히스토리 삭제
 */
export const clearAllReports = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    console.log('🧹 모든 리포트 히스토리 삭제 완료');
    return true;
  } catch (error) {
    console.error('히스토리 삭제 실패:', error);
    return false;
  }
};

/**
 * 리포트 내용에서 간단한 요약 생성
 */
const generateSummary = (content) => {
  if (!content || typeof content !== 'string') {
    return '리포트 요약 없음';
  }
  
  // 첫 번째 문장이나 첫 100자 정도를 요약으로 사용
  const firstSentence = content.split('.')[0];
  if (firstSentence && firstSentence.length > 10 && firstSentence.length < 100) {
    return firstSentence + '.';
  }
  
  // 첫 100자 사용
  const summary = content.substring(0, 100);
  return summary.length < content.length ? summary + '...' : summary;
};

/**
 * 히스토리 통계 정보
 */
export const getHistoryStats = () => {
  const reports = getReportHistory();
  
  return {
    totalCount: reports.length,
    latestReport: reports.length > 0 ? reports[0] : null,
    oldestReport: reports.length > 0 ? reports[reports.length - 1] : null
  };
};
