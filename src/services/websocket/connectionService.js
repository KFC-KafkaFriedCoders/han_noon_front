import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { API_CONSTANTS } from '../../utils/constants';

const { TIMEOUTS } = API_CONSTANTS;

class ConnectionService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.reconnectDelay = 5000;
    this.heartbeatIncoming = 4000;
    this.heartbeatOutgoing = 4000;
    this.maxReconnectAttempts = 10;
    this.reconnectAttempts = 0;
    this.reconnectTimerId = null;
    
    // 콜백 함수들
    this.onConnectCallback = null;
    this.onDisconnectCallback = null;
    this.onErrorCallback = null;
  }

  // WebSocket 연결
  // connect(url = "http://localhost:8080/payment-limit-ws") {
  connect(url = "http://3.13.184.246:8080/payment-limit-ws") {
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
  }

  // 연결 상태 확인
  isConnected() {
    return this.connected;
  }

  // STOMP 클라이언트 가져오기
  getClient() {
    return this.client;
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

  // 연결 타임아웃 설정
  setTimeout(timeout = TIMEOUTS.SOCKET_CONNECT) {
    this.timeout = timeout;
  }
}

// 싱글톤 인스턴스
const connectionService = new ConnectionService();

export default connectionService;