import React from 'react';
import { useTheme } from '../../../context/theme/ThemeContext';
import ReportSuccessModal from './ReportSuccessModal';
import ReportErrorModal from './ReportErrorModal';

const ReportResultModal = ({ isOpen, onClose, reportData, isError }) => {
  const { isDarkMode } = useTheme();

  const handleBackToGenerate = () => {
    onClose(); // 결과 모달 닫고 생성 모달로 돌아가기
  };

  const handleRetry = () => {
    // 재시도 로직 - 필요시 구현
    console.log('재시도 요청');
    handleBackToGenerate();
  };

  if (!isOpen || !reportData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      {isError ? (
        <ReportErrorModal
          isDarkMode={isDarkMode}
          reportData={reportData}
          onClose={() => onClose()}
          onBackToGenerate={handleBackToGenerate}
          onRetry={handleRetry}
        />
      ) : (
        <ReportSuccessModal
          isDarkMode={isDarkMode}
          reportData={reportData}
          onClose={() => onClose()}
          onBackToGenerate={handleBackToGenerate}
        />
      )}
    </div>
  );
};

export default ReportResultModal;
