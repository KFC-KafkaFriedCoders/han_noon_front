import React, { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const WebSocketTest = () => {
  const [client, setClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [testBrand, setTestBrand] = useState('빽다방');

  useEffect(() => {
    // WebSocket 연결 테스트
    const stompClient = new Client({
      //webSocketFactory: () => new SockJS('http://localhost:8080/ws'),
      webSocketFactory: () => new SockJS('http://3.13.184.246:8080/ws'),
      debug: (str) => {
        console.log('STOMP DEBUG:', str);
        setMessages(prev => [...prev, `DEBUG: ${str}`]);
      },
      reconnectDelay: 5000,
    });

    stompClient.onConnect = (frame) => {
      console.log('✅ WebSocket 연결 성공!', frame);
      setConnected(true);
      setMessages(prev => [...prev, '✅ WebSocket 연결 성공!']);
    };

    stompClient.onDisconnect = () => {
      console.log('❌ WebSocket 연결 해제');
      setConnected(false);
      setMessages(prev => [...prev, '❌ WebSocket 연결 해제']);
    };

    stompClient.onStompError = (frame) => {
      console.error('💥 STOMP 오류:', frame);
      setMessages(prev => [...prev, `💥 STOMP 오류: ${frame.headers?.message || 'Unknown error'}`]);
    };

    setClient(stompClient);
    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, []);

  const testBrandSelection = () => {
    if (!client || !connected) {
      alert('WebSocket이 연결되지 않았습니다!');
      return;
    }

    console.log('📤 브랜드 선택 메시지 전송:', testBrand);
    setMessages(prev => [...prev, `📤 브랜드 선택 전송: ${testBrand}`]);

    try {
      client.publish({
        destination: '/app/select-brand',
        body: JSON.stringify({ brand: testBrand })
      });
      setMessages(prev => [...prev, `✅ 메시지 전송 완료: ${testBrand}`]);
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      setMessages(prev => [...prev, `❌ 메시지 전송 실패: ${error.message}`]);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <div className="bg-gray-800 text-white p-4 rounded">
      <h3 className="text-lg font-bold mb-4">WebSocket 연결 테스트</h3>
      
      <div className="mb-4">
        <p>연결 상태: <span className={connected ? 'text-green-400' : 'text-red-400'}>
          {connected ? '✅ 연결됨' : '❌ 연결 안됨'}
        </span></p>
      </div>

      <div className="mb-4">
        <label className="block mb-2">테스트 브랜드:</label>
        <select 
          value={testBrand} 
          onChange={(e) => setTestBrand(e.target.value)}
          className="bg-gray-700 text-white p-2 rounded"
        >
          <option value="빽다방">빽다방</option>
          <option value="한신포차">한신포차</option>
          <option value="돌배기집">돌배기집</option>
        </select>
      </div>

      <div className="mb-4">
        <button 
          onClick={testBrandSelection}
          disabled={!connected}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 px-4 py-2 rounded mr-2"
        >
          브랜드 선택 테스트
        </button>
        <button 
          onClick={clearMessages}
          className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          로그 지우기
        </button>
      </div>

      <div className="bg-gray-900 p-4 rounded max-h-60 overflow-y-auto">
        <h4 className="font-semibold mb-2">연결 로그:</h4>
        {messages.length === 0 ? (
          <p className="text-gray-400">로그가 없습니다.</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className="text-sm mb-1 font-mono">
              {msg}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WebSocketTest;