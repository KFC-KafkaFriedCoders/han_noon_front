import React, { useState, useEffect, memo, useCallback } from "react";
import { useBrand } from "../context/BrandContext";
import { IoIosArrowDown } from "react-icons/io";

// 옵션 배열 - 그룹화 없이 정렬만 해서 사용
const franchiseOptions = [
  "빽다방",
  "한신포차",
  "돌배기집",
  "본가",
  "새마을식당",
  "성성식당",
  "연돈볼카츠",
  "원조쌈밥집",
  "인생설렁탕",
  "제순식당",
  "대한국밥",
  "리춘시장",
  "홍콩반점0410",
  "홍콩분식",
  "고투웍",
  "막이오름",
  "미정국수0410",
  "역전우동0410",
  "백스비어",
  "백철판0410",
  "빽보이피자",
  "롤링파스타",
].sort();

const CommandInput = () => {
  const { selectedBrand, setSelectedBrand } = useBrand();
  const [inputSelectedBrand, setInputSelectedBrand] = useState(selectedBrand);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // selectedBrand가 변경될 때 inputSelectedBrand도 업데이트
  useEffect(() => {
    setInputSelectedBrand(selectedBrand);
  }, [selectedBrand]);

  // 브랜드 변경 함수
  const handleBrandSelect = useCallback((brand) => {
    setInputSelectedBrand(brand);
    setSelectedBrand(brand); // 바로 적용
    setIsDropdownOpen(false);
    setSearchTerm('');
  }, [setSelectedBrand]);

  // 검색 화면에서 이스케이프 키 입력 처리
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
  }, []);

  // 검색어 필터링된 메뉴 아이템
  const filteredOptions = searchTerm.trim() 
    ? franchiseOptions.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase()))
    : franchiseOptions;

  return (
    <div className="my-4">
      <div className="flex flex-col bg-gray-800 rounded-xl p-3 shadow-lg">
        <div className="relative">
          <div 
            className="flex items-center justify-between bg-gray-700 p-3 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className="text-white font-medium">{inputSelectedBrand}</div>
            <IoIosArrowDown className={`text-gray-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>

          {isDropdownOpen && (
            <div className="absolute mt-1 w-full bg-gray-700 rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto animate-fadeInUp">
              <div className="p-2 sticky top-0 bg-gray-700 border-b border-gray-600">
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full p-2 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
              </div>

              <div className="p-2">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors ${inputSelectedBrand === option ? 'bg-blue-800' : ''}`}
                      onClick={() => handleBrandSelect(option)}
                    >
                      <div className="text-white">{option}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-gray-400 text-center">검색 결과가 없습니다.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(CommandInput);