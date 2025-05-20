import { useCallback } from 'react';

export const useMessageHandlers = ({
  setUnreadPaymentLimit,
  setUnreadSamePerson,
  setUnreadSalesTotal,
  setUnreadTopStores
}) => {
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    setUnreadPaymentLimit(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, [setUnreadPaymentLimit]);
  
  const handleSamePersonCardClick = useCallback((messageId) => {
    setUnreadSamePerson(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, [setUnreadSamePerson]);
  
  const handleSalesTotalCardClick = useCallback((messageId) => {
    setUnreadSalesTotal(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, [setUnreadSalesTotal]);
  
  const handleTopStoresCardClick = useCallback((messageId) => {
    setUnreadTopStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, [setUnreadTopStores]);

  return {
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick
  };
};