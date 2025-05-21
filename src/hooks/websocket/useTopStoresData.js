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
  
  // 읽지 않은 메시지 상태
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOP_STORES_DATA, JSON.stringify(topStoresData));
  }, [topStoresData]);
  
  // 브랜드별 데이터 필터링
  const filteredTopStoresData = useMemo(() => {
    if (!selectedBrand) return topStoresData;
    return topStoresData.filter(item => item.store_brand === selectedBrand);
  }, [topStoresData, selectedBrand]);
  
  // 필터링된 unread 메시지
  const filteredUnreadTopStores = useMemo(() => {
    if (!selectedBrand) return unreadTopStores;
    
    const filteredUnread = new Set();
    unreadTopStores.forEach(messageId => {
      const message = topStoresData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadTopStores, topStoresData, selectedBrand]);
  
  // 클릭 핸들러
  const handleTopStoresCardClick = useCallback((messageId) => {
    setUnreadTopStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
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
    onTopStoresUnread: (messageId) => {
      setUnreadTopStores(prev => new Set([...prev, messageId]));
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
  
  // 브랜드 변경 시 unread 필터링
  useEffect(() => {
    if (selectedBrand !== null) {
      setUnreadTopStores(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
          const message = topStoresData.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
    }
  }, [selectedBrand, topStoresData]);
  
  return {
    topStoresData: filteredTopStoresData,
    unreadTopStores: filteredUnreadTopStores,
    handleTopStoresCardClick,
    callbacks
  };
};