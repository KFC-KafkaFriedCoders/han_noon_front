// CSV 내보내기 유틸리티 함수들

/**
 * 객체 배열을 CSV 문자열로 변환
 */
export const convertToCSV = (data, headers = null) => {
  if (!data || data.length === 0) return '';

  // 헤더 자동 생성 (한글 버전)
  const headerMap = {
    // 공통
    'id': 'ID',
    'store_brand': '브랜드명',
    'store_name': '매장명', 
    'store_id': '매장ID',
    'time': '시간',
    'server_received_time': '서버수신시간',
    'timestamp': '타임스탬프',
    
    // 결제 관련
    'alert_message': '알림메시지',
    'alertMessage': '알림메시지',
    'total_sales': '총매출',
    'payment_amount': '결제금액',
    'store_count': '매장수',
    'franchise_id': '프랜차이즈ID',
    
    // TOP 매장 관련
    'rank': '순위',
    'sales': '매출',
    'store_address': '매장주소',
    
    // 기타
    'orders': '주문수',
    'avg_sales': '평균매출'
  };

  const firstRow = data[0];
  const csvHeaders = headers || Object.keys(firstRow).map(key => headerMap[key] || key);
  
  const csvRows = [];
  csvRows.push(csvHeaders.join(','));

  data.forEach(row => {
    const values = Object.keys(firstRow).map(key => {
      let value = row[key];
      
      // 값 처리
      if (value === null || value === undefined) {
        value = '';
      } else if (typeof value === 'object') {
        value = JSON.stringify(value);
      } else if (typeof value === 'string' && value.includes(',')) {
        value = `"${value}"`;
      }
      
      return value;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};

/**
 * CSV 파일 다운로드
 */
export const downloadCSV = (csvContent, filename) => {
  // BOM 추가 (한글 깨짐 방지)
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], { 
    type: 'text/csv;charset=utf-8' 
  });
  
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

/**
 * 현재 날짜로 파일명 생성
 */
export const generateFileName = (brandName, prefix = '') => {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD
  const timeStr = now.toTimeString().slice(0, 8).replace(/:/g, '-'); // HH-MM-SS
  
  const safeBrandName = brandName.replace(/[^a-zA-Z0-9가-힣]/g, '_');
  return `${prefix}${safeBrandName}_${dateStr}_${timeStr}.csv`;
};

/**
 * 여러 시트를 하나의 CSV로 통합
 */
export const combineDataSets = (dataSets) => {
  const combined = [];
  
  dataSets.forEach(({ title, data }) => {
    if (data && data.length > 0) {
      // 구분자 추가
      combined.push({
        '데이터_유형': `=== ${title} ===`,
        '브랜드명': '',
        '매장명': '',
        '시간': '',
        '내용': ''
      });
      
      // 데이터 추가
      data.forEach(item => {
        combined.push({
          '데이터_유형': title,
          '브랜드명': item.store_brand || '',
          '매장명': item.store_name || '',
          '시간': item.time || item.server_received_time || item.timestamp || '',
          '내용': item.alert_message || item.alertMessage || 
                  `총매출: ${item.total_sales?.toLocaleString() || 0}원` ||
                  JSON.stringify(item)
        });
      });
      
      // 빈 줄 추가
      combined.push({
        '데이터_유형': '',
        '브랜드명': '',
        '매장명': '',
        '시간': '',
        '내용': ''
      });
    }
  });
  
  return combined;
};