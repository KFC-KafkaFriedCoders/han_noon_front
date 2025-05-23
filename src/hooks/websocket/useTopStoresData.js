import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX } from '../../utils/constants';

export const useTopStoresData = (selectedBrand) => {
  const [topStoresData, setTopStoresData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.TOP_STORES_DATA);
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
    localStorage.setItem(STORAGE_KEYS.TOP_STORES_DATA, JSON.stringify(topStoresData));
  }, [topStoresData]);
  
  const filteredTopStoresData = useMemo(() => {
    if (!selectedBrand) return topStoresData;
    return topStoresData.filter(item => item.store_brand === selectedBrand);
  }, [topStoresData, selectedBrand]);
  
  const handleTopStoresCardClick = useCallback((messageId) => {
    console.log('Top stores card clicked:', messageId);
  }, []);
  
  const callbacks = useMemo(() => ({
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
    }
  }), []);
  
  return {
    topStoresData: filteredTopStoresData,
    handleTopStoresCardClick,
    callbacks
  };
};