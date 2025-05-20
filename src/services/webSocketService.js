import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

class WebSocketService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectDelay = 5000;
    this.heartbeatIncoming = 4000;
    this.heartbeatOutgoing = 4000;
    this.maxReconnectAttempts = 10;
    this.reconnectAttempts = 0;
    this.subscriptions = {};
    this.reconnectTimerId = null;
    
    // 콜백 함수들
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onErrorCallback = null;
    this.lastBrandSelection = null;
  }

  // WebSocket 연결
  connect(url = "http://localhost:8080/payment-limit-ws") {
    if (this.client && this.connected) {
      console.log("WebSocket 이미 연결됨");
      return;
    }

    // 재연결 시도 중인 타이머가 있으면 취소
    if (this.reconnectTimerId) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }

    const socket = new SockJS(url);
    this.client = new Client({
      webSocketFactory: () => socket,
      heartbeatIncoming: this.heartbeatIncoming,
      heartbeatOutgoing: this.heartbeatOutgoing,
      // 자동 재연결 비활성화 (직접 관리)
      reconnectDelay: 0
    });

    this.client.onConnect = (frame) => {
      console.log("WebSocket 연결 성공:", frame);
      this.connected = true;
      this.reconnectAttempts = 0;
      window.stompClient = this.client;
      
      // 마지막으로 선택한 브랜드가 있으면 다시 전송
      if (this.lastBrandSelection) {
        this.selectBrand(this.lastBrandSelection);
      }
      
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
      
      this.scheduleReconnect();
    };

    this.client.onWebSocketClose = () => {
      console.log("WebSocket 연결 종료");
      this.connected = false;
      
      if (this.onDisconnectCallback) {
        this.onDisconnectCallback();
      }
      
      this.scheduleReconnect();
    };

    try {
      this.client.activate();
    } catch (error) {
      console.error("WebSocket 연결 실패:", error);
      this.scheduleReconnect();
    }
  }

  // 지수 백오프 알고리즘으로 재연결 시도 예약
  scheduleReconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.log(`최대 재연결 시도 횟수(${this.maxReconnectAttempts}회)를 초과했습니다. 재연결 중단.`);
      return;
    }

    // 지수 백오프: 재시도 시간을 점진적으로 늘림
    const delay = Math.min(
      30000, // 최대 30초
      this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts)
    );
    
    console.log(`${delay}ms 후 재연결 시도 (${this.reconnectAttempts + 1}/${this.maxReconnectAttempts})`);
    
    this.reconnectTimerId = setTimeout(() => {
      this.reconnectAttempts++;
      this.connect();
    }, delay);
  }

  // WebSocket 연결 해제
  disconnect() {
    // 재연결 예약되어 있으면 취소
    if (this.reconnectTimerId) {
      clearTimeout(this.reconnectTimerId);
      this.reconnectTimerId = null;
    }

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

    try {
      const subscription = this.client.subscribe(topic, callback);
      this.subscriptions[id] = subscription;
      
      console.log(`구독 생성: ${topic}`);
      return subscription;
    } catch (error) {
      console.error(`구독 실패: ${topic}`, error);
      return null;
    }
  }

  // 구독 해제
  unsubscribe(subscriptionId) {
    if (this.subscriptions[subscriptionId]) {
      try {
        this.subscriptions[subscriptionId].unsubscribe();
        delete this.subscriptions[subscriptionId];
        console.log(`구독 해제: ${subscriptionId}`);
      } catch (error) {
        console.error(`구독 해제 실패: ${subscriptionId}`, error);
      }
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
    this.lastBrandSelection = brand;
    this.publish('/app/select-brand', { brand });
    console.log(`브랜드 선택 전송: ${brand}`);
  }
}

// 싱글톤 인스턴스
const webSocketService = new WebSocketService();

export default webSocketService;