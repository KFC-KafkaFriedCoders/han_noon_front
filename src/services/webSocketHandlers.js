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
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
      const messageWithId = { ...data, id: messageId };

      if (callbacks.onUpdate) {
        callbacks.onUpdate(messageWithId);
      }
      
      if (callbacks.onUnread) {
        callbacks.onUnread(messageId);
      }
    } catch (error) {
      console.error("결제 제한 메시지 처리 오류:", error);
    }
  }

  // 동일인 결제 메시지 핸들러
  handleSamePersonPayment(message, callbacks) {
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
      const messageWithId = { ...data, id: messageId };

      if (callbacks.onUpdate) {
        callbacks.onUpdate(messageWithId);
      }
      
      if (callbacks.onUnread) {
        callbacks.onUnread(messageId);
      }
    } catch (error) {
      console.error("동일인 결제 메시지 처리 오류:", error);
    }
  }

  // 매출 총합 메시지 핸들러
  handleSalesTotal(message, callbacks) {
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
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
    } catch (error) {
      console.error("매출 총합 메시지 처리 오류:", error);
    }
  }

  // 브랜드 데이터 배치 핸들러
  handleBrandDataBatch(message, callbacks) {
    try {
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
    } catch (error) {
      console.error("브랜드 데이터 배치 처리 오류:", error);
    }
  }

  // 브랜드 데이터 업데이트 핸들러
  handleBrandDataUpdate(message, callbacks) {
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
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
    } catch (error) {
      console.error("브랜드 데이터 업데이트 처리 오류:", error);
    }
  }

  // Top Stores 메시지 핸들러
  handleTopStores(message, callbacks) {
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
      const messageWithId = { ...data, id: messageId };

      if (callbacks.onUpdate) {
        callbacks.onUpdate(messageWithId);
      }
      
      if (callbacks.onUnread) {
        callbacks.onUnread(messageId);
      }
    } catch (error) {
      console.error("Top Stores 메시지 처리 오류:", error);
    }
  }

  // Top Stores 배치 데이터 핸들러
  handleTopStoresDataBatch(message, callbacks) {
    try {
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
    } catch (error) {
      console.error("Top Stores 배치 데이터 처리 오류:", error);
    }
  }

  // Top Stores 업데이트 핸들러
  handleTopStoresDataUpdate(message, callbacks) {
    try {
      const data = this.parseMessage(message);
      const messageId = data.id || this.generateMessageId();
      const messageWithId = { ...data, id: messageId };

      if (callbacks.onUpdate) {
        callbacks.onUpdate(messageWithId);
      }
      
      if (callbacks.onUnread) {
        callbacks.onUnread(messageId);
      }
    } catch (error) {
      console.error("Top Stores 업데이트 처리 오류:", error);
    }
  }

  // 서버 상태 핸들러
  handleServerStatus(message, callbacks) {
    try {
      if (callbacks.onServerStatus) {
        callbacks.onServerStatus(message.body);
      }
    } catch (error) {
      console.error("서버 상태 메시지 처리 오류:", error);
    }
  }
}

// 싱글톤 인스턴스
const webSocketHandlers = new WebSocketHandlers();

export default webSocketHandlers;