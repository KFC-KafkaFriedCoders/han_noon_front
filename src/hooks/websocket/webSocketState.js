import { useState } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES, MAX_TIME_SERIES } = DATA_LIMITS;

/**
 * WebSocket 관련 상태 초기화 함수
 * @returns {Object} 초기화된 상태 객체
 */
export const initializeWebSocketState = () => {
  // 결제 한도 데이터 초기화
  const [paymentLimitResponse, setPaymentLimitResponse] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.PAYMENT_LIMIT_DATA);
  });
  
  // 동일인 결제 데이터 초기화
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.SAME_PERSON_DATA);
  });
  
  // 매출 총합 데이터 초기화
  const [salesTotalData, setSalesTotalData] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.SALES_TOTAL_DATA);
  });

  // 시간별 매출 데이터 초기화
  const [salesTimeSeriesData, setSalesTimeSeriesData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_TIME_SERIES_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const trimmed = {};
      Object.keys(parsed).forEach(brand => {
        trimmed[brand] = parsed[brand].slice(0, MAX_TIME_SERIES);
      });
      return trimmed;
    }
    return {};
  });
  
  // 매장 순위 데이터 초기화
  const [topStoresData, setTopStoresData] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.TOP_STORES_DATA);
  });
  
  // 읽지 않은 메시지 상태들
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  
  // 연결 상태
  const [connected, setConnected] = useState(false);

  return {
    // 상태
    paymentLimitResponse,
    setPaymentLimitResponse,
    samePersonResponse,
    setSamePersonResponse,
    salesTotalData,
    setSalesTotalData,
    salesTimeSeriesData,
    setSalesTimeSeriesData,
    topStoresData,
    setTopStoresData,
    
    // 읽지 않은 메시지
    unreadPaymentLimit,
    setUnreadPaymentLimit,
    unreadSamePerson,
    setUnreadSamePerson,
    unreadSalesTotal,
    setUnreadSalesTotal,
    unreadTopStores,
    setUnreadTopStores,
    
    // 연결 상태
    connected,
    setConnected
  };
};

/**
 * 로컬 스토리지에서 상태 로드 및 처리
 * @param {string} storageKey - 로컬 스토리지 키
 * @returns {Array} 처리된 데이터 배열
 */
function loadStateFromStorage(storageKey) {
  const savedData = localStorage.getItem(storageKey);
  if (savedData) {
    const parsed = JSON.parse(savedData);
    return parsed.map(msg => ({
      ...msg,
      id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
    })).slice(0, MAX_MESSAGES);
  }
  return [];
}