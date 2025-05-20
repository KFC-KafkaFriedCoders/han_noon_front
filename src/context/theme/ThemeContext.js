import React, { createContext, useContext, useState, useEffect } from 'react';

// 테마 컨텍스트 생성
const ThemeContext = createContext();

// 로컬 스토리지 키
const THEME_STORAGE_KEY = 'kfc-theme-mode';

// 테마 프로바이더 컴포넌트
export const ThemeProvider = ({ children }) => {
  // 로컬 스토리지에서 테마 상태 가져오기, 기본값은 'dark'
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return savedTheme ? savedTheme === 'dark' : true; // 기본값은 다크 모드
  });

  // 테마 변경 함수
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // 테마 변경시 로컬 스토리지 업데이트 및 HTML 클래스 변경
  useEffect(() => {
    // 로컬 스토리지에 저장
    localStorage.setItem(THEME_STORAGE_KEY, isDarkMode ? 'dark' : 'light');
    
    // HTML element에 dark 클래스 토글
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // 컨텍스트 값
  const value = {
    isDarkMode,
    toggleDarkMode
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 사용하기 쉬운 훅 생성
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
