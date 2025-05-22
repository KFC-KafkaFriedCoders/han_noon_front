import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useSamePersonData = (selectedBrand) => {
  // 데이터 상태
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SAME_PERSON_DATA);
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
    localStorage.setItem(STORAGE_KEYS.SAME_PERSON_DATA, JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  // 브랜드별 데이터 필터링
  const samePersonData = useMemo(() => {
    if (!selectedBrand) return samePersonResponse;
    return samePersonResponse.filter(item => item.store_brand === selectedBrand);
  }, [samePersonResponse, selectedBrand]);
  
  // 클릭 핸들러 (단순 로그용으로만 유지)
  const handleSamePersonCardClick = useCallback((messageId) => {
    console.log('Same person card clicked:', messageId);
  }, []);
  
  // 콜백 함수들
  const callbacks = useMemo(() => ({
    onSamePersonUpdate: (messageWithId) => {
      setSamePersonResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    }
  }), []);
  
  return {
    samePersonData,
    handleSamePersonCardClick,
    callbacks
  };
};