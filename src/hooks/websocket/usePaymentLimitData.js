import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  STORAGE_KEYS, 
  MESSAGE_ID_PREFIX, 
  DATA_LIMITS 
} from '../../utils/constants';

const { MAX_MESSAGES } = DATA_LIMITS;

export const usePaymentLimitData = (selectedBrand) => {
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
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA, JSON.stringify(paymentLimitResponse));
  }, [paymentLimitResponse]);
  
  const paymentLimitData = useMemo(() => {
    if (!selectedBrand) return paymentLimitResponse;
    return paymentLimitResponse.filter(item => item.store_brand === selectedBrand);
  }, [paymentLimitResponse, selectedBrand]);
  
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    console.log('Payment limit card clicked:', messageId);
  }, []);
  
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