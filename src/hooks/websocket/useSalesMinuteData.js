import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;
const MAX_MINUTE_HISTORY = 5; 

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

  const [salesMinuteTimeSeriesData, setSalesMinuteTimeSeriesData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_MINUTE_TIME_SERIES_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const trimmed = {};
      Object.keys(parsed).forEach(brand => {
        trimmed[brand] = parsed[brand].slice(0, MAX_MINUTE_HISTORY);
      });
      return trimmed;
    }
    return {};
  });
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_MINUTE_DATA, JSON.stringify(salesMinuteData));
  }, [salesMinuteData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_MINUTE_TIME_SERIES_DATA, JSON.stringify(salesMinuteTimeSeriesData));
  }, [salesMinuteTimeSeriesData]);
  
  const filteredSalesMinuteData = useMemo(() => {
    if (!selectedBrand) return salesMinuteData;
    return salesMinuteData.filter(item => item.store_brand === selectedBrand);
  }, [salesMinuteData, selectedBrand]);

  const minuteTimeSeriesData = useMemo(() => {
    if (!selectedBrand || !salesMinuteTimeSeriesData[selectedBrand]) {
      return [];
    }
    return salesMinuteTimeSeriesData[selectedBrand];
  }, [salesMinuteTimeSeriesData, selectedBrand]);
  
  const handleSalesMinuteCardClick = useCallback((messageId) => {
    console.log('Sales minute card clicked:', messageId);
  }, []);

  const updateSalesMinuteTimeSeries = useCallback((newSalesData) => {
    const brand = newSalesData.store_brand;
    if (!brand) return;

    const currentTime = new Date();
    const currentSales = newSalesData.total_sales || 0;

    const timePoint = {
      time: currentTime.toISOString(),
      displayTime: currentTime.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      totalSales: currentSales,
      storeCount: newSalesData.store_count || 0,
      timestamp: currentTime.getTime()
    };

    setSalesMinuteTimeSeriesData(prev => {
      const brandData = prev[brand] || [];
      const newBrandData = [timePoint, ...brandData].slice(0, MAX_MINUTE_HISTORY);
      
      return {
        ...prev,
        [brand]: newBrandData
      };
    });
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

      updateSalesMinuteTimeSeries(messageWithId);
    },
    onSalesMinuteEmpty: (brand) => {
      setSalesMinuteData([]);
    }
  }), [updateSalesMinuteTimeSeries]);
  
  return {
    salesMinuteData: filteredSalesMinuteData, 
    minuteTimeSeriesData, 
    handleSalesMinuteCardClick,
    callbacks
  };
};