import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

/**
 * Portal 컴포넌트 - 모달을 body에 직접 렌더링하여 z-index 문제 해결
 */
const Portal = ({ children, containerId = 'modal-root' }) => {
  const [container, setContainer] = useState(null);

  useEffect(() => {
    // 기존 컨테이너를 찾거나 새로 생성
    let modalContainer = document.getElementById(containerId);
    
    if (!modalContainer) {
      modalContainer = document.createElement('div');
      modalContainer.id = containerId;
      modalContainer.style.position = 'relative';
      modalContainer.style.zIndex = '9999';
      document.body.appendChild(modalContainer);
    }
    
    setContainer(modalContainer);
    
    // 클린업 함수에서 컨테이너 제거 (마지막 Portal이 제거될 때만)
    return () => {
      // 다른 Portal이 사용 중이 아니라면 컨테이너 제거
      if (modalContainer && !modalContainer.hasChildNodes()) {
        document.body.removeChild(modalContainer);
      }
    };
  }, [containerId]);

  // 컨테이너가 준비되면 Portal로 렌더링
  return container ? createPortal(children, container) : null;
};

export default Portal;
