import { useMemo } from 'react';
import { MESSAGE_ID_PREFIX } from '../../utils/constants';

export const useFilteredData = ({
  selectedBrand,
  paymentLimitResponse,
  samePersonResponse,
  salesTotalData,
  topStoresData,
  salesTimeSeriesData
}) => {
  const paymentLimitData = useMemo(() => {
    if (!selectedBrand) return paymentLimitResponse;
    return paymentLimitResponse.filter(item => item.store_brand === selectedBrand);
  }, [paymentLimitResponse, selectedBrand]);
  
  const samePersonData = useMemo(() => {
    if (!selectedBrand) return samePersonResponse;
    return samePersonResponse.filter(item => item.store_brand === selectedBrand);
  }, [samePersonResponse, selectedBrand]);
  
  const filteredSalesTotalData = useMemo(() => {
    if (!selectedBrand) return salesTotalData;
    return salesTotalData.filter(item => item.store_brand === selectedBrand);
  }, [salesTotalData, selectedBrand]);
  
  const filteredTopStoresData = useMemo(() => {
    if (!selectedBrand) return topStoresData;
    return topStoresData.filter(item => item.store_brand === selectedBrand);
  }, [topStoresData, selectedBrand]);

  const currentBrandTimeSeries = useMemo(() => {
    if (!selectedBrand || !salesTimeSeriesData[selectedBrand]) {
      return [];
    }
    return salesTimeSeriesData[selectedBrand];
  }, [salesTimeSeriesData, selectedBrand]);

  return {
    paymentLimitData,
    samePersonData,
    salesTotalData: filteredSalesTotalData,
    topStoresData: filteredTopStoresData,
    timeSeriesData: currentBrandTimeSeries
  };
};

export const useFilteredUnreadMessages = ({
  selectedBrand,
  unreadPaymentLimit,
  unreadSamePerson,
  unreadSalesTotal,
  unreadTopStores,
  paymentLimitResponse,
  samePersonResponse,
  salesTotalData,
  topStoresData
}) => {
  const filteredUnreadPaymentLimit = useMemo(() => {
    if (!selectedBrand) return unreadPaymentLimit;
    
    const filteredUnread = new Set();
    unreadPaymentLimit.forEach(messageId => {
      if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
      
      const message = paymentLimitResponse.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadPaymentLimit, paymentLimitResponse, selectedBrand]);

  const filteredUnreadSamePerson = useMemo(() => {
    if (!selectedBrand) return unreadSamePerson;
    
    const filteredUnread = new Set();
    unreadSamePerson.forEach(messageId => {
      if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
      
      const message = samePersonResponse.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadSamePerson, samePersonResponse, selectedBrand]);

  const filteredUnreadSalesTotal = useMemo(() => {
    if (!selectedBrand) return unreadSalesTotal;
    
    const filteredUnread = new Set();
    unreadSalesTotal.forEach(messageId => {
      if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
      
      const message = salesTotalData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadSalesTotal, salesTotalData, selectedBrand]);

  const filteredUnreadTopStores = useMemo(() => {
    if (!selectedBrand) return unreadTopStores;
    
    const filteredUnread = new Set();
    unreadTopStores.forEach(messageId => {
      if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
      
      const message = topStoresData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadTopStores, topStoresData, selectedBrand]);

  return {
    unreadPaymentLimit: filteredUnreadPaymentLimit,
    unreadSamePerson: filteredUnreadSamePerson,
    unreadSalesTotal: filteredUnreadSalesTotal,
    unreadTopStores: filteredUnreadTopStores
  };
};