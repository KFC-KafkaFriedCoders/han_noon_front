import { useEffect } from 'react';
import { STORAGE_KEYS } from '../../utils/constants';

export const useLocalStorageSaver = ({
  paymentLimitResponse,
  samePersonResponse,
  salesTotalData,
  salesTimeSeriesData,
  topStoresData
}) => {
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA, JSON.stringify(paymentLimitResponse));
  }, [paymentLimitResponse]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAME_PERSON_DATA, JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TOTAL_DATA, JSON.stringify(salesTotalData));
  }, [salesTotalData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TIME_SERIES_DATA, JSON.stringify(salesTimeSeriesData));
  }, [salesTimeSeriesData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOP_STORES_DATA, JSON.stringify(topStoresData));
  }, [topStoresData]);
};