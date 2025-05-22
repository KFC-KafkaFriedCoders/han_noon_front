import { useCallback } from 'react';

export const useMessageHandlers = () => {
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    console.log('Payment limit card clicked:', messageId);
  }, []);
  
  const handleSamePersonCardClick = useCallback((messageId) => {
    console.log('Same person card clicked:', messageId);
  }, []);
  
  const handleSalesTotalCardClick = useCallback((messageId) => {
    console.log('Sales total card clicked:', messageId);
  }, []);
  
  const handleTopStoresCardClick = useCallback((messageId) => {
    console.log('Top stores card clicked:', messageId);
  }, []);

  const handleNonResponseCardClick = useCallback((messageId) => {
    console.log('Non response card clicked:', messageId);
  }, []);

  return {
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick,
    handleNonResponseCardClick
  };
};