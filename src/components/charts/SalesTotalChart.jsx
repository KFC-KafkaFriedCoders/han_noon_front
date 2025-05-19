import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesTotalChart = ({
  title,
  salesArr = [],
  timeSeriesData = [], // 새로 추가된 시간순 데이터
  onCardClick = () => {},
}) => {
  // 차트 데이터 생성 함수 (시간순 데이터를 차트 형태로 변환)
  const generateChartData = (timeSeries) => {
    if (!timeSeries || timeSeries.length === 0) return [];

    // 시간 역순으로 정렬 (오래된 것부터)
    const sortedData = [...timeSeries].reverse();

    return sortedData.map((item, index) => ({
      time: item.displayTime,
      totalSales: item.totalSales,
      fullTime: new Date(item.time).toLocaleString('ko-KR'),
      index: index
    }));
  };

  // Y축 도메인 계산 함수 (평균값 기준 ±50만원 범위로 고정)
  const calculateYAxisDomain = (data) => {
    if (!data || data.length === 0) return [0, 'auto'];
    
    const values = data.map(item => item.totalSales);
    const minValue = Math.min(...values);
    const maxValue = Math.max(...values);
    
    // 데이터가 모두 같은 값일 때
    if (minValue === maxValue) {
      const baseValue = minValue || 1000000;
      // ±50만원 범위로 고정
      const range = 500000; // 50만원
      return [baseValue - range, baseValue + range];
    }
    
    // 평균값 계산
    const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
    
    // 평균값을 중심으로 ±50만원 범위로 고정
    const range = 500000; // 50만원
    const adjustedMin = avgValue - range;
    const adjustedMax = avgValue + range;
    
    return [adjustedMin, adjustedMax];
  };

  const chartData = generateChartData(timeSeriesData);
  const yAxisDomain = calculateYAxisDomain(chartData);

  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 bg-green-500`}></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
        {timeSeriesData.length > 0 && (
          <div className="text-xs text-gray-400">
            데이터 포인트: {timeSeriesData.length}/7
          </div>
        )}
      </div>

      {/* 상단: 기존 매출 데이터 리스트 */}
      <div className="h-40 overflow-y-auto mb-4">
        {salesArr.length > 0 ? (
          <ul className="space-y-2">
            {salesArr.map((msg, index) => {
              return (
                <li
                  key={msg.id || index}
                  className="bg-gray-800 text-gray-200 p-3 rounded text-sm cursor-pointer hover:bg-gray-700 transition-colors"
                  onClick={() => onCardClick(msg.id)}
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-blue-300">
                        {msg.store_brand || '브랜드 정보 없음'}
                      </span>
                      <span className="text-xs text-gray-400">
                        매장 {msg.store_count || 0}개
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300">총 매출:</span>
                      <span className="text-green-400 font-mono">
                        ₩{(msg.total_sales || 0).toLocaleString()}
                      </span>
                    </div>
                    
                    {msg.franchise_id && (
                      <div className="text-xs text-gray-500">
                        가맹점 ID: {msg.franchise_id}
                      </div>
                    )}
                    
                    {(msg.update_time || msg.server_received_time) && (
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(msg.update_time || msg.server_received_time).toLocaleString()}
                      </div>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full py-4">
            <div className="bg-gray-700 p-4 rounded-lg text-center max-w-sm">
              <div className="mb-3">
                <div className="w-12 h-12 mx-auto bg-blue-500 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                  </svg>
                </div>
              </div>
              <h3 className="text-white font-semibold mb-1">매출 데이터 준비중</h3>
              <p className="text-gray-400 text-xs">
                매출 정보를 기다리는 중입니다...
              </p>
              <div className="mt-3">
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-200"></div>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse-delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 하단: 시간에 따른 매출 변화 차트 */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-emerald-500"></div>
            <h4 className="text-xs font-medium text-gray-400">시간별 매출 추이 (최근 7개) - 범위: ±50만원</h4>
          </div>
          {chartData.length > 1 && (
            <div className="text-xs text-gray-500">
              {chartData.length > 0 && (
                <>
                  최신: ₩{chartData[chartData.length - 1]?.totalSales?.toLocaleString() || 0}
                </>
              )}
            </div>
          )}
        </div>
        
        <div className="h-40">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 11, fill: '#9CA3AF' }} 
                  stroke="#6B7280"
                  interval={0}  // 모든 라벨 표시
                  angle={-45}   // 라벨 각도 조정
                  textAnchor="end"
                  height={60}   // X축 높이 확보
                />
                <YAxis 
                  domain={yAxisDomain}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `₩${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `₩${(value / 1000).toFixed(0)}K`;
                    } else {
                      return `₩${value}`;
                    }
                  }}
                  tick={{ fontSize: 11, fill: '#9CA3AF' }}
                  stroke="#6B7280"
                  width={60}    // Y축 너비 확보
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    color: '#F3F4F6',
                    fontSize: '12px',
                    border: '1px solid #374151',
                    borderRadius: '6px'
                  }}
                  itemStyle={{ color: '#10B981' }}
                  labelStyle={{ color: '#D1D5DB' }}
                  formatter={(value, name) => [
                    `₩${value.toLocaleString()}`,
                    '총 매출'
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `시간: ${payload[0].payload.fullTime}`;
                    }
                    return `시간: ${label}`;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#10B981" 
                  strokeWidth={3}        // 선 굵기 증가
                  dot={{ fill: '#10B981', r: 5, strokeWidth: 2, stroke: '#065F46' }}  // 점 크기 증가
                  activeDot={{ r: 7, fill: '#10B981', stroke: '#065F46', strokeWidth: 2 }}  // 활성 점 크기 증가
                  connectNulls={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-gray-600 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1">시간별 데이터 수집중</h4>
                <p className="text-xs text-gray-500 mb-2">
                  매출 업데이트를 기다리는 중입니다 (최근 7개 추적)
                </p>
                <div className="flex space-x-1 justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-delay-200"></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse-delay-400"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 차트 정보 및 변화량 표시 */}
        {chartData.length > 0 && (
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <div>시작: {chartData[0]?.time}</div>
              <div>종료: {chartData[chartData.length - 1]?.time}</div>
            </div>
            {chartData.length > 1 && (
              <div className="flex justify-between">
                <div>
                  평균: ₩{Math.round(chartData.reduce((sum, d) => sum + d.totalSales, 0) / chartData.length).toLocaleString()}
                  (범위: ±₩500,000)
                </div>
                <div className="text-right">
                  {(() => {
                    const firstValue = chartData[0]?.totalSales || 0;
                    const lastValue = chartData[chartData.length - 1]?.totalSales || 0;
                    const change = lastValue - firstValue;
                    const changePercent = firstValue !== 0 ? ((change / firstValue) * 100).toFixed(1) : 0;
                    
                    if (change > 0) {
                      return <span className="text-green-400">↗ +₩{change.toLocaleString()} (+{changePercent}%)</span>;
                    } else if (change < 0) {
                      return <span className="text-red-400">↘ ₩{change.toLocaleString()} ({changePercent}%)</span>;
                    } else {
                      return <span className="text-gray-400">→ 변화 없음</span>;
                    }
                  })()}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesTotalChart;