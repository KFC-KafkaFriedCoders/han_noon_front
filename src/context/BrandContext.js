import React, { useState, useContext, createContext, useEffect } from "react";

export const BrandContext = createContext({
  selectedBrand: null,
  setSelectedBrand: () => {},
});

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(() => {
    const savedBrand = localStorage.getItem('selectedBrand');
    return savedBrand || '빽다방';
  });

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
