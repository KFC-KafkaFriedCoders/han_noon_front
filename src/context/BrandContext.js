import React, { useState, useContext, createContext, useEffect } from "react";

export const BrandContext = createContext({
  selectedBrand: null,
  setSelectedBrand: () => {},
});

export const BrandProvider = ({ children }) => {
  // localStorage에서 기존 브랜드 선택 불러오기, 없으면 기본값 "빽다방"
  const [selectedBrand, setSelectedBrand] = useState(() => {
    const savedBrand = localStorage.getItem('selectedBrand');
    return savedBrand || '빽다방';
  });

  // selectedBrand가 변경될 때마다 localStorage에 저장
  useEffect(() => {
    localStorage.setItem('selectedBrand', selectedBrand);
  }, [selectedBrand]);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
