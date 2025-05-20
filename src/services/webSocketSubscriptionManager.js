import webSocketService from './webSocketService';
import webSocketHandlers from './webSocketHandlers';

class WebSocketSubscriptionManager {
  constructor() {
    this.subscriptions = [];
    this.isInitialized = false;
    this.pendingCallbacks = null;
  }

  // 모든 구독 초기화
  initializeSubscriptions(callbacks) {
    // 이미 초기화 되어 있으면 해제 후 재구독
    if (this.isInitialized) {
      console.log("기존 구독 정리 후 재구독 시작");
      this.unsubscribeAll();
    }

    // WebSocket이 연결되어 있지 않으면 콜백 저장 후 나중에 처리
    if (!webSocketService.isConnected()) {
      console.log("WebSocket 연결 안됨, 콜백 저장");
      this.pendingCallbacks = callbacks;
      return;
    }

    const subscriptionConfigs = [
      {
        topic: "/topic/payment-limit",
        handler: (message) => webSocketHandlers.handlePaymentLimit(message, {
          onUpdate: callbacks.onPaymentLimitUpdate,
          onUnread: callbacks.onPaymentLimitUnread
        }),
        id: "payment-limit"
      },
      {
        topic: "/topic/payment-same-user",
        handler: (message) => webSocketHandlers.handleSamePersonPayment(message, {
          onUpdate: callbacks.onSamePersonUpdate,
          onUnread: callbacks.onSamePersonUnread
        }),
        id: "same-person"
      },
      {
        topic: "/topic/sales-total",
        handler: (message) => webSocketHandlers.handleSalesTotal(message, {
          onUpdate: callbacks.onSalesTotalUpdate,
          onUnread: callbacks.onSalesTotalUnread,
          onTimeSeriesUpdate: callbacks.onTimeSeriesUpdate
        }),
        id: "sales-total"
      },
      {
        topic: "/user/topic/brand-data",
        handler: (message) => webSocketHandlers.handleBrandDataBatch(message, {
          onUpdate: callbacks.onSalesTotalBatchUpdate,
          onEmpty: callbacks.onSalesTotalEmpty
        }),
        id: "brand-data"
      },
      {
        topic: "/user/topic/brand-data-update",
        handler: (message) => webSocketHandlers.handleBrandDataUpdate(message, {
          onUpdate: callbacks.onSalesTotalUpdate,
          onUnread: callbacks.onSalesTotalUnread,
          onTimeSeriesUpdate: callbacks.onTimeSeriesUpdate
        }),
        id: "brand-data-update"
      },
      {
        topic: "/user/topic/brand-selection",
        handler: (message) => {
          // 브랜드 선택 응답 처리 (필요시)
        },
        id: "brand-selection"
      },
      {
        topic: "/topic/top-stores",
        handler: (message) => webSocketHandlers.handleTopStores(message, {
          onUpdate: callbacks.onTopStoresUpdate,
          onUnread: callbacks.onTopStoresUnread
        }),
        id: "top-stores"
      },
      {
        topic: "/user/topic/top-stores-data",
        handler: (message) => webSocketHandlers.handleTopStoresDataBatch(message, {
          onUpdate: callbacks.onTopStoresBatchUpdate,
          onEmpty: callbacks.onTopStoresEmpty
        }),
        id: "top-stores-data"
      },
      {
        topic: "/user/topic/top-stores-data-update",
        handler: (message) => webSocketHandlers.handleTopStoresDataUpdate(message, {
          onUpdate: callbacks.onTopStoresUpdate,
          onUnread: callbacks.onTopStoresUnread
        }),
        id: "top-stores-data-update"
      },
      {
        topic: "/topic/server-status",
        handler: (message) => webSocketHandlers.handleServerStatus(message, {
          onServerStatus: callbacks.onServerStatus
        }),
        id: "server-status"
      },
      {
        topic: "/user/topic/error",
        handler: (message) => {
          try {
            const error = JSON.parse(message.body);
            console.error("서버 오류 메시지:", error);
          } catch (e) {
            console.error("서버 오류 메시지 파싱 실패:", message.body);
          }
        },
        id: "error-messages"
      }
    ];

    // 모든 구독 생성
    const successfulSubscriptions = [];
    
    subscriptionConfigs.forEach(config => {
      try {
        const subscription = webSocketService.subscribe(
          config.topic,
          config.handler,
          config.id
        );
        
        if (subscription) {
          successfulSubscriptions.push({
            id: config.id,
            topic: config.topic,
            subscription
          });
        }
      } catch (error) {
        console.error(`구독 설정 실패: ${config.id}`, error);
      }
    });

    this.subscriptions = successfulSubscriptions;
    this.isInitialized = true;
    this.pendingCallbacks = null;
    
    console.log(`${this.subscriptions.length}개 구독 초기화 완료`);
  }

  // 모든 구독 해제
  unsubscribeAll() {
    this.subscriptions.forEach(sub => {
      try {
        webSocketService.unsubscribe(sub.id);
      } catch (error) {
        console.error(`구독 해제 실패: ${sub.id}`, error);
      }
    });
    
    this.subscriptions = [];
    this.isInitialized = false;
    console.log("모든 구독 해제 완료");
  }

  // 보류 중인 구독 처리
  processPendingSubscriptions() {
    if (this.pendingCallbacks && webSocketService.isConnected()) {
      console.log("보류 중인 구독 처리");
      this.initializeSubscriptions(this.pendingCallbacks);
      this.pendingCallbacks = null;
    }
  }

  // 구독 상태 확인
  getSubscriptionStatus() {
    return {
      total: this.subscriptions.length,
      initialized: this.isInitialized,
      connected: webSocketService.isConnected(),
      subscriptions: this.subscriptions.map(sub => ({
        id: sub.id,
        topic: sub.topic
      }))
    };
  }
}

// 싱글톤 인스턴스
const subscriptionManager = new WebSocketSubscriptionManager();

export default subscriptionManager;