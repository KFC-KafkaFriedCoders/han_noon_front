import { useState } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES, MAX_TIME_SERIES } = DATA_LIMITS;


export const initializeWebSocketState = () => {
  const [paymentLimitResponse, setPaymentLimitResponse] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.PAYMENT_LIMIT_DATA);
  });
  
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.SAME_PERSON_DATA);
  });
  
  const [salesTotalData, setSalesTotalData] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.SALES_TOTAL_DATA);
  });

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
  
  const [topStoresData, setTopStoresData] = useState(() => {
    return loadStateFromStorage(STORAGE_KEYS.TOP_STORES_DATA);
  });
  
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  
  const [connected, setConnected] = useState(false);

  return {
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
    
    unreadPaymentLimit,
    setUnreadPaymentLimit,
    unreadSamePerson,
    setUnreadSamePerson,
    unreadSalesTotal,
    setUnreadSalesTotal,
    unreadTopStores,
    setUnreadTopStores,
    
    connected,
    setConnected
  };
};


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