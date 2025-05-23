import { useState, useEffect } from 'react';
import webSocketService from '../../services/websocket';

export const useWebSocketConnection = (selectedBrand, callbacks) => {
  const [connected, setConnected] = useState(false);
  
  useEffect(() => {
    webSocketService.onConnect((frame) => {
      console.log("WebSocket 연결 성공:", frame);
      setConnected(true);
      
      webSocketService.initializeSubscriptions(callbacks);
      
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

    webSocketService.connect();

    return () => {
      webSocketService.unsubscribeAll();
      webSocketService.disconnect();
    };
  }, [callbacks, selectedBrand]);

  useEffect(() => {
    if (webSocketService.isConnected() && selectedBrand) {
      webSocketService.selectBrand(selectedBrand);
      console.log("브랜드 변경 전송:", selectedBrand);
    }
  }, [selectedBrand]);
  
  return { connected };
};