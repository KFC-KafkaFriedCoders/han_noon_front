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
  SALES_MINUTE_DATA: 'sales_minute_data',
  TOP_STORES_DATA: 'top_stores_data',
  NON_RESPONSE_DATA: 'non_response_data',
  SELECTED_BRAND: 'selected_brand',
};

// 메시지 ID 접두사
export const MESSAGE_ID_PREFIX = {
  NEW: 'new',
  EXISTING: 'existing',
};

// API 및 웹소켓 관련 상수
export const API_CONSTANTS = {
  // 웹소켓 관련 상수
  SOCKET: {
    ENDPOINTS: {
      PAYMENT_LIMIT: '/topic/payment-limit',
      SAME_PERSON: '/topic/same-person',
      SALES_TOTAL: '/topic/sales-total',
      SALES_MINUTE: '/topic/sales-minute',
      TOP_STORES: '/topic/top-stores',
      NON_RESPONSE: '/topic/non-response',
      SERVER_STATUS: '/topic/server-status'
    },
    PUBLISH: {
      BRAND_SELECT: '/app/select-brand'
    }
  },
  // HTTP API 엔드포인트
  HTTP: {
    BASE_URL: '/api',
    ENDPOINTS: {
      BRANDS: '/brands',
      STORES: '/stores',
      SALES: '/sales'
    }
  },
  // 타임아웃 값 (밀리초)
  TIMEOUTS: {
    SOCKET_CONNECT: 10000,
    API_REQUEST: 5000
  }
};