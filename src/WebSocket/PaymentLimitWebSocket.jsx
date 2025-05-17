import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PaymentLimitChart from "../components/charts/PaymentLimitChart";
import SamePersonChart from "../components/charts/SamPersonChart";
import { useBrand } from "../context/BrandContext";

const MAX_MESSAGES = 30; // 최대 메시지 개수 상수

const PaymentLimitWebSocket = () => {
  const { selectedBrand } = useBrand();
  
  // 출력할 데이터를 필터링하는 함수
  const filterDataByBrand = (data) => {
    if (!selectedBrand) return data;
    return data.filter(item => item.store_brand === selectedBrand);
  }

  // 로컬 스토리지에서 기존 데이터 가져오기 또는 빈 배열로 초기화
  const [paymentLimitresponse, setPaymentLimitResponse] = useState(() => {
    const savedData = localStorage.getItem("paymentLimitData");
    return savedData ? JSON.parse(savedData).slice(0, MAX_MESSAGES) : [];
  });
  
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    const savedData = localStorage.getItem("samePersonData");
    return savedData ? JSON.parse(savedData).slice(0, MAX_MESSAGES) : [];
  });
  const [salesTotalData, setSalesTotalData] = useState(() => {
    const savedData = localStorage.getItem("salesTotalData");
    return savedData ? JSON.parse(savedData).slice(0, MAX_MESSAGES) : [];
  });
  
  const [connected, setConnected] = useState(false);

  // 데이터가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    localStorage.setItem("paymentLimitData", JSON.stringify(paymentLimitresponse));
  }, [paymentLimitresponse]);

  useEffect(() => {
    localStorage.setItem("samePersonData", JSON.stringify(samePersonResponse));
  }, [samePersonResponse]);
  
  // 세일즈 데이터 저장
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
      
      // 전역 변수로 stompClient 설정 (다른 컴포넌트에서 접근 가능하도록)
      window.stompClient = stompClient;

      stompClient.subscribe("/topic/payment-limit", (message) => {
        try {
          const data = JSON.parse(message.body);
          setPaymentLimitResponse((prev) => {
            const newData = [data, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          setPaymentLimitResponse((prev) => {
            const newData = [message.body, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
        }
      });

      // 동일인 결제 탐지 구독
      stompClient.subscribe("/topic/payment-same-user", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("수신된 데이터:", data);
          setSamePersonResponse((prev) => {
            const newData = [data, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          setSamePersonResponse((prev) => {
            const newData = [message.body, ...prev].slice(0, MAX_MESSAGES);
            return newData;
          });
        }
      });

      // 서버 상태 구독
      stompClient.subscribe("/topic/server-status", (message) => {
        console.log("서버 상태:", message.body);
      });
      
      // 매출 데이터 기본 토픽 (후방 호환을 위해)
      stompClient.subscribe("/topic/sales-total", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("원래 토픽 매출 데이터 수신:", data);
          setSalesTotalData((prev) => {
            const existingIndex = prev.findIndex(item => 
              item.store_brand === data.store_brand && 
              item.update_time === data.update_time
            );
            
            if (existingIndex >= 0) {
              const newData = [...prev];
              newData[existingIndex] = data;
              return newData;
            } else {
              return [data, ...prev].slice(0, MAX_MESSAGES);
            }
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      // 브랜드 선택 후 캐시된 데이터 배치 수신
      stompClient.subscribe("/user/topic/brand-data", (message) => {
        try {
          const response = JSON.parse(message.body);
          console.log("브랜드 데이터 배치 수신:", response);
          
          if (response.event_type === "brand_data_batch") {
            // 브랜드별 캐시된 데이터 배치 수신
            if (response.items && Array.isArray(response.items)) {
              setSalesTotalData(response.items);
            }
          } else if (response.event_type === "brand_data_empty") {
            // 브랜드 데이터가 없을 경우
            setSalesTotalData([]);
            console.log("선택한 브랜드의 데이터가 없습니다:", response.brand);
          }
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      // 브랜드 데이터 실시간 업데이트 수신
      stompClient.subscribe("/user/topic/brand-data-update", (message) => {
        try {
          const data = JSON.parse(message.body);
          console.log("브랜드 데이터 업데이트 수신:", data);
          
          setSalesTotalData((prev) => {
            const existingIndex = prev.findIndex(item => 
              item.update_time === data.update_time
            );
            
            if (existingIndex >= 0) {
              const newData = [...prev];
              newData[existingIndex] = data;
              return newData;
            } else {
              return [data, ...prev].slice(0, MAX_MESSAGES);
            }
          });
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
        }
      });
      
      // 브랜드 선택 확인 메시지 구독
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

  return (
    <>
      <PaymentLimitChart title="이상 결제 탐지" paymentArr={filterDataByBrand(paymentLimitresponse)}/>
      <SamePersonChart title="동일인 결제 탐지" paymentArr={filterDataByBrand(samePersonResponse)}/>
      
      {connected && <div className="text-xs text-gray-500 p-2 bg-gray-800 rounded mt-2 mb-4">
        WebSocket 연결 상태: {connected ? "연결됨" : "연결 안됨"}
        {selectedBrand && <span className="ml-2">선택된 브랜드: {selectedBrand}</span>}
      </div>}
    </>
  );
};

export default PaymentLimitWebSocket;