import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useNonResponseData = (selectedBrand) => {
  // 데이터 상태
  const [nonResponseData, setNonResponseData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.NON_RESPONSE_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NON_RESPONSE_DATA, JSON.stringify(nonResponseData));
  }, [nonResponseData]);
  
  // 브랜드별 데이터 필터링
  const filteredNonResponseData = useMemo(() => {
    if (!selectedBrand) return nonResponseData;
    return nonResponseData.filter(item => item.store_brand === selectedBrand);
  }, [nonResponseData, selectedBrand]);
  
  // 클릭 핸들러 (단순 로그용으로만 유지)
  const handleNonResponseCardClick = useCallback((messageId) => {
    console.log('Non response card clicked:', messageId);
  }, []);
  
  // 콜백 함수들
  const callbacks = useMemo(() => ({
    onNonResponseUpdate: (messageWithId) => {
      setNonResponseData(prev => {
        // 기존 데이터에 동일한 store_id와 store_brand가 있는지 확인
        const existingIndex = prev.findIndex(
          item => item.store_id === messageWithId.store_id && 
                 item.store_brand === messageWithId.store_brand
        );
        
        // 기존 데이터가 있으면 업데이트, 없으면 추가
        if (existingIndex >= 0) {
          const newData = [...prev];
          newData[existingIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev].slice(0, MAX_MESSAGES);
        }
      });
    }
  }), []);
  
  return {
    nonResponseData: filteredNonResponseData,
    handleNonResponseCardClick,
    callbacks
  };
};