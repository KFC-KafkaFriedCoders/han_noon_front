import { useState, useEffect, useCallback, useMemo } from 'react';
import { STORAGE_KEYS, MESSAGE_ID_PREFIX, DATA_LIMITS } from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const useNonResponseData = (selectedBrand) => {
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
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NON_RESPONSE_DATA, JSON.stringify(nonResponseData));
  }, [nonResponseData]);
  
  const filteredNonResponseData = useMemo(() => {
    if (!selectedBrand) return nonResponseData;
    return nonResponseData.filter(item => item.store_brand === selectedBrand);
  }, [nonResponseData, selectedBrand]);
  const handleNonResponseCardClick = useCallback((messageId) => {
    console.log('Non response card clicked:', messageId);
  }, []);
  
  const callbacks = useMemo(() => ({
    onNonResponseUpdate: (messageWithId) => {
      setNonResponseData(prev => {
        const existingIndex = prev.findIndex(
          item => item.store_id === messageWithId.store_id && 
                 item.store_brand === messageWithId.store_brand
        );
        
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