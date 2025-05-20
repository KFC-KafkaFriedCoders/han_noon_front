import React from 'react';
import { useBrand } from '../../context/BrandContext';
import { useWebSocket } from '../../hooks/useWebSocket';

// 차트 컴포넌트 가져오기
import PaymentLimitChart from '../charts/PaymentLimitChart';
import SamePersonChart from '../charts/SamPersonChart';
import SalesTotalChart from '../charts/SalesTotalChart';
import FranchiseTopStores from '../charts/FranchiseTopStores';

const DataDisplay = () => {
  const { selectedBrand } = useBrand();
  const {
    paymentLimitData,
    samePersonData,
    salesTotalData,
    topStoresData,
    timeSeriesData,
    unreadPaymentLimit,
    unreadSamePerson,
    unreadSalesTotal,
    unreadTopStores,
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick,
    connected
  } = useWebSocket();

  return (
    <>
      <PaymentLimitChart 
        title="이상 결제 탐지" 
        paymentArr={paymentLimitData}
        unreadMessages={unreadPaymentLimit}
        onCardClick={handlePaymentLimitCardClick}
      />
      <SamePersonChart 
        title="동일인 결제 탐지" 
        paymentArr={samePersonData}
        unreadMessages={unreadSamePerson}
        onCardClick={handleSamePersonCardClick}
      />
      <SalesTotalChart 
        title="매출 총합 모니터링" 
        salesArr={salesTotalData}
        timeSeriesData={timeSeriesData}
        onCardClick={handleSalesTotalCardClick}
      />
      <FranchiseTopStores
        title="매출 top 3" 
        topStoresArr={topStoresData}
        onCardClick={handleTopStoresCardClick}
      />
      {connected && (
        <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded mt-2 mb-4">
          WebSocket 연결 상태: {connected ? "연결됨" : "연결 안됨"}
          {selectedBrand && <span className="ml-2">선택된 브랜드: {selectedBrand}</span>}
        </div>
      )}
    </>
  );
};

export default DataDisplay;
