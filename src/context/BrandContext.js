import React, { useState, useContext, createContext } from "react";

// 브랜드 선택 컨텍스트 생성
export const BrandContext = createContext({
  selectedBrand: null,
  setSelectedBrand: () => {},
});

// 컨텍스트 제공자 컴포넌트
export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

// 브랜드 선택 훅
export const useBrand = () => useContext(BrandContext);
