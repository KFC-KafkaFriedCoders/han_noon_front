import React, { useState, useEffect, memo, useCallback, useMemo } from "react";
import { FaTerminal } from "react-icons/fa";
import { useBrand } from "../context/BrandContext";

// 옵션 배열을 컴포넌트 외부로 이동하여 리렌더링에 영향을 받지 않도록 함
const franchiseOptions = [
  "빽다방",
  "한신포차",
  "돌배기집",
  "롤링파스타",
  "리춘시장",
  "막이오름",
  "미정국수0410",
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

// 옵션 스타일을 상수로 정의
const optionStyle = {
  backgroundColor: "#1f2937",
  color: "white"
};

// 메모이제이션된 옵션 컴포넌트
const BrandOptions = memo(({ options }) => {
  return options.map((option, idx) => (
    <option
      key={idx}
      value={option}
      style={optionStyle}
    >
      {option}
    </option>
  ));
});

const CommandInput = () => {
  const { selectedBrand, setSelectedBrand } = useBrand();

  // 초기값을 selectedBrand로 설정 (새로고침 시에도 동일한 값 유지)
  const [inputSelectedBrand, setInputSelectedBrand] = useState(selectedBrand);

  // selectedBrand가 변경될 때 inputSelectedBrand도 업데이트
  useEffect(() => {
    setInputSelectedBrand(selectedBrand);
  }, [selectedBrand]);

  // 실행 핸들러 메모이제이션
  const handleExecute = useCallback(() => {
    console.log("Executing commands for:", inputSelectedBrand);
    setSelectedBrand(inputSelectedBrand);
  }, [inputSelectedBrand, setSelectedBrand]);

  // onChange 핸들러 메모이제이션
  const handleChange = useCallback((e) => {
    setInputSelectedBrand(e.target.value);
  }, []);

  return (
    <div className="my-4">
      <div className="flex items-center mb-2 bg-gray-900 rounded p-2 group">
        <div className="text-gray-400 mr-2">
          <FaTerminal />
        </div>
        <select
          value={inputSelectedBrand}
          onChange={handleChange}
          className="flex-grow bg-transparent border-none focus:outline-none text-gray-300"
        >
          <BrandOptions options={franchiseOptions} />
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

export default memo(CommandInput);