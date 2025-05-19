import webSocketService from './webSocketService';
import webSocketHandlers from './webSocketHandlers';

class WebSocketSubscriptionManager {
  constructor() {
    this.subscriptions = [];
    this.isInitialized = false;
  }

  // 모든 구독 초기화
  initializeSubscriptions(callbacks) {
    if (this.isInitialized) {
      console.warn("구독이 이미 초기화됨");
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
      }
    ];

    // 모든 구독 생성
    subscriptionConfigs.forEach(config => {
      const subscription = webSocketService.subscribe(
        config.topic,
        config.handler,
        config.id
      );
      
      if (subscription) {
        this.subscriptions.push({
          id: config.id,
          topic: config.topic,
          subscription
        });
      }
    });

    this.isInitialized = true;
    console.log(`${this.subscriptions.length}개 구독 초기화 완료`);
  }

  // 모든 구독 해제
  unsubscribeAll() {
    this.subscriptions.forEach(sub => {
      webSocketService.unsubscribe(sub.id);
    });
    
    this.subscriptions = [];
    this.isInitialized = false;
    console.log("모든 구독 해제 완료");
  }

  // 구독 상태 확인
  getSubscriptionStatus() {
    return {
      total: this.subscriptions.length,
      initialized: this.isInitialized,
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