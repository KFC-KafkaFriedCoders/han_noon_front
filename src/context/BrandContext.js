import React, { useState, useContext, createContext } from "react";

export const BrandContext = createContext({
  selectedBrand: null,
  setSelectedBrand: () => {},
});

export const BrandProvider = ({ children }) => {
  const [selectedBrand, setSelectedBrand] = useState(null);

  return (
    <BrandContext.Provider value={{ selectedBrand, setSelectedBrand }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrand = () => useContext(BrandContext);
