import { useMemo } from 'react';
import { DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useWebSocketCallbacks = ({
  setPaymentLimitResponse,
  setSamePersonResponse,
  setSalesTotalData,
  setTopStoresData,
  updateSalesTimeSeries
}) => {
  
  return useMemo(() => ({
    onPaymentLimitUpdate: (messageWithId) => {
      setPaymentLimitResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },

    onSamePersonUpdate: (messageWithId) => {
      setSamePersonResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },

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

    onTimeSeriesUpdate: updateSalesTimeSeries,

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