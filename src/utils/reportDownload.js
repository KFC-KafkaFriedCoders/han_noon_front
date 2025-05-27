/**
 * AI 리포트 다운로드 유틸리티
 */

/**
 * 리포트를 CSV 형식으로 다운로드
 * @param {string} reportContent - 리포트 내용
 * @param {number} count - 분석 건수
 * @param {string} createdAt - 생성 일시 (선택사항)
 */
export const downloadReportAsCSV = (reportContent, count, createdAt = null) => {
  if (!reportContent) {
    console.error('다운로드할 리포트 내용이 없습니다.');
    return;
  }
  
  try {
    // CSV 데이터 생성
    const csvData = parseReportToCSV(reportContent);
    
    // BOM 추가로 한글 깨짐 방지
    const BOM = '\uFEFF';
    const csvContent = BOM + csvData;
    
    const blob = new Blob([csvContent], { 
      type: 'text/csv;charset=utf-8' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    
    // 파일명 생성
    const filename = generateDownloadFilename(count, createdAt);
    link.download = filename;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`✅ 리포트 다운로드 완료: ${filename}`);
    
  } catch (error) {
    console.error('리포트 다운로드 실패:', error);
    alert('리포트 다운로드 중 오류가 발생했습니다.');
  }
};

/**
 * 리포트 텍스트를 CSV 형식으로 변환
 * @param {string} reportText - 리포트 텍스트
 * @returns {string} CSV 형식 문자열
 */
export const parseReportToCSV = (reportText) => {
  const lines = reportText.split('\n').map(line => line.trim()).filter(line => line);
  const csvRows = [];
  
  // CSV 헤더
  csvRows.push('분류,항목,내용,금액');
  
  let currentCategory = '';

  for (const line of lines) {
    // 주요 섹션 제목 (숫자. 또는 ### 시작)
    if (line.match(/^\d+\.|^###\s*\d+/)) {
      currentCategory = line.replace(/^\d+\.\s*|^###\s*\d+\.\s*/, '').trim();
      csvRows.push(`"${currentCategory}","","",""`);
      continue;
    }
    
    // 하위 제목 (### 시작하지만 숫자 없음)
    if (line.match(/^###\s*[^\d]/)) {
      const subTitle = line.replace(/^###\s*/, '').trim();
      csvRows.push(`"${subTitle}","","",""`);
      continue;
    }
    
    // 리스트 아이템 (- 시작)
    if (line.startsWith('-')) {
      const content = line.replace(/^-\s*/, '').trim();
      
      // **이름**: 금액 형식 처리
      const match = content.match(/^\*\*(.*?)\*\*:?\s*(.*)/);
      if (match) {
        let [, name, rest] = match;
        name = name.trim();
        rest = rest.trim();
        
        // 금액 추출 ([\d,]+원 형식)
        const amountMatch = rest.match(/([\d,]+원)/);
        if (amountMatch) {
          const amount = amountMatch[1];
          const description = rest.replace(amountMatch[0], '').replace(/^\s*-\s*/, '').trim();
          csvRows.push(`"","${escapeCSV(name)}","${escapeCSV(description)}","${amount}"`);
        } else {
          csvRows.push(`"","${escapeCSV(name)}","${escapeCSV(rest)}",""`);
        }
      } else {
        // 일반 리스트 아이템
        csvRows.push(`"","","${escapeCSV(content)}",""`);
      }
      continue;
    }
    
    // 일반 텍스트 (단락 또는 설명)
    if (line.length > 0) {
      csvRows.push(`"","","${escapeCSV(line)}",""`);
    }
  }
  
  return csvRows.join('\n');
};

/**
 * CSV용 텍스트 이스케이프
 * @param {string} text - 이스케이프할 텍스트
 * @returns {string} 이스케이프된 텍스트
 */
export const escapeCSV = (text) => {
  if (!text) return '';
  // 따옴표 이스케이프 및 특수문자 처리
  return text.replace(/"/g, '""');
};

/**
 * 다운로드 파일명 생성
 * @param {number} count - 분석 건수
 * @param {string} createdAt - 생성 일시 (선택사항)
 * @returns {string} 파일명
 */
export const generateDownloadFilename = (count, createdAt = null) => {
  let timestamp;
  
  if (createdAt) {
    // 기존 createdAt 형식: "2024.12.15 14:30:25"
    // 파일명용으로 변환: "2024-12-15_14-30-25"
    timestamp = createdAt
      .replace(/\./g, '-')
      .replace(/:/g, '-')
      .replace(' ', '_');
  } else {
    // 현재 시간 사용
    timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  }
  
  return `한눈_AI_리포트_${count}건_${timestamp}.csv`;
};
