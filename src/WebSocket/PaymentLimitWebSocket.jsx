import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PaymentLimitChart from "../components/charts/PaymentLimitChart";
import SamePersonChart from "../components/charts/SamPersonChart";

const MAX_MESSAGES = 30; // 최대 메시지 개수 상수

const PaymentLimitWebSocket = () => {
  // 로컬 스토리지에서 기존 데이터 가져오기 또는 빈 배열로 초기화
  const [paymentLimitresponse, setPaymentLimitResponse] = useState(() => {
    const savedData = localStorage.getItem("paymentLimitData");
    return savedData ? JSON.parse(savedData).slice(0, MAX_MESSAGES) : [];
  });
  
  const [samePersonResponse, setSamePersonResponse] = useState(() => {
    const savedData = localStorage.getItem("samePersonData");
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

      stompClient.subscribe("/topic/server-status", (message) => {
        console.log("서버 상태:", message.body);
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
      <PaymentLimitChart title="이상 결제 탐지" paymentArr={paymentLimitresponse}/>
      <SamePersonChart title="동일인 결제 탐지" paymentArr={samePersonResponse}/>
    </>
  );
};

export default PaymentLimitWebSocket;