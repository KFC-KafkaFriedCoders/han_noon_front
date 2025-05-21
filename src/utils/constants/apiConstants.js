// API 및 웹소켓 관련 상수
export const API_CONSTANTS = {
  // 웹소켓 관련 상수
  SOCKET: {
    ENDPOINTS: {
      PAYMENT_LIMIT: '/topic/payment-limit',
      SAME_PERSON: '/topic/same-person',
      SALES_TOTAL: '/topic/sales-total',
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