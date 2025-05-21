import connectionService from './connectionService';
import { MESSAGE_ID_PREFIX } from '../../utils/constants';

class MessageService {
  constructor() {
    this.lastBrandSelection = null;
  }

  // 메시지 발행
  publish(destination, message) {
    const client = connectionService.getClient();
    if (client && connectionService.isConnected()) {
      client.publish({
        destination,
        body: JSON.stringify(message)
      });
      return true;
    } else {
      console.warn("WebSocket이 연결되지 않음");
      return false;
    }
  }

  // 메시지 ID 생성 (중복 방지)
  generateMessageId(prefix = MESSAGE_ID_PREFIX.NEW) {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // 메시지에 ID 추가
  addIdToMessage(message) {
    if (!message.id) {
      return {
        ...message,
        id: this.generateMessageId()
      };
    }
    return message;
  }

  // 브랜드 선택 메시지 전송
  selectBrand(brand) {
    this.lastBrandSelection = brand;
    this.publish('/app/select-brand', { brand });
    console.log(`브랜드 선택 전송: ${brand}`);
    return true;
  }

  // 마지막 선택 브랜드 다시 전송
  resendLastBrandSelection() {
    if (this.lastBrandSelection) {
      return this.selectBrand(this.lastBrandSelection);
    }
    return false;
  }

  // 마지막 선택 브랜드 가져오기
  getLastBrandSelection() {
    return this.lastBrandSelection;
  }
}

// 싱글톤 인스턴스
const messageService = new MessageService();

export default messageService;