import React, { memo } from 'react';
import { useBrand } from '../../context/BrandContext';
import { useWebSocket } from '../../hooks/useWebSocket';

import PaymentLimitChart from '../charts/PaymentLimitChart';
import SamePersonChart from '../charts/SamPersonChart';
import SalesTotalChart from '../charts/SalesTotalChart';
import FranchiseTopStores from '../charts/FranchiseTopStores';
import NonResponseChart from '../charts/NonResponseChart';

const MemoizedPaymentLimitChart = memo(PaymentLimitChart);
const MemoizedSamePersonChart = memo(SamePersonChart);
const MemoizedSalesTotalChart = memo(SalesTotalChart);
const MemoizedFranchiseTopStores = memo(FranchiseTopStores);
const MemoizedNonResponseChart = memo(NonResponseChart);

const DataDisplay = () => {
  const { selectedBrand } = useBrand();
  const {
    paymentLimitData,
    samePersonData,
    salesTotalData,
    topStoresData,
    nonResponseData,
    timeSeriesData,
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick,
    handleNonResponseCardClick,
    connected
  } = useWebSocket();

  return (
    <>
      <MemoizedPaymentLimitChart 
        title="이상 결제 탐지" 
        paymentArr={paymentLimitData}
        onCardClick={handlePaymentLimitCardClick}
      />
      <MemoizedSamePersonChart 
        title="동일인 결제 탐지" 
        paymentArr={samePersonData}
        onCardClick={handleSamePersonCardClick}
      />
      <MemoizedSalesTotalChart 
        title="매출 총합 모니터링" 
        salesArr={salesTotalData}
        timeSeriesData={timeSeriesData}
        onCardClick={handleSalesTotalCardClick}
      />
      <MemoizedFranchiseTopStores
        title="매출 top 3" 
        topStoresArr={topStoresData}
        onCardClick={handleTopStoresCardClick}
      />
      <MemoizedNonResponseChart
        title="비응답 매장 정보" 
        nonResponseArr={nonResponseData}
        onCardClick={handleNonResponseCardClick}
      />
    </>
  );
};

export default memo(DataDisplay);