import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX } from '../../utils/constants';

export const useTopStoresData = (selectedBrand) => {
  // 데이터 상태
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
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOP_STORES_DATA, JSON.stringify(topStoresData));
  }, [topStoresData]);
  
  // 브랜드별 데이터 필터링
  const filteredTopStoresData = useMemo(() => {
    if (!selectedBrand) return topStoresData;
    return topStoresData.filter(item => item.store_brand === selectedBrand);
  }, [topStoresData, selectedBrand]);
  
  // 클릭 핸들러 (단순 로그용으로만 유지)
  const handleTopStoresCardClick = useCallback((messageId) => {
    console.log('Top stores card clicked:', messageId);
  }, []);
  
  // 콜백 함수들
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