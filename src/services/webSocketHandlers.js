// WebSocket 메시지 핸들러들을 관리하는 클래스
class WebSocketHandlers {
  constructor() {
    this.handlers = {};
  }

  // 메시지 ID 생성
  generateMessageId(prefix = 'new') {
    return `${prefix}-${Date.now()}-${Math.random()}`;
  }

  // 메시지 파싱
  parseMessage(message) {
    try {
      return JSON.parse(message.body);
    } catch (e) {
      console.error("메시지 파싱 오류:", e);
      return { body: message.body };
    }
  }

  // 결제 제한 메시지 핸들러
  handlePaymentLimit(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // 동일인 결제 메시지 핸들러
  handleSamePersonPayment(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // 매출 총합 메시지 핸들러
  handleSalesTotal(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    // 시간순 데이터 업데이트
    if (callbacks.onTimeSeriesUpdate) {
      callbacks.onTimeSeriesUpdate(data);
    }

    // 매출 데이터 업데이트
    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // 브랜드 데이터 배치 핸들러
  handleBrandDataBatch(message, callbacks) {
    const response = this.parseMessage(message);
    
    if (response.event_type === "brand_data_batch") {
      if (response.items && Array.isArray(response.items)) {
        const itemsWithIds = response.items.map(item => ({
          ...item,
          id: item.id || this.generateMessageId('existing')
        }));
        
        if (callbacks.onUpdate) {
          callbacks.onUpdate(itemsWithIds, true); // true = batch update
        }
      }
    } else if (response.event_type === "brand_data_empty") {
      if (callbacks.onEmpty) {
        callbacks.onEmpty(response.brand);
      }
    }
  }

  // 브랜드 데이터 업데이트 핸들러
  handleBrandDataUpdate(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    // 시간순 데이터 업데이트
    if (callbacks.onTimeSeriesUpdate) {
      callbacks.onTimeSeriesUpdate(data);
    }

    // 매출 데이터 업데이트
    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // Top Stores 메시지 핸들러
  handleTopStores(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // Top Stores 배치 데이터 핸들러
  handleTopStoresDataBatch(message, callbacks) {
    const response = this.parseMessage(message);
    
    if (response.event_type === "top_stores_data_batch") {
      if (response.data) {
        const dataWithId = {
          ...response.data,
          id: response.data.id || this.generateMessageId('existing')
        };
        
        if (callbacks.onUpdate) {
          callbacks.onUpdate([dataWithId], true); // true = batch update
        }
      }
    } else if (response.event_type === "top_stores_data_empty") {
      if (callbacks.onEmpty) {
        callbacks.onEmpty();
      }
    }
  }

  // Top Stores 업데이트 핸들러
  handleTopStoresDataUpdate(message, callbacks) {
    const data = this.parseMessage(message);
    const messageId = this.generateMessageId();
    const messageWithId = { ...data, id: messageId };

    if (callbacks.onUpdate) {
      callbacks.onUpdate(messageWithId);
    }
    
    if (callbacks.onUnread) {
      callbacks.onUnread(messageId);
    }
  }

  // 서버 상태 핸들러
  handleServerStatus(message, callbacks) {
    console.log("서버 상태:", message.body);
    
    if (callbacks.onServerStatus) {
      callbacks.onServerStatus(message.body);
    }
  }
}

// 싱글톤 인스턴스
const webSocketHandlers = new WebSocketHandlers();

export default webSocketHandlers;