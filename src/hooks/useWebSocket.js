import { useState, useEffect, useCallback, useMemo } from 'react';
import { useBrand } from '../context/BrandContext';
import webSocketService from '../services/webSocketService';
import subscriptionManager from '../services/webSocketSubscriptionManager';
import { MESSAGE_ID_PREFIX, STORAGE_KEYS, DATA_LIMITS } from '../utils/constants';

const { MAX_MESSAGES, MAX_TIME_SERIES } = DATA_LIMITS;

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
  
  // 읽지 않은 메시지 상태들
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  const [unreadNonResponse, setUnreadNonResponse] = useState(new Set());
  
  const [connected, setConnected] = useState(false);

  // 시간순 누적 데이터 업데이트 함수 - useCallback으로 최적화
  const updateSalesTimeSeries = useCallback((newSalesData) => {
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
  }, []);

  // WebSocket 콜백들 정의 - useMemo로 최적화하여 불필요한 재생성 방지
  const webSocketCallbacks = useMemo(() => ({
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

    // Non Response 콜백들
    onNonResponseUpdate: (messageWithId) => {
      setNonResponseData(prev => {
        // 기존 데이터에 동일한 store_id와 store_brand가 있는지 확인
        const existingIndex = prev.findIndex(
          item => item.store_id === messageWithId.store_id && 
                 item.store_brand === messageWithId.store_brand
        );
        
        // 기존 데이터가 있으면 업데이트, 없으면 추가
        if (existingIndex >= 0) {
          const newData = [...prev];
          newData[existingIndex] = messageWithId;
          return newData;
        } else {
          return [messageWithId, ...prev].slice(0, MAX_MESSAGES);
        }
      });
    },
    onNonResponseUnread: (messageId) => {
      setUnreadNonResponse(prev => new Set([...prev, messageId]));
    },

    // Server Status 콜백
    onServerStatus: (status) => {
      console.log("서버 상태:", status);
    }
  }), [updateSalesTimeSeries]);

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
  }, [webSocketCallbacks, selectedBrand]);

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
      setUnreadNonResponse(prev => 
        filterUnreadByBrand(prev, nonResponseData)
      );
    }
  }, [selectedBrand, paymentLimitresponse, samePersonResponse, salesTotalData, topStoresData, nonResponseData]);

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
  
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NON_RESPONSE_DATA, JSON.stringify(nonResponseData));
  }, [nonResponseData]);

  // 브랜드 변경 시 WebSocket에 전송
  useEffect(() => {
    if (webSocketService.isConnected() && selectedBrand) {
      webSocketService.selectBrand(selectedBrand);
      console.log("브랜드 변경 전송:", selectedBrand);
    }
  }, [selectedBrand]);

  // 브랜드별 데이터 필터링 함수 - useMemo로 최적화
  const paymentLimitData = useMemo(() => {
    if (!selectedBrand) return paymentLimitresponse;
    return paymentLimitresponse.filter(item => item.store_brand === selectedBrand);
  }, [paymentLimitresponse, selectedBrand]);
  
  const samePersonData = useMemo(() => {
    if (!selectedBrand) return samePersonResponse;
    return samePersonResponse.filter(item => item.store_brand === selectedBrand);
  }, [samePersonResponse, selectedBrand]);
  
  const filteredSalesTotalData = useMemo(() => {
    if (!selectedBrand) return salesTotalData;
    return salesTotalData.filter(item => item.store_brand === selectedBrand);
  }, [salesTotalData, selectedBrand]);
  
  const filteredTopStoresData = useMemo(() => {
    if (!selectedBrand) return topStoresData;
    return topStoresData.filter(item => item.store_brand === selectedBrand);
  }, [topStoresData, selectedBrand]);
  
  const filteredNonResponseData = useMemo(() => {
    if (!selectedBrand) return nonResponseData;
    return nonResponseData.filter(item => item.store_brand === selectedBrand);
  }, [nonResponseData, selectedBrand]);

  // 필터링된 unread 메시지 가져오기 - useMemo로 최적화
  const filteredUnreadPaymentLimit = useMemo(() => {
    if (!selectedBrand) return unreadPaymentLimit;
    
    const filteredUnread = new Set();
    unreadPaymentLimit.forEach(messageId => {
      const message = paymentLimitresponse.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadPaymentLimit, paymentLimitresponse, selectedBrand]);

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

  const filteredUnreadSalesTotal = useMemo(() => {
    if (!selectedBrand) return unreadSalesTotal;
    
    const filteredUnread = new Set();
    unreadSalesTotal.forEach(messageId => {
      const message = salesTotalData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadSalesTotal, salesTotalData, selectedBrand]);

  const filteredUnreadTopStores = useMemo(() => {
    if (!selectedBrand) return unreadTopStores;
    
    const filteredUnread = new Set();
    unreadTopStores.forEach(messageId => {
      const message = topStoresData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadTopStores, topStoresData, selectedBrand]);
  
  const filteredUnreadNonResponse = useMemo(() => {
    if (!selectedBrand) return unreadNonResponse;
    
    const filteredUnread = new Set();
    unreadNonResponse.forEach(messageId => {
      const message = nonResponseData.find(item => item.id === messageId);
      if (message && message.store_brand === selectedBrand) {
        filteredUnread.add(messageId);
      }
    });
    return filteredUnread;
  }, [unreadNonResponse, nonResponseData, selectedBrand]);

  // 현재 선택된 브랜드의 시간순 데이터 가져오기 - useMemo로 최적화
  const currentBrandTimeSeries = useMemo(() => {
    if (!selectedBrand || !salesTimeSeriesData[selectedBrand]) {
      return [];
    }
    return salesTimeSeriesData[selectedBrand];
  }, [salesTimeSeriesData, selectedBrand]);

  // 클릭 핸들러들 - useCallback으로 최적화
  const handlePaymentLimitCardClick = useCallback((messageId) => {
    setUnreadPaymentLimit(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  const handleSamePersonCardClick = useCallback((messageId) => {
    setUnreadSamePerson(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  const handleSalesTotalCardClick = useCallback((messageId) => {
    setUnreadSalesTotal(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  const handleTopStoresCardClick = useCallback((messageId) => {
    setUnreadTopStores(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);
  
  const handleNonResponseCardClick = useCallback((messageId) => {
    setUnreadNonResponse(prev => {
      const newSet = new Set(prev);
      newSet.delete(messageId);
      return newSet;
    });
  }, []);

  return {
    // 데이터
    paymentLimitData,
    samePersonData,
    salesTotalData: filteredSalesTotalData,
    topStoresData: filteredTopStoresData,
    nonResponseData: filteredNonResponseData,
    timeSeriesData: currentBrandTimeSeries,
    
    // 읽지 않은 메시지
    unreadPaymentLimit: filteredUnreadPaymentLimit,
    unreadSamePerson: filteredUnreadSamePerson,
    unreadSalesTotal: filteredUnreadSalesTotal,
    unreadTopStores: filteredUnreadTopStores,
    unreadNonResponse: filteredUnreadNonResponse,
    
    // 클릭 핸들러
    handlePaymentLimitCardClick,
    handleSamePersonCardClick,
    handleSalesTotalCardClick,
    handleTopStoresCardClick,
    handleNonResponseCardClick,
    
    // 연결 상태
    connected
  };
};