import connectionService from './connectionService';
import messageService from './messageService';
import { API_CONSTANTS } from '../../utils/constants';

const { SOCKET } = API_CONSTANTS;

class SubscriptionService {
  constructor() {
    this.subscriptions = {};
    this.callbacks = {};
  }

  // 구독
  subscribe(topic, callback, subscriptionId = null) {
    const client = connectionService.getClient();
    if (!client || !connectionService.isConnected()) {
      console.warn("WebSocket이 연결되지 않음");
      return null;
    }

    const id = subscriptionId || topic;
    
    if (this.subscriptions[id]) {
      console.warn(`이미 구독중: ${topic}`);
      return this.subscriptions[id];
    }

    try {
      const subscription = client.subscribe(topic, callback);
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

  // 콜백 등록
  setCallbacks(callbacks) {
    this.callbacks = callbacks;
  }

  // 모든 토픽에 대한 구독 설정
  initializeSubscriptions() {
    if (!this.callbacks) {
      console.error("콜백이 설정되지 않음");
      return;
    }

    // 이상 결제 구독
    this.subscribe(SOCKET.ENDPOINTS.PAYMENT_LIMIT, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        const messageWithId = messageService.addIdToMessage(data);
        
        if (this.callbacks.onPaymentLimitUpdate) {
          this.callbacks.onPaymentLimitUpdate(messageWithId);
        }
      } catch (error) {
        console.error("이상 결제 메시지 처리 오류:", error);
      }
    });

    // 동일인 결제 구독
    this.subscribe(SOCKET.ENDPOINTS.SAME_PERSON, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        const messageWithId = messageService.addIdToMessage(data);
        
        if (this.callbacks.onSamePersonUpdate) {
          this.callbacks.onSamePersonUpdate(messageWithId);
        }
      } catch (error) {
        console.error("동일인 결제 메시지 처리 오류:", error);
      }
    });

    // 매출 총합 구독
    this.subscribe(SOCKET.ENDPOINTS.SALES_TOTAL, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        // 배치 업데이트인 경우
        if (Array.isArray(data)) {
          const itemsWithIds = data.map(item => messageService.addIdToMessage(item));
          
          if (this.callbacks.onSalesTotalBatchUpdate) {
            this.callbacks.onSalesTotalBatchUpdate(itemsWithIds, true);
          }
          
          // 각 항목에 대해 시계열 데이터 업데이트
          itemsWithIds.forEach(item => {
            if (this.callbacks.onTimeSeriesUpdate) {
              this.callbacks.onTimeSeriesUpdate(item);
            }
          });
        } 
        // 단일 업데이트인 경우
        else {
          const messageWithId = messageService.addIdToMessage(data);
          
          if (this.callbacks.onSalesTotalUpdate) {
            this.callbacks.onSalesTotalUpdate(messageWithId);
          }
          
          if (this.callbacks.onTimeSeriesUpdate) {
            this.callbacks.onTimeSeriesUpdate(messageWithId);
          }
        }
      } catch (error) {
        console.error("매출 총합 메시지 처리 오류:", error);
      }
    });

    // 분별 매출 구독
    this.subscribe(SOCKET.ENDPOINTS.SALES_MINUTE, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        const messageWithId = messageService.addIdToMessage(data);
        
        if (this.callbacks.onSalesMinuteUpdate) {
          this.callbacks.onSalesMinuteUpdate(messageWithId);
        }
      } catch (error) {
        console.error("분별 매출 메시지 처리 오류:", error);
      }
    });

    // 매출 상위 매장 구독
    this.subscribe(SOCKET.ENDPOINTS.TOP_STORES, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        // 배치 업데이트인 경우
        if (Array.isArray(data)) {
          const itemsWithIds = data.map(item => messageService.addIdToMessage(item));
          
          if (this.callbacks.onTopStoresBatchUpdate) {
            this.callbacks.onTopStoresBatchUpdate(itemsWithIds, true);
          }
        } 
        // 단일 업데이트인 경우
        else {
          const messageWithId = messageService.addIdToMessage(data);
          
          if (this.callbacks.onTopStoresUpdate) {
            this.callbacks.onTopStoresUpdate(messageWithId);
          }
        }
      } catch (error) {
        console.error("매출 상위 매장 메시지 처리 오류:", error);
      }
    });

    // 비응답 매장 구독
    this.subscribe(SOCKET.ENDPOINTS.NON_RESPONSE, (message) => {
      try {
        const data = JSON.parse(message.body);
        
        const messageWithId = messageService.addIdToMessage(data);
        
        if (this.callbacks.onNonResponseUpdate) {
          this.callbacks.onNonResponseUpdate(messageWithId);
        }
      } catch (error) {
        console.error("비응답 매장 메시지 처리 오류:", error);
      }
    });

    // 서버 상태 구독
    this.subscribe(SOCKET.ENDPOINTS.SERVER_STATUS, (message) => {
      try {
        const data = JSON.parse(message.body);
        console.log("서버 상태 메시지:", data);
        
        if (this.callbacks.onServerStatus) {
          this.callbacks.onServerStatus(data);
        }
      } catch (error) {
        console.error("서버 상태 메시지 처리 오류:", error);
      }
    });
  }
}

// 싱글톤 인스턴스
const subscriptionService = new SubscriptionService();

export default subscriptionService;