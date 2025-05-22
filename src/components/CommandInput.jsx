import React, { useState, useEffect, memo, useCallback } from "react";
import { useBrand } from "../context/BrandContext";
import { useTheme } from "../context/theme/ThemeContext";
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
  const { isDarkMode } = useTheme();
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
      <div className={`flex flex-col p-3 rounded-xl shadow-lg transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border border-gray-700' 
          : 'bg-white border border-gray-200'
      }`}>
        <div className="relative">
          <div 
            className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-700 hover:bg-gray-600' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={`font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              {inputSelectedBrand}
            </div>
            <IoIosArrowDown className={`transition-all duration-300 ${
              isDropdownOpen ? 'rotate-180' : ''
            } ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </div>

          {isDropdownOpen && (
            <div className={`absolute mt-1 w-full rounded-lg shadow-xl z-10 max-h-96 overflow-y-auto animate-fadeInUp border ${
              isDarkMode 
                ? 'bg-gray-700 border-gray-600' 
                : 'bg-white border-gray-200'
            }`}>
              <div className={`p-2 sticky top-0 border-b ${
                isDarkMode 
                  ? 'bg-gray-700 border-gray-600' 
                  : 'bg-white border-gray-200'
              }`}>
                <input
                  type="text"
                  placeholder="검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`w-full p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 text-white border border-gray-600' 
                      : 'bg-gray-50 text-gray-900 border border-gray-300'
                  }`}
                  autoFocus
                />
              </div>

              <div className="p-2">
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option, idx) => (
                    <div 
                      key={idx}
                      className={`p-2 rounded-lg cursor-pointer transition-colors duration-200 ${
                        inputSelectedBrand === option 
                          ? (isDarkMode ? 'bg-blue-800' : 'bg-blue-100')
                          : (isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-100')
                      }`}
                      onClick={() => handleBrandSelect(option)}
                    >
                      <div className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>
                        {option}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className={`p-4 text-center transition-colors duration-300 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    검색 결과가 없습니다.
                  </div>
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