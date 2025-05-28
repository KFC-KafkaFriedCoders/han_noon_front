import axios from 'axios';

// 백엔드 API 기본 URL (포트 8081)
const API_BASE_URL = 'http://3.13.184.246:8081/api/reports';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000, // 60초 타임아웃 (리포트 생성이 오래 걸릴 수 있음)
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청/응답 인터셉터 추가 (디버깅용)
apiClient.interceptors.request.use(
  (config) => {
    console.log('🚀 API 요청:', config.method?.toUpperCase(), config.url, config.params);
    return config;
  },
  (error) => {
    console.error('❌ 요청 에러:', error);
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API 응답:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ 응답 에러:', error.response?.status, error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// 리포트 서비스
export const reportService = {
  /**
   * AI 리포트 생성 요청
   * @param {number} count - 분석할 데이터 건수 (20, 50, 100, 250, 500)
   * @param {string} brand - 분석할 브랜드 (전체 또는 실제 브랜드명)
   * @returns {Promise<Object>} 리포트 응답 데이터
   */
  async generateReport(count, brand = '전체') {
    try {
      console.log(`📊 리포트 생성 요청: ${count}건, 브랜드: ${brand}`);
      
      const response = await apiClient.get('/generate', {
        params: { count, brand }
      });
      
      console.log('📋 리포트 생성 성공:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('💥 리포트 생성 실패:', error);
      throw this.handleApiError(error);
    }
  },

  /**
   * 데이터 상태 조회
   * @returns {Promise<Object>} 데이터 상태 정보
   */
  async getStatus() {
    try {
      console.log('📊 데이터 상태 조회 요청');
      
      const response = await apiClient.get('/status');
      
      console.log('📋 상태 조회 성공:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('💥 상태 조회 실패:', error);
      throw this.handleApiError(error);
    }
  },

  /**
   * 헬스 체크
   * @returns {Promise<Object>} 서버 상태 정보
   */
  async healthCheck() {
    try {
      console.log('💗 헬스 체크 요청');
      
      const response = await apiClient.get('/health');
      
      console.log('💚 헬스 체크 성공:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('💥 헬스 체크 실패:', error);
      throw this.handleApiError(error);
    }
  },

  /**
   * API 오류 처리
   * @param {Error} error - API 오류 객체
   * @returns {Error} 처리된 오류 객체
   */
  handleApiError(error) {
    if (error.response) {
      // 서버에서 응답을 받았지만 에러 상태코드
      const { status, data } = error.response;
      
      let errorMessage = data?.message || `서버 오류가 발생했습니다. (${status})`;
      
      // 특정 에러 상황별 메시지 처리
      if (status === 400) {
        errorMessage = data?.message || '잘못된 요청입니다.';
      } else if (status === 500) {
        errorMessage = data?.message || '서버 내부 오류가 발생했습니다.';
      }
      
      return new Error(errorMessage);
      
    } else if (error.request) {
      // 요청을 보냈지만 응답을 받지 못함
      return new Error('서버에 연결할 수 없습니다. 백엔드 서버(http://localhost:8081)가 실행 중인지 확인해주세요.');
      
    } else {
      // 요청 설정 중 오류
      return new Error(`요청 처리 중 오류가 발생했습니다: ${error.message}`);
    }
  }
};

export default reportService;
