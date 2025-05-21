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
  
  // 읽지 않은 메시지 상태
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAME_PERSON_DATA, JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  // 브랜드별 데이터 필터링
  const samePersonData = useMemo(() => {
    if (!selectedBrand) return samePersonResponse;
    return samePersonResponse.filter(item => item.store_brand === selectedBrand);
  }, [samePersonResponse, selectedBrand]);
  
  // 필터링된 unread 메시지
  const filteredUnreadSamePerson = useMemo(() => {
    if (!selectedBrand) return unreadSamePerson;
    
    const filteredUnread = new Set();
    unreadSamePerson.forEach(messageId => {
      const message = samePersonResponse.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadSamePerson, samePersonResponse, selectedBrand]);
  
  // 클릭 핸들러
  const handleSamePersonCardClick = useCallback((messageId) => {
    // 'all'이면 모든 알림 제거
    if (messageId === 'all') {
      setUnreadSamePerson(new Set());
      return;
    }
    
    // 특정 알림 제거
    setUnreadSamePerson(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  // 콜백 함수들
  const callbacks = useMemo(() => ({
    onSamePersonUpdate: (messageWithId) => {
      setSamePersonResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },
    onSamePersonUnread: (messageId) => {
      setUnreadSamePerson(prev => new Set([...prev, messageId]));
    }
  }), []);
  
  // 브랜드 변경 시 unread 필터링
  useEffect(() => {
    if (selectedBrand !== null) {
      setUnreadSamePerson(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
          const message = samePersonResponse.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
    }
  }, [selectedBrand, samePersonResponse]);
  
  return {
    samePersonData,
    unreadSamePerson: filteredUnreadSamePerson,
    handleSamePersonCardClick,
    callbacks
  };
};