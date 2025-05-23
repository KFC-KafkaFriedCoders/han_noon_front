import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useSamePersonData = (selectedBrand) => {
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
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAME_PERSON_DATA, JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  const samePersonData = useMemo(() => {
    if (!selectedBrand) return samePersonResponse;
    return samePersonResponse.filter(item => item.store_brand === selectedBrand);
  }, [samePersonResponse, selectedBrand]);
  
  const handleSamePersonCardClick = useCallback((messageId) => {
    console.log('Same person card clicked:', messageId);
  }, []);
  
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