import { useMemo } from 'react';
import { useBrand } from '../context/BrandContext';
import { usePaymentLimitData } from './websocket/usePaymentLimitData';
import { useSamePersonData } from './websocket/useSamePersonData';
import { useSalesTotalData } from './websocket/useSalesTotalData';
import { useTopStoresData } from './websocket/useTopStoresData';
import { useNonResponseData } from './websocket/useNonResponseData';
import { useWebSocketConnection } from './websocket/useWebSocketConnection';

export const useWebSocket = () => {
  const { selectedBrand } = useBrand();
  
  // 각 데이터 타입별 훅 사용
  const paymentLimit = usePaymentLimitData(selectedBrand);
  const samePerson = useSamePersonData(selectedBrand);
  const salesTotal = useSalesTotalData(selectedBrand);
  const topStores = useTopStoresData(selectedBrand);
  const nonResponse = useNonResponseData(selectedBrand);
  
  // 모든 콜백 통합
  const allCallbacks = useMemo(() => ({
    // Payment Limit 콜백들
    ...paymentLimit.callbacks,
    
    // Same Person 콜백들
    ...samePerson.callbacks,
    
    // Sales Total 콜백들
    ...salesTotal.callbacks,
    
    // Top Stores 콜백들
    ...topStores.callbacks,
    
    // Non Response 콜백들
    ...nonResponse.callbacks,
    
    // Server Status 콜백
    onServerStatus: (status) => {
      console.log("서버 상태:", status);
    }
  }), [
    paymentLimit.callbacks,
    samePerson.callbacks,
    salesTotal.callbacks,
    topStores.callbacks,
    nonResponse.callbacks
  ]);
  
  // WebSocket 연결 관리
  const { connected } = useWebSocketConnection(selectedBrand, allCallbacks);
  
  return {
    // Payment Limit 데이터
    paymentLimitData: paymentLimit.paymentLimitData,
    unreadPaymentLimit: paymentLimit.unreadPaymentLimit,
    handlePaymentLimitCardClick: paymentLimit.handlePaymentLimitCardClick,
    
    // Same Person 데이터
    samePersonData: samePerson.samePersonData,
    unreadSamePerson: samePerson.unreadSamePerson,
    handleSamePersonCardClick: samePerson.handleSamePersonCardClick,
    
    // Sales Total 데이터
    salesTotalData: salesTotal.salesTotalData,
    timeSeriesData: salesTotal.timeSeriesData,
    unreadSalesTotal: salesTotal.unreadSalesTotal,
    handleSalesTotalCardClick: salesTotal.handleSalesTotalCardClick,
    
    // Top Stores 데이터
    topStoresData: topStores.topStoresData,
    unreadTopStores: topStores.unreadTopStores,
    handleTopStoresCardClick: topStores.handleTopStoresCardClick,
    
    // Non Response 데이터
    nonResponseData: nonResponse.nonResponseData,
    unreadNonResponse: nonResponse.unreadNonResponse,
    handleNonResponseCardClick: nonResponse.handleNonResponseCardClick,
    
    // 연결 상태
    connected
  };
};