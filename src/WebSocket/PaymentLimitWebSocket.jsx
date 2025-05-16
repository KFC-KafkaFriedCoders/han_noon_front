import { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import PaymentLimitChart from "../components/charts/PaymentLimitChart";

const PaymentLimitWebSocket = () => {
  const [response, setResponse] = useState([]);
  const [connected, setConnected] = useState(false);

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
          console.log("수신된 데이터:", data);
          setResponse((prev) => [data, ...prev]);
          console.log(response)
        } catch (e) {
          console.error("메시지 파싱 오류:", e);
          setResponse((prev) => [message.body, ...prev]);
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
    <PaymentLimitChart title="이상 결제 탐지" paymentArr={response}/>
  );
};

export default PaymentLimitWebSocket;