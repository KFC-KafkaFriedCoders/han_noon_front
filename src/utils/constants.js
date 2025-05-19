// WebSocket 관련 상수
export const WEBSOCKET_CONFIG = {
  URL: "http://localhost:8080/payment-limit-ws",
  RECONNECT_DELAY: 5000,
  HEARTBEAT_INCOMING: 4000,
  HEARTBEAT_OUTGOING: 4000,
};

// 데이터 제한 상수
export const DATA_LIMITS = {
  MAX_MESSAGES: 30,
  MAX_TIME_SERIES: 7,
};

// WebSocket 토픽 상수
export const WEBSOCKET_TOPICS = {
  PAYMENT_LIMIT: "/topic/payment-limit",
  PAYMENT_SAME_USER: "/topic/payment-same-user",
  SALES_TOTAL: "/topic/sales-total",
  BRAND_DATA: "/user/topic/brand-data",
  BRAND_DATA_UPDATE: "/user/topic/brand-data-update",
  BRAND_SELECTION: "/user/topic/brand-selection",
  TOP_STORES: "/topic/top-stores",
  TOP_STORES_DATA: "/user/topic/top-stores-data",
  TOP_STORES_DATA_UPDATE: "/user/topic/top-stores-data-update",
  SERVER_STATUS: "/topic/server-status",
};

// 발행 목적지 상수
export const WEBSOCKET_DESTINATIONS = {
  SELECT_BRAND: "/app/select-brand",
};

// localStorage 키 상수
export const STORAGE_KEYS = {
  PAYMENT_LIMIT_DATA: "paymentLimitData",
  SAME_PERSON_DATA: "samePersonData",
  SALES_TOTAL_DATA: "salesTotalData",
  SALES_TIME_SERIES_DATA: "salesTimeSeriesData",
  TOP_STORES_DATA: "topStoresData",
  SELECTED_BRAND: "selectedBrand",
};

// 메시지 ID 접두사
export const MESSAGE_ID_PREFIX = {
  NEW: "new",
  EXISTING: "existing",
};

// 이벤트 타입 상수
export const EVENT_TYPES = {
  BRAND_DATA_BATCH: "brand_data_batch",
  BRAND_DATA_EMPTY: "brand_data_empty",
  TOP_STORES_DATA_BATCH: "top_stores_data_batch",
  TOP_STORES_DATA_EMPTY: "top_stores_data_empty",
};

// 차트 설정 상수
export const CHART_CONFIG = {
  Y_AXIS_RANGE: 500000, // ±50만원
  DEFAULT_HEIGHT: 40,
  MARGIN: { top: 5, right: 5, left: 5, bottom: 5 },
};