import React, { useState } from "react";
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

  const [inputSelectedBrand, setInputSelectedBrand] = useState("빽다방");
  const { setSelectedBrand } = useBrand();

  const handleExecute = () => {
    console.log("Executing commands for:", inputSelectedBrand);
    setSelectedBrand(inputSelectedBrand);
    
    // 브랜드 선택이 변경되었음을 알림
    // 여기서 WebSocket을 통해 서버에 브랜드 선택을 전송할 수 있음
    if (window.stompClient && window.stompClient.connected) {
      window.stompClient.publish({
        destination: '/app/select-brand',
        body: JSON.stringify({ brand: inputSelectedBrand })
      });
    }
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
