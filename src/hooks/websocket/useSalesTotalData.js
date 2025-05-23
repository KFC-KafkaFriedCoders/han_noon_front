import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES, MAX_TIME_SERIES } = DATA_LIMITS;

export const useSalesTotalData = (selectedBrand) => {
  const [salesTotalData, setSalesTotalData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_TOTAL_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
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
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TOTAL_DATA, JSON.stringify(salesTotalData));
  }, [salesTotalData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TIME_SERIES_DATA, JSON.stringify(salesTimeSeriesData));
  }, [salesTimeSeriesData]);
  
  const filteredSalesTotalData = useMemo(() => {
    if (!selectedBrand) return salesTotalData;
    return salesTotalData.filter(item => item.store_brand === selectedBrand);
  }, [salesTotalData, selectedBrand]);
  
  const timeSeriesData = useMemo(() => {
    if (!selectedBrand || !salesTimeSeriesData[selectedBrand]) {
      return [];
    }
    return salesTimeSeriesData[selectedBrand];
  }, [salesTimeSeriesData, selectedBrand]);
  
  const handleSalesTotalCardClick = useCallback((messageId) => {
    console.log('Sales total card clicked:', messageId);
  }, []);
  
  const updateSalesTimeSeries = useCallback((newSalesData) => {
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
      timestamp: currentTime.getTime()
    };

    setSalesTimeSeriesData(prev => {
      const brandData = prev[brand] || [];
      const newBrandData = [timePoint, ...brandData].slice(0, MAX_TIME_SERIES);
      
      return {
        ...prev,
        [brand]: newBrandData
      };
    });
  }, []);
  
  const callbacks = useMemo(() => ({
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
    onTimeSeriesUpdate: updateSalesTimeSeries
  }), [updateSalesTimeSeries]);
  
  return {
    salesTotalData: filteredSalesTotalData,
    timeSeriesData,
    handleSalesTotalCardClick,
    callbacks
  };
};