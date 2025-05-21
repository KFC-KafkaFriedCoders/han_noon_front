import connectionService from './connectionService';
import messageService from './messageService';
import subscriptionService from './subscriptionService';

// 통합 WebSocket 서비스
const webSocketService = {
  // 연결 관련
  connect: (url) => connectionService.connect(url),
  disconnect: () => connectionService.disconnect(),
  isConnected: () => connectionService.isConnected(),
  
  // 이벤트 리스너
  onConnect: (callback) => connectionService.onConnect(callback),
  onDisconnect: (callback) => connectionService.onDisconnect(callback),
  onError: (callback) => connectionService.onError(callback),
  
  // 메시지 관련
  publish: (destination, message) => messageService.publish(destination, message),
  selectBrand: (brand) => messageService.selectBrand(brand),
  getLastBrandSelection: () => messageService.getLastBrandSelection(),
  
  // 구독 관련
  subscribe: (topic, callback, id) => subscriptionService.subscribe(topic, callback, id),
  unsubscribe: (id) => subscriptionService.unsubscribe(id),
  unsubscribeAll: () => subscriptionService.unsubscribeAll(),
  
  // 구독 초기화
  initializeSubscriptions: (callbacks) => {
    subscriptionService.setCallbacks(callbacks);
    subscriptionService.initializeSubscriptions();
    messageService.resendLastBrandSelection();
  }
};

export default webSocketService;