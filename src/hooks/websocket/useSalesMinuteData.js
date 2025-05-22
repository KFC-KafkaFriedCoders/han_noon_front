import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useSalesMinuteData = (selectedBrand) => {
  const [salesMinuteData, setSalesMinuteData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_MINUTE_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_MINUTE_DATA, JSON.stringify(salesMinuteData));
  }, [salesMinuteData]);
  
  const filteredSalesMinuteData = useMemo(() => {
    if (!selectedBrand) return salesMinuteData;
    return salesMinuteData.filter(item => item.store_brand === selectedBrand);
  }, [salesMinuteData, selectedBrand]);
  
  const handleSalesMinuteCardClick = useCallback((messageId) => {
    console.log('Sales minute card clicked:', messageId);
  }, []);
  
  const callbacks = useMemo(() => ({
    onSalesMinuteUpdate: (messageWithId) => {
      setSalesMinuteData(prev => {
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
    onSalesMinuteEmpty: (brand) => {
      setSalesMinuteData([]);
    }
  }), []);
  
  return {
    salesMinuteData: filteredSalesMinuteData,
    handleSalesMinuteCardClick,
    callbacks
  };
};