// UI 관련 상수
export const UI_COLORS = {
  PAYMENT_LIMIT: 'green',
  SAME_PERSON: 'orange',
  SALES_TOTAL: 'blue',
  TOP_STORES: 'purple',
  NON_RESPONSE: 'yellow',
};

// 상태 메시지
export const STATUS_MESSAGES = {
  LOADING: {
    PAYMENT_LIMIT: {
      title: '이상 결제 데이터 준비중',
      message: '이상 결제 탐지 정보를 기다리는 중입니다...'
    },
    SAME_PERSON: {
      title: '동일인 결제 데이터 준비중',
      message: '동일인 결제 탐지 정보를 기다리는 중입니다...'
    },
    SALES_TOTAL: {
      title: '매출 데이터 준비중',
      message: '매출 정보를 기다리는 중입니다...'
    },
    TOP_STORES: {
      title: 'TOP 매장 데이터 준비중',
      message: '매장 순위 정보를 기다리는 중입니다...'
    },
    NON_RESPONSE: {
      title: '비응답 매장 데이터 준비중',
      message: '비응답 매장 정보를 기다리는 중입니다...'
    }
  },
  ERROR: {
    CONNECTION: '서버 연결에 실패했습니다. 잠시 후 다시 시도해주세요.',
    DATA_FETCH: '데이터를 불러오는데 실패했습니다.',
    UNAUTHORIZED: '인증에 실패했습니다. 다시 로그인해주세요.'
  }
};