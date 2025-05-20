// 데이터 제한값
export const DATA_LIMITS = {
  MAX_MESSAGES: 100, // 각 카테고리별 최대 메시지 수
  MAX_TIME_SERIES: 10, // 시계열 데이터 최대 포인트 수
};

// 로컬 스토리지 키
export const STORAGE_KEYS = {
  PAYMENT_LIMIT_DATA: 'payment_limit_data',
  SAME_PERSON_DATA: 'same_person_data',
  SALES_TOTAL_DATA: 'sales_total_data',
  SALES_TIME_SERIES_DATA: 'sales_time_series_data',
  TOP_STORES_DATA: 'top_stores_data',
  SELECTED_BRAND: 'selected_brand',
};

// 메시지 ID 접두사
export const MESSAGE_ID_PREFIX = {
  NEW: 'new',
  EXISTING: 'existing',
};