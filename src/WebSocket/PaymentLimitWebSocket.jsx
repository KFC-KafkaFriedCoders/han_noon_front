import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PaymentLimitChart from "../components/charts/PaymentLimitChart";
import SamePersonChart from "../components/charts/SamPersonChart";
import SalesTotalChart from "../components/charts/SalesTotalChart";
import { useBrand } from "../context/BrandContext";

const MAX_MESSAGES = 30;

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
      // 기존 메시지에 ID가 없는 경우 추가
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || Date.now() + Math.random()
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    const savedData = localStorage.getItem("samePersonData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 메시지에 ID가 없는 경우 추가
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || Date.now() + Math.random()
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  const [salesTotalData, setSalesTotalData] = useState(() => {
    const savedData = localStorage.getItem("salesTotalData");
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 기존 메시지에 ID가 없는 경우 추가
      return parsed.map(msg => ({
        ...msg,
        id: msg.id || Date.now() + Math.random()
      })).slice(0, MAX_MESSAGES);
    }
    return [];
  });
  
  // 읽지 않은 메시지를 추적하는 state
  const [unreadPaymentLimit, setUnreadPaymentLimit] = useState(new Set());
  const [unreadSamePerson, setUnreadSamePerson] = useState(new Set());
  const [unreadSalesTotal, setUnreadSalesTotal] = useState(new Set());
  
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    localStorage.setItem("paymentLimitData", JSON.stringify(paymentLimitresponse));
  }, [paymentLimitresponse]);

  useEffect(() => {
    localStorage.setItem("samePersonData", JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  useEffect(() => {
    localStorage.setItem("salesTotalData", JSON.stringify(salesTotalData));
  }, [salesTotalData]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/payment-limit-ws");
    const stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.onConnect = (frame) => {
      console.log("WebSocket 연결 성공:", frame);
      setConnected(true);
      
      window.stompClient = stompClient;

      stompClient.subscribe("/topic/payment-limit", (message) => {
        try {
          const data = JSON.parse(message.body);
          // 고유 ID 추가 (시간 기반)
          const messageId = Date.now() + Math.random();
          const messageWithId = { ...data, id: messageId };
          
          setPaymentLimitResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          // 새 메시지를 읽지 않음으로 표시
          setUnreadPaymentLimit(prev => new Set([...prev, messageId]));
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          const messageId = Date.now() + Math.random();
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
          console.log("수신된 데이터:", data);
          
          // 고유 ID 추가 (시간 기반)
          const messageId = Date.now() + Math.random();
          const messageWithId = { ...data, id: messageId };
          
          setSamePersonResponse((prev) => {
            const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
          
          // 새 메시지를 읽지 않음으로 표시
          setUnreadSamePerson(prev => new Set([...prev, messageId]));
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          const messageId = Date.now() + Math.random();
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
          console.log("원래 토픽 매출 데이터 수신:", data);
          
          // 고유 ID 추가 (시간 기반)
          const messageId = Date.now() + Math.random();
          const messageWithId = { ...data, id: messageId };
          
          setSalesTotalData((prev) => {
            const existingIndex = prev.findIndex(item => 
              item.store_brand === data.store_brand && 
              item.update_time === data.update_time
            );
            
            if (existingIndex >= 0) {
              const newData = [...prev];
              newData[existingIndex] = messageWithId;
              return newData;
            } else {
              const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
              // 새로운 메시지만 읽지 않음으로 표시
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            }
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/brand-data", (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("브랜드 데이터 배치 수신:", response);
          
          if (response.event_type === "brand_data_batch") {
            if (response.items && Array.isArray(response.items)) {
              // 배치 데이터에 ID 추가
              const itemsWithIds = response.items.map(item => ({
                ...item,
                id: item.id || Date.now() + Math.random()
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
          console.log("브랜드 데이터 업데이트 수신:", data);
          
          // 고유 ID 추가
          const messageId = Date.now() + Math.random();
          const messageWithId = { ...data, id: messageId };
          
          setSalesTotalData((prev) => {
            const existingIndex = prev.findIndex(item => 
              item.update_time === data.update_time
            );
            
            if (existingIndex >= 0) {
              const newData = [...prev];
              newData[existingIndex] = messageWithId;
              return newData;
            } else {
              const newData = [messageWithId, ...prev].slice(0, MAX_MESSAGES);
              // 새로운 메시지로 읽지 않음 표시
              setUnreadSalesTotal(prevUnread => new Set([...prevUnread, messageId]));
              return newData;
            }
          });
        } catch (e) {
          console.error("멤시지 파싱 오류:", e);
        }
      });
      
      stompClient.subscribe("/user/topic/brand-selection", (message) => {
        console.log("브랜드 선택 확인:", message.body);
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

  // 카드 클릭 핸들러
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

  return (
    <>
      <PaymentLimitChart 
        title="이상 결제 탐지" 
        paymentArr={filterDataByBrand(paymentLimitresponse)}
        unreadMessages={unreadPaymentLimit}
        onCardClick={handlePaymentLimitCardClick}
      />
      <SamePersonChart 
        title="동일인 결제 탐지" 
        paymentArr={filterDataByBrand(samePersonResponse)}
        unreadMessages={unreadSamePerson}
        onCardClick={handleSamePersonCardClick}
      />
      <SalesTotalChart 
        title="매출 총합 모니터링" 
        salesArr={filterDataByBrand(salesTotalData)}
        unreadMessages={unreadSalesTotal}
        onCardClick={handleSalesTotalCardClick}
      />
      
      {connected && <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded mt-2 mb-4">
        WebSocket 연결 상태: {connected ? "연결됨" : "연결 안됨"}
        {selectedBrand && <span className="ml-2">선택된 브랜드: {selectedBrand}</span>}
      </div>}
    </>
  );
};

export default PaymentLimitWebSocket;