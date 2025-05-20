import { useState, useEffect } from 'react';
import { useBrand } from '../context/BrandContext';
import webSocketService from '../services/webSocketService';
import subscriptionManager from '../services/webSocketSubscriptionManager';
import { MESSAGE_ID_PREFIX, STORAGE_KEYS, DATA_LIMITS } from '../utils/constants';

const { MAX_MESSAGES, MAX_TIME_SERIES } = DATA_LIMITS;

/**
 * WebSocket 데이터와 연결 상태를 관리하는 커스텀 훅
 */
export const useWebSocket = () => {
  const { selectedBrand } = useBrand();
  
  // 데이터 상태들
  const [paymentLimitresponse, setPaymentLimitResponse] = useState(() => {
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
  
  const [salesTotalData, setSalesTotalData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_TOTAL_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });

  const [salesTimeSeriesData, setSalesTimeSeriesData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.SALES_TIME_SERIES_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      const trimmed = {};
      Object.keys(parsed).forEach(brand => {
        trimmed[brand] = parsed[brand].slice(0, MAX_TIME_SERIES);
      });
      return trimmed;
    }
    return {};
  });
  
  const [topStoresData, setTopStoresData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEYS.TOP_STORES_DATA);
    if (savedData) {
      const parsed = JSON.parse(savedData);
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `${MESSAGE_ID_PREFIX.EXISTING}-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });
  
  // 읽지 않은 메시지 상태들
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  
  const [connected, setConnected] = useState(false);

  // 시간순 누적 데이터 업데이트 함수
  const updateSalesTimeSeries = (newSalesData) => {
    const brand = newSalesData.store_brand;
    if (!brand) return;

    const currentTime = new Date();
    const currentSales = newSalesData.total_sales || 0;

    const timePoint = {
      time: currentTime.toISOString(),
      displayTime: currentTime.toLocaleTimeString('ko-KR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      totalSales: currentSales,
      timestamp: currentTime.getTime()
    };

    setSalesTimeSeriesData(prev => {
      const brandData = prev[brand] || [];
      const newBrandData = [timePoint, ...brandData].slice(0, MAX_TIME_SERIES);
      
      return {
        ...prev,
        [brand]: newBrandData
      };
    });
  };

  // WebSocket 콜백들 정의
  const webSocketCallbacks = {
    // Payment Limit 콜백들
    onPaymentLimitUpdate: (messageWithId) => {
      setPaymentLimitResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },
    onPaymentLimitUnread: (messageId) => {
      setUnreadPaymentLimit(prev => new Set([...prev, messageId]));
    },

    // Same Person 콜백들
    onSamePersonUpdate: (messageWithId) => {
      setSamePersonResponse(prev => 
        [messageWithId, ...prev].slice(0, MAX_MESSAGES)
      );
    },
    onSamePersonUnread: (messageId) => {
      setUnreadSamePerson(prev => new Set([...prev, messageId]));
    },

    // Sales Total 콜백들
    onSalesTotalUpdate: (messageWithId) => {
      setSalesTotalData(prev => {
        const existingBrandIndex = prev.findIndex(
          item => item.store_brand === messageWithId.store_brand
        );
        
        if (existingBrandIndex >= 0) {
          const newData = [...prev];
          newData[existingBrandIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev];
        }
      });
    },
    onSalesTotalUnread: (messageId) => {
      setUnreadSalesTotal(prev => new Set([...prev, messageId]));
    },
    onSalesTotalBatchUpdate: (itemsWithIds, isBatch) => {
      if (isBatch) {
        setSalesTotalData(itemsWithIds);
      }
    },
    onSalesTotalEmpty: (brand) => {
      setSalesTotalData([]);
    },

    // Time Series 콜백
    onTimeSeriesUpdate: updateSalesTimeSeries,

    // Top Stores 콜백들
    onTopStoresUpdate: (messageWithId) => {
      setTopStoresData(prev => {
        const existingBrandIndex = prev.findIndex(
          item => item.store_brand === messageWithId.store_brand
        );
        
        if (existingBrandIndex >= 0) {
          const newData = [...prev];
          newData[existingBrandIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev];
        }
      });
    },
    onTopStoresUnread: (messageId) => {
      setUnreadTopStores(prev => new Set([...prev, messageId]));
    },
    onTopStoresBatchUpdate: (dataWithIds, isBatch) => {
      if (isBatch) {
        setTopStoresData(dataWithIds);
      }
    },
    onTopStoresEmpty: () => {
      setTopStoresData([]);
    },

    // Server Status 콜백
    onServerStatus: (status) => {
      console.log("서버 상태:", status);
    }
  };

  // WebSocket 연결 및 초기화
  useEffect(() => {
    // 연결 이벤트 핸들러 설정
    webSocketService.onConnect((frame) => {
      console.log("WebSocket 연결 성공:", frame);
      setConnected(true);
      
      // 구독 초기화
      subscriptionManager.initializeSubscriptions(webSocketCallbacks);
      
      // 초기 브랜드 선택 전송
      if (selectedBrand) {
        webSocketService.selectBrand(selectedBrand);
        console.log("초기 브랜드 전송:", selectedBrand);
      }
    });

    webSocketService.onDisconnect(() => {
      setConnected(false);
      subscriptionManager.unsubscribeAll();
    });

    webSocketService.onError((frame) => {
      setConnected(false);
    });

    // WebSocket 연결
    webSocketService.connect();

    // 클린업
    return () => {
      subscriptionManager.unsubscribeAll();
      webSocketService.disconnect();
    };
  }, []); // 빈 의존성 배열로 한 번만 실행

  // 브랜드 변경 시 unread 필터링
  useEffect(() => {
    if (selectedBrand !== null) {
      const filterUnreadByBrand = (unreadSet, dataArray) => {
        const filtered = new Set();
        unreadSet.forEach(messageId => {
          // 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith(MESSAGE_ID_PREFIX.EXISTING)) return;
          const message = dataArray.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      };

      setUnreadPaymentLimit(prev => 
        filterUnreadByBrand(prev, paymentLimitresponse)
      );
      setUnreadSamePerson(prev => 
        filterUnreadByBrand(prev, samePersonResponse)
      );
      setUnreadSalesTotal(prev => 
        filterUnreadByBrand(prev, salesTotalData)
      );
      setUnreadTopStores(prev => 
        filterUnreadByBrand(prev, topStoresData)
      );
    }
  }, [selectedBrand, paymentLimitresponse, samePersonResponse, salesTotalData, topStoresData]);

  // localStorage 저장 effects
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYMENT_LIMIT_DATA, JSON.stringify(paymentLimitresponse));
  }, [paymentLimitresponse]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAME_PERSON_DATA, JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TOTAL_DATA, JSON.stringify(salesTotalData));
  }, [salesTotalData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SALES_TIME_SERIES_DATA, JSON.stringify(salesTimeSeriesData));
  }, [salesTimeSeriesData]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TOP_STORES_DATA, JSON.stringify(topStoresData));
  }, [topStoresData]);

  // 브랜드 변경 시 WebSocket에 전송
  useEffect(() => {
    if (webSocketService.isConnected() && selectedBrand) {
      webSocketService.selectBrand(selectedBrand);
      console.log("브랜드 변경 전송:", selectedBrand);
    }
  }, [selectedBrand]);

  // 브랜드별 데이터 필터링 함수
  const filterDataByBrand = (data) => {
    if (!selectedBrand) return data;
    return data.filter(item => item.store_brand === selectedBrand);
  };

  // 필터링된 unread 메시지 가져오기
  const getFilteredUnreadMessages = (unreadSet, dataArray) => {
    if (!selectedBrand) return unreadSet;
    
    const filteredUnread = new Set();
    unreadSet.forEach(messageId => {
      const message = dataArray.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  };

  // 현재 선택된 브랜드의 시간순 데이터 가져오기
  const getCurrentBrandTimeSeries = () => {
    if (!selectedBrand || !salesTimeSeriesData[selectedBrand]) {
      return [];
    }
    return salesTimeSeriesData[selectedBrand];
  };

  // 클릭 핸들러들
  const handlePaymentLimitCardClick = (messageId) => {
    setUnreadPaymentLimit(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };
  
  const handleSamePersonCardClick = (messageId) => {
    setUnreadSamePerson(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };
  
  const handleSalesTotalCardClick = (messageId) => {
    setUnreadSalesTotal(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };
  
  const handleTopStoresCardClick = (messageId) => {
    setUnreadTopStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  };

  return {
    // 데이터
    paymentLimitData: filterDataByBrand(paymentLimitresponse),
    samePersonData: filterDataByBrand(samePersonResponse),
    salesTotalData: filterDataByBrand(salesTotalData),
    topStoresData: filterDataByBrand(topStoresData),
    timeSeriesData: getCurrentBrandTimeSeries(),
    
    // 읽지 않은 메시지
    unreadPaymentLimit: getFilteredUnreadMessages(unreadPaymentLimit, paymentLimitresponse),
    unreadSamePerson: getFilteredUnreadMessages(unreadSamePerson, samePersonResponse),
    unreadSalesTotal: getFilteredUnreadMessages(unreadSalesTotal, salesTotalData),
    unreadTopStores: getFilteredUnreadMessages(unreadTopStores, topStoresData),
    
    // 클릭 핸들러
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick,
    
    // 연결 상태
    connected
  };
};
