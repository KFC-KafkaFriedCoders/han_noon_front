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
  
  // localStorage 저장 effect
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA, JSON.stringify(paymentLimitResponse));
  }, [paymentLimitResponse]);
  
  // 브랜드별 데이터 필터링
  const paymentLimitData = useMemo(() => {
    if (!selectedBrand) return paymentLimitResponse;
    return paymentLimitResponse.filter(item => item.store_brand === selectedBrand);
  }, [paymentLimitResponse, selectedBrand]);
  
  // 클릭 핸들러 (단순 로그용으로만 유지)
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    console.log('Payment limit card clicked:', messageId);
  }, []);
  
  // 콜백 함수들
  const callbacks = useMemo(() => ({
    onPaymentLimitUpdate: (messageWithId) => {
      setPaymentLimitResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    }
  }), []);
  
  return {
    paymentLimitData,
    handlePaymentLimitCardClick,
    callbacks
  };
};