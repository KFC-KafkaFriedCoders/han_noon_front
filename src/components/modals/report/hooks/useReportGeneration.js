import { useState } from 'react';
import { FRANCHISE_BRANDS } from '../../../../utils/constants/franchiseData';

// 리포트 건수 옵션
export const REPORT_COUNT_OPTIONS = [
  { value: 20, label: '20건' },
  { value: 50, label: '50건' },
  { value: 100, label: '100건' },
  { value: 250, label: '250건' },
  { value: 500, label: '500건' }
];

// 리포트 브랜드 옵션 (전체 + 실제 브랜드들)
export const REPORT_BRAND_OPTIONS = [
  { value: '전체', label: '전체 프랜차이즈' },
  ...FRANCHISE_BRANDS.map(brand => ({
    value: brand,
    label: brand
  }))
];

/**
 * 리포트 생성 관리 커스텀 훅
 */
export const useReportGeneration = () => {
  const [selectedCount, setSelectedCount] = useState(20);
  const [selectedBrand, setSelectedBrand] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);

  // 리포트 생성 처리
  const handleSubmit = async (onSubmit) => {
    setIsLoading(true);
    try {
      await onSubmit(selectedCount, selectedBrand);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    selectedCount,
    setSelectedCount,
    selectedBrand,
    setSelectedBrand,
    isLoading,
    handleSubmit
  };
};
