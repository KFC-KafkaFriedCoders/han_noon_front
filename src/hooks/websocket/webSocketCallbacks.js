import { useMemo } from 'react';
import { DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

/**
 * WebSocket 이벤트 콜백을 생성하는 훅
 * @param {Object} params - 필요한 상태 설정 함수들
 * @returns {Object} 콜백 함수 객체
 */
export const useWebSocketCallbacks = ({
  setPaymentLimitResponse,
  setSamePersonResponse,
  setSalesTotalData,
  setTopStoresData,
  updateSalesTimeSeries
}) => {
  
  // WebSocket 콜백들 정의 - useMemo로 최적화하여 불필요한 재생성 방지
  return useMemo(() => ({
    // Payment Limit 콜백들
    onPaymentLimitUpdate: (messageWithId) => {
      setPaymentLimitResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },

    // Same Person 콜백들
    onSamePersonUpdate: (messageWithId) => {
      setSamePersonResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },

    // Sales Total 콜백들
    onSalesTotalUpdate: (messageWithId) => {
      setSalesTotalData(prev => {
        const existingBrandIndex = prev.findIndex(
          item => item.store_brand === messageWithId.store_brand
        );
        
        if (existingBrandIndex >= 0) {
          const newData = [...prev];
          newData[existingBrandIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev];
        }
      });
    },
    onSalesTotalBatchUpdate: (itemsWithIds, isBatch) => {
      if (isBatch) {
        setSalesTotalData(itemsWithIds);
      }
    },
    onSalesTotalEmpty: (brand) => {
      setSalesTotalData([]);
    },

    // Time Series 콜백
    onTimeSeriesUpdate: updateSalesTimeSeries,

    // Top Stores 콜백들
    onTopStoresUpdate: (messageWithId) => {
      setTopStoresData(prev => {
        const existingBrandIndex = prev.findIndex(
          item => item.store_brand === messageWithId.store_brand
        );
        
        if (existingBrandIndex >= 0) {
          const newData = [...prev];
          newData[existingBrandIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev];
        }
      });
    },
    onTopStoresBatchUpdate: (dataWithIds, isBatch) => {
      if (isBatch) {
        setTopStoresData(dataWithIds);
      }
    },
    onTopStoresEmpty: () => {
      setTopStoresData([]);
    },

    // Server Status 콜백
    onServerStatus: (status) => {
      console.log("서버 상태:", status);
    }
  }), [
    setPaymentLimitResponse, 
    setSamePersonResponse, 
    setSalesTotalData, 
    setTopStoresData, 
    updateSalesTimeSeries
  ]);
};