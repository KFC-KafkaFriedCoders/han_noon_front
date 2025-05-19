import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PaymentLimitChart from "../components/charts/PaymentLimitChart";
import SamePersonChart from "../components/charts/SamPersonChart";
import SalesTotalChart from "../components/charts/SalesTotalChart";
import FranchiseTopStores from "../components/charts/FranchiseTopStores";
import { useBrand } from "../context/BrandContext";

const MAX_MESSAGES = 15;
const MAX_TIME_SERIES = 7; // 시간순 데이터 최대 개수를 15개에서 7개로 변경

const PaymentLimitWebSocket = () => {
  const { selectedBrand } = useBrand();
  
  const filterDataByBrand = (data) => {
    if (!selectedBrand) return data;
    return data.filter(item => item.store_brand === selectedBrand);
  }

  const [paymentLimitresponse, setPaymentLimitResponse] = useState(() => {
    const savedData = localStorage.getItem("paymentLimitData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 ID 유지, 없는 경우에만 새로 생성
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `existing-${Date.now()}-${Math.random()}`
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    const savedData = localStorage.getItem("samePersonData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 ID 유지, 없는 경우에만 새로 생성
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `existing-${Date.now()}-${Math.random()}`
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  
  // 매출 데이터도 localStorage에서 로드하도록 수정
  const [salesTotalData, setSalesTotalData] = useState(() => {
    const savedData = localStorage.getItem("salesTotalData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 ID 유지, 없는 경우에만 새로 생성
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `existing-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });

  // 브랜드별 시간순 누적 매출 데이터 관리
  const [salesTimeSeriesData, setSalesTimeSeriesData] = useState(() => {
    const savedData = localStorage.getItem("salesTimeSeriesData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 데이터가 15개를 초과하면 7개로 자르기
      const trimmed = {};
      Object.keys(parsed).forEach(brand => {
        trimmed[brand] = parsed[brand].slice(0, MAX_TIME_SERIES);
      });
      return trimmed;
    }
    return {}; // { "브랜드명": [시간순_데이터] }
  });
  
  // Top Stores 데이터도 localStorage에서 로드하도록 수정
  const [topStoresData, setTopStoresData] = useState(() => {
    const savedData = localStorage.getItem("topStoresData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 ID 유지, 없는 경우에만 새로 생성
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || `existing-${Date.now()}-${Math.random()}`
      }));
    }
    return [];
  });
  
  // 읽지 않은 메시지를 추적하는 state (localStorage에서 로드된 기존 메시지는 제외)
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  const [unreadTopStores, setUnreadTopStores] = useState(new Set());
  
  const [connected, setConnected] = useState(false);

  // 시간순 누적 데이터를 업데이트하는 함수
  const updateSalesTimeSeries = (newSalesData) => {
    const brand = newSalesData.store_brand;
    if (!brand) return;

    // 현재 시간과 총 매출 계산
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

  // selectedBrand가 변경될 때 변경전 브랜드의 읽지 않은 메시지 정리
  useEffect(() => {
    if (selectedBrand !== null) {
      // 변경된 브랜드에 해당하지 않는 메시지를 읽지 않음에서 제거
      setUnreadPaymentLimit(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // existing- 접두사가 있는 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith('existing-')) return;
          const message = paymentLimitresponse.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
      
      setUnreadSamePerson(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // existing- 접두사가 있는 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith('existing-')) return;
          const message = samePersonResponse.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
      
      setUnreadSalesTotal(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // existing- 접두사가 있는 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith('existing-')) return;
          const message = salesTotalData.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
      
      setUnreadTopStores(prev => {
        const filtered = new Set();
        prev.forEach(messageId => {
          // existing- 접두사가 있는 기존 데이터는 unread에서 제외
          if (messageId.toString().startsWith('existing-')) return;
          const message = topStoresData.find(item => item.id === messageId);
          if (message && message.store_brand === selectedBrand) {
            filtered.add(messageId);
          }
        });
        return filtered;
      });
    }
  }, [selectedBrand, paymentLimitresponse, samePersonResponse, salesTotalData, topStoresData]);

  useEffect(() => {
    localStorage.setItem("paymentLimitData", JSON.stringify(paymentLimitresponse));
  }, [paymentLimitresponse]);

  useEffect(() => {
    localStorage.setItem("samePersonData", JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  // 매출 데이터도 localStorage에 저장하도록 수정
  useEffect(() => {
    localStorage.setItem("salesTotalData", JSON.stringify(salesTotalData));
  }, [salesTotalData]);

  // 시간순 매출 데이터를 localStorage에 저장
  useEffect(() => {
    localStorage.setItem("salesTimeSeriesData", JSON.stringify(salesTimeSeriesData));
  }, [salesTimeSeriesData]);

  // Top Stores 데이터도 localStorage에 저장하도록 수정
  useEffect(() => {
    localStorage.setItem("topStoresData", JSON.stringify(topStoresData));
  }, [topStoresData]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/payment-limit-ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("WebSocket 연결 성공:", frame);
      setConnected(true);
      
      window.stompClient = stompClient;
      
      // 연결 성공 후 초기 브랜드 선택을 서버에 전송
      if (selectedBrand) {
        stompClient.publish({
          destination: '/app/select-brand',
          body: JSON.stringify({ brand: selectedBrand })
        });
        console.log("초기 브랜드 '", selectedBrand, "' 서버에 전송");
      }

      stompClient.subscribe("/topic/payment-limit", (message) => {
        try {
          const data = JSON.parse(message.body);
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          setPaymentLimitResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          // 새 메시지만 읽지 않음으로 표시
          setUnreadPaymentLimit(prev => new Set([...prev, messageId]));
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { body: message.body, id: messageId };
          
          setPaymentLimitResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          setUnreadPaymentLimit(prev => new Set([...prev, messageId]));
        }
      });

      stompClient.subscribe("/topic/payment-same-user", (message) => {
        try {
          const data = JSON.parse(message.body);
          
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          setSamePersonResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          // 새 메시지만 읽지 않음으로 표시
          setUnreadSamePerson(prev => new Set([...prev, messageId]));
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { body: message.body, id: messageId };
          
          setSamePersonResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          setUnreadSamePerson(prev => new Set([...prev, messageId]));
        }
      });

      stompClient.subscribe("/topic/server-status", (message) => {
        console.log("서버 상태:", message.body);
      });
      
      stompClient.subscribe("/topic/sales-total", (message) => {
        try {
          const data = JSON.parse(message.body);
          
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          // 시간순 누적 데이터 업데이트
          updateSalesTimeSeries(data);
          
          // 매출 데이터도 기존과 동일하게 처리 (브랜드별 대체)
          setSalesTotalData((prev) => {
            const existingBrandIndex = prev.findIndex(item => item.store_brand === data.store_brand);
            
            if (existingBrandIndex >= 0) {
              // 기존 브랜드 데이터 대체
              const newData = [...prev];
              newData[existingBrandIndex] = messageWithId;
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            } else {
              // 새로운 브랜드 데이터 추가
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return [messageWithId, ...prev];
            }
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/brand-data", (message) => {
        try {
          const response = JSON.parse(message.body);
          
          if (response.event_type === "brand_data_batch") {
            if (response.items && Array.isArray(response.items)) {
              // 배치 데이터는 기존 데이터이므로 'existing-' 접두사 사용 (읽지 않음 배지 없음)
              const itemsWithIds = response.items.map(item => ({
                ...item,
                id: item.id || `existing-${Date.now()}-${Math.random()}`
              }));
              setSalesTotalData(itemsWithIds);
            }
          } else if (response.event_type === "brand_data_empty") {
            setSalesTotalData([]);
            console.log("선택한 브랜드의 데이터가 없습니다:", response.brand);
          }
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/brand-data-update", (message) => {
        try {
          const data = JSON.parse(message.body);
          
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          // 시간순 누적 데이터 업데이트
          updateSalesTimeSeries(data);
          
          // 브랜드별 최신 데이터만 유지 (기존 데이터 대체)
          setSalesTotalData((prev) => {
            const existingBrandIndex = prev.findIndex(item => item.store_brand === data.store_brand);
            
            if (existingBrandIndex >= 0) {
              // 기존 브랜드 데이터 대체
              const newData = [...prev];
              newData[existingBrandIndex] = messageWithId;
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            } else {
              // 새로운 브랜드 데이터 추가
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return [messageWithId, ...prev];
            }
          });
        } catch (e) {
          console.error("멤시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/brand-selection", (message) => {
      });
      
      stompClient.subscribe("/topic/top-stores", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("원래 토픽 Top Stores 데이터 수신:", data);
          
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          // Top Stores 데이터도 기존과 동일하게 처리 (브랜드별 대체)
          setTopStoresData((prev) => {
            const existingBrandIndex = prev.findIndex(item => item.store_brand === data.store_brand);
            
            if (existingBrandIndex >= 0) {
              // 기존 브랜드 데이터 대체
              const newData = [...prev];
              newData[existingBrandIndex] = messageWithId;
              setUnreadTopStores(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            } else {
              // 새로운 브랜드 데이터 추가
              setUnreadTopStores(prevUnread => new Set([...prevUnread, messageId]));
              return [messageWithId, ...prev];
            }
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/top-stores-data", (message) => {
        try {
          const response = JSON.parse(message.body);
          
          if (response.event_type === "top_stores_data_batch") {
            if (response.data) {
              // 배치 데이터는 기존 데이터이므로 'existing-' 접두사 사용 (읽지 않음 배지 없음)
              const dataWithId = {
                ...response.data,
                id: response.data.id || `existing-${Date.now()}-${Math.random()}`
              };
              setTopStoresData([dataWithId]);
            }
          } else if (response.event_type === "top_stores_data_empty") {
            setTopStoresData([]);
          }
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/top-stores-data-update", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("Top Stores 브랜드 데이터 업데이트 수신:", data);
          
          // 새로운 메시지에는 'new-' 접두사로 ID 생성
          const messageId = `new-${Date.now()}-${Math.random()}`;
          const messageWithId = { ...data, id: messageId };
          
          // 브랜드별 최신 데이터만 유지 (기존 데이터 대체)
          setTopStoresData((prev) => {
            const existingBrandIndex = prev.findIndex(item => item.store_brand === data.store_brand);
            
            if (existingBrandIndex >= 0) {
              // 기존 브랜드 데이터 대체
              const newData = [...prev];
              newData[existingBrandIndex] = messageWithId;
              setUnreadTopStores(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            } else {
              // 새로운 브랜드 데이터 추가
              setUnreadTopStores(prevUnread => new Set([...prevUnread, messageId]));
              return [messageWithId, ...prev];
            }
          });
        } catch (e) {
          console.error("멤시지 파싱 오류:", e);
        }
      });
    };

    stompClient.onStompError = (frame) => {
      console.error("STOMP 오류:", frame);
      setConnected(false);
    };

    stompClient.onWebSocketClose = () => {
      console.log("WebSocket 연결 종료");
      setConnected(false);
    };

    stompClient.activate();

    return () => {
      if (stompClient.active) {
        stompClient.deactivate();
        console.log("WebSocket 연결 종료됨");
      }
    };
  }, []);

  // selectedBrand가 변경될 때 WebSocket이 연결되어 있으면 서버에 전송
  useEffect(() => {
    if (window.stompClient && window.stompClient.connected && selectedBrand) {
      window.stompClient.publish({
        destination: '/app/select-brand',
        body: JSON.stringify({ brand: selectedBrand })
      });
      console.log("브랜드 변경 '", selectedBrand, "' 서버에 전송");
    }
  }, [selectedBrand]);

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

  return (
    <>
      <PaymentLimitChart 
        title="이상 결제 탐지" 
        paymentArr={filterDataByBrand(paymentLimitresponse)}
        unreadMessages={getFilteredUnreadMessages(unreadPaymentLimit, paymentLimitresponse)}
        onCardClick={handlePaymentLimitCardClick}
      />
      <SamePersonChart 
        title="동일인 결제 탐지" 
        paymentArr={filterDataByBrand(samePersonResponse)}
        unreadMessages={getFilteredUnreadMessages(unreadSamePerson, samePersonResponse)}
        onCardClick={handleSamePersonCardClick}
      />
      <SalesTotalChart 
        title="매출 총합 모니터링" 
        salesArr={filterDataByBrand(salesTotalData)}
        timeSeriesData={getCurrentBrandTimeSeries()}
        onCardClick={handleSalesTotalCardClick}
      />
      <FranchiseTopStores
        title="매출 top 3" 
        topStoresArr={filterDataByBrand(topStoresData)}
        onCardClick={handleTopStoresCardClick}
      />
      {connected && <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded mt-2 mb-4">
        WebSocket 연결 상태: {connected ? "연결됨" : "연결 안됨"}
        {selectedBrand && <span className="ml-2">선택된 브랜드: {selectedBrand}</span>}
      </div>}
    </>
  );
};

export default PaymentLimitWebSocket;