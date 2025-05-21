import { useState, useEffect } from 'react';
import webSocketService from '../../services/websocket';

export const useWebSocketConnection = (selectedBrand, callbacks) => {
  const [connected, setConnected] = useState(false);
  
  // WebSocket 연결 및 초기화
  useEffect(() => {
    // 연결 이벤트 핸들러 설정
    webSocketService.onConnect((frame) => {
      console.log("WebSocket 연결 성공:", frame);
      setConnected(true);
      
      // 구독 초기화
      webSocketService.initializeSubscriptions(callbacks);
      
      // 초기 브랜드 선택 전송
      if (selectedBrand) {
        webSocketService.selectBrand(selectedBrand);
        console.log("초기 브랜드 전송:", selectedBrand);
      }
    });

    webSocketService.onDisconnect(() => {
      setConnected(false);
      webSocketService.unsubscribeAll();
    });

    webSocketService.onError((frame) => {
      setConnected(false);
    });

    // WebSocket 연결
    webSocketService.connect();

    // 클린업
    return () => {
      webSocketService.unsubscribeAll();
      webSocketService.disconnect();
    };
  }, [callbacks, selectedBrand]);

  // 브랜드 변경 시 WebSocket에 전송
  useEffect(() => {
    if (webSocketService.isConnected() && selectedBrand) {
      webSocketService.selectBrand(selectedBrand);
      console.log("브랜드 변경 전송:", selectedBrand);
    }
  }, [selectedBrand]);
  
  return { connected };
};