import React, { useState, useEffect } from "react";
import { FaTerminal } from "react-icons/fa";
import { useBrand } from "../context/BrandContext";

const CommandInput = () => {
  const franchiseOptions = [
    "빽다방",
    "한신포차",
    "돌배기집",
    "롤링파스타",
    "리춘시장",
    "막이오름",
    "미정국수",
    "백스비어",
    "백철판0410",
    "본가",
    "빽보이피자",
    "새마을식당",
    "성성식당",
    "역전우동0410",
    "연돈볼카츠",
    "원조쌈밥집",
    "인생설렁탕",
    "제순식당",
    "홍콩반점0410",
    "홍콩분식",
    "고투웍",
    "대한국밥"
  ];

  const { selectedBrand, setSelectedBrand } = useBrand();

  // 초기값을 selectedBrand로 설정 (새로고침 시에도 동일한 값 유지)
  const [inputSelectedBrand, setInputSelectedBrand] = useState(selectedBrand);

  // selectedBrand가 변경될 때 inputSelectedBrand도 업데이트
  useEffect(() => {
    setInputSelectedBrand(selectedBrand);
  }, [selectedBrand]);

  const handleExecute = () => {
    console.log("Executing commands for:", inputSelectedBrand);
    setSelectedBrand(inputSelectedBrand);
    
    // WebSocket 전송은 PaymentLimitWebSocket의 useEffect에서 처리하도록 두어 중복 제거
  };

  return (
    <div className="my-4">
      <div className="flex items-center mb-2 bg-gray-900 rounded p-2 group">
        <div className="text-gray-400 mr-2">
          <FaTerminal />
        </div>
        <select
          value={inputSelectedBrand}
          onChange={(e) => setInputSelectedBrand(e.target.value)}
          className="flex-grow bg-transparent border-none focus:outline-none text-gray-300"
        >
          {franchiseOptions.map((option, idx) => (
            <option
              key={idx}
              value={option}
              style={{
                backgroundColor: "#1f2937",
                color: "white",
              }}
            >
              {option}
            </option>
          ))}
        </select>
        <button
          onClick={handleExecute}
          className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded font-medium"
        >
          Execute
        </button>
      </div>
    </div>
  );
};

export default CommandInput;
