import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectDelay = 5000;
    this.heartbeatIncoming = 4000;
    this.heartbeatOutgoing = 4000;
    this.subscriptions = {};
    
    // 콜백 함수들
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onErrorCallback = null;
  }

  // WebSocket 연결
  connect(url = "http://localhost:8080/payment-limit-ws") {
    if (this.client && this.connected) {
      console.log("WebSocket 이미 연결됨");
      return;
    }

    const socket = new SockJS(url);
    this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: this.reconnectDelay,
      heartbeatIncoming: this.heartbeatIncoming,
      heartbeatOutgoing: this.heartbeatOutgoing,
    });

    this.client.onConnect = (frame) => {
      console.log("WebSocket 연결 성공:", frame);
      this.connected = true;
      window.stompClient = this.client;
      
      if (this.onConnectCallback) {
        this.onConnectCallback(frame);
      }
    };

    this.client.onStompError = (frame) => {
      console.error("STOMP 오류:", frame);
      this.connected = false;
      
      if (this.onErrorCallback) {
        this.onErrorCallback(frame);
      }
    };

    this.client.onWebSocketClose = () => {
      console.log("WebSocket 연결 종료");
      this.connected = false;
      
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback();
      }
    };

    this.client.activate();
  }

  // WebSocket 연결 해제
  disconnect() {
    if (this.client && this.client.active) {
      this.client.deactivate();
      console.log("WebSocket 연결 종료됨");
    }
    this.connected = false;
    this.subscriptions = {};
  }

  // 메시지 발행
  publish(destination, message) {
    if (this.client && this.connected) {
      this.client.publish({
        destination,
        body: JSON.stringify(message)
      });
    } else {
      console.warn("WebSocket이 연결되지 않음");
    }
  }

  // 구독
  subscribe(topic, callback, subscriptionId = null) {
    if (!this.client || !this.connected) {
      console.warn("WebSocket이 연결되지 않음");
      return null;
    }

    const id = subscriptionId || topic;
    
    if (this.subscriptions[id]) {
      console.warn(`이미 구독중: ${topic}`);
      return this.subscriptions[id];
    }

    const subscription = this.client.subscribe(topic, callback);
    this.subscriptions[id] = subscription;
    
    console.log(`구독 생성: ${topic}`);
    return subscription;
  }

  // 구독 해제
  unsubscribe(subscriptionId) {
    if (this.subscriptions[subscriptionId]) {
      this.subscriptions[subscriptionId].unsubscribe();
      delete this.subscriptions[subscriptionId];
      console.log(`구독 해제: ${subscriptionId}`);
    }
  }

  // 모든 구독 해제
  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach(id => {
      this.unsubscribe(id);
    });
  }

  // 연결 상태 확인
  isConnected() {
    return this.connected;
  }

  // 이벤트 리스너 설정
  onConnect(callback) {
    this.onConnectCallback = callback;
  }

  onDisconnect(callback) {
    this.onDisconnectCallback = callback;
  }

  onError(callback) {
    this.onErrorCallback = callback;
  }

  // 브랜드 선택 메시지 전송
  selectBrand(brand) {
    this.publish('/app/select-brand', { brand });
    console.log(`브랜드 선택 전송: ${brand}`);
  }
}

// 싱글톤 인스턴스
const webSocketService = new WebSocketService();

export default webSocketService;