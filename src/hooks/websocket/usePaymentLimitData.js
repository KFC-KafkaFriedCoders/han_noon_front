import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  STORAGE_KEYS, 
  MESSAGE_ID_PREFIX, 
  DATA_LIMITS 
} from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const usePaymentLimitData = (selectedBrand) => {
  // 데이터 상태
  const [paymentLimitResponse, setPaymentLimitResponse] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA);
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
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA, JSON.stringify(paymentLimitResponse));
  }, [paymentLimitResponse]);
  
  // 브랜드별 데이터 필터링
  const paymentLimitData = useMemo(() => {
    if (!selectedBrand) return paymentLimitResponse;
    return paymentLimitResponse.filter(item => item.store_brand === selectedBrand);
  }, [paymentLimitResponse, selectedBrand]);
  
  // 필터링된 unread 메시지
  const filteredUnreadPaymentLimit = useMemo(() => {
    if (!selectedBrand) return unreadPaymentLimit;
    
    const filteredUnread = new Set();
    unreadPaymentLimit.forEach(messageId => {
      const message = paymentLimitResponse.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadPaymentLimit, paymentLimitResponse, selectedBrand]);
  
  // 클릭 핸들러
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    setUnreadPaymentLimit(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  // 콜백 함수들
  const callbacks = useMemo(() => ({
    onPaymentLimitUpdate: (messageWithId) => {
      setPaymentLimitResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },
    onPaymentLimitUnread: (messageId) => {
      setUnreadPaymentLimit(prev => new Set([...prev, messageId]));
    }
  }), []);
  
  // 브랜드 변경 시 unread 필터링
  useEffect(() => {
    if (selectedBrand !== null) {
      setUnreadPaymentLimit(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
          const message = paymentLimitResponse.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
    }
  }, [selectedBrand, paymentLimitResponse]);
  
  return {
    paymentLimitData,
    unreadPaymentLimit: filteredUnreadPaymentLimit,
    handlePaymentLimitCardClick,
    callbacks
  };
};