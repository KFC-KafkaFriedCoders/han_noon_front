import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalesTotalChart = ({
  title,
  salesArr = [],
  timeSeriesData = [], // 시간순 데이터
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

  // 데이터 계산 - 평균, 변화량, 변화율
  const calculateStats = () => {
    if (chartData.length < 2) return { avg: 0, change: 0, changePercent: 0 };
    
    const avg = Math.round(chartData.reduce((sum, d) => sum + d.totalSales, 0) / chartData.length);
    const firstValue = chartData[0]?.totalSales || 0;
    const lastValue = chartData[chartData.length - 1]?.totalSales || 0;
    const change = lastValue - firstValue;
    const changePercent = firstValue !== 0 ? ((change / firstValue) * 100).toFixed(1) : 0;
    
    return { avg, change, changePercent };
  };

  const stats = calculateStats();
  const totalSales = salesArr.length > 0 ? salesArr[0]?.total_sales || 0 : 0;

  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full mr-2 bg-blue-500"></div>
          <h3 className="text-sm font-medium text-gray-300">{title}</h3>
        </div>
      </div>

      {/* 상단: 매출 현황 카드 */}
      <div className="mb-4">
        {salesArr.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg transform transition-all duration-300">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">현재 매출 총합</div>
                <div className="text-xl font-bold text-blue-400 font-mono">₩{totalSales.toLocaleString()}</div>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-1">매장 수</div>
                <div className="text-xl font-bold text-indigo-400 font-mono">{(salesArr[0]?.store_count || 0).toLocaleString()}</div>
              </div>

              {chartData.length > 1 && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">평균 매출</div>
                  <div className="text-xl font-bold text-emerald-400 font-mono">₩{stats.avg.toLocaleString()}</div>
                </div>
              )}

              {chartData.length > 1 && (
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="text-xs text-gray-400 mb-1">변화량</div>
                  <div className={`text-xl font-bold font-mono ${stats.change > 0 ? 'text-green-400' : stats.change < 0 ? 'text-red-400' : 'text-gray-400'}`}>
                    {stats.change > 0 ? '↗' : stats.change < 0 ? '↘' : '→'} 
                    ₩{Math.abs(stats.change).toLocaleString()} 
                    <span className="text-sm">({stats.change > 0 ? '+' : ''}{stats.changePercent}%)</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="text-xs text-gray-400 mt-2 text-right">
              마지막 업데이트: {new Date(salesArr[0]?.update_time || salesArr[0]?.server_received_time).toLocaleString()}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 bg-gray-800 rounded-lg">
            <div className="bg-blue-900/30 p-3 rounded-full mb-3">
              <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4"></path>
              </svg>
            </div>
            <h3 className="text-white font-semibold mb-1">매출 데이터 준비중</h3>
            <p className="text-gray-400 text-xs mb-3">
              매출 정보를 기다리는 중입니다...
            </p>
            <div className="flex space-x-2 justify-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* 하단: 시간에 따른 매출 변화 차트 */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-emerald-500"></div>
            <h4 className="text-xs font-medium text-gray-400">시간별 매출 추이 (최근 {timeSeriesData.length}개)</h4>
          </div>
          {chartData.length > 1 && (
            <div className="text-xs text-gray-500 font-mono">
              최신: ₩{chartData[chartData.length - 1]?.totalSales?.toLocaleString() || 0}
            </div>
          )}
        </div>
        
        <div className="h-48">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
                <XAxis 
                  dataKey="time" 
                  tick={{ fontSize: 10, fill: '#9CA3AF' }} 
                  stroke="#6B7280"
                  interval={0}  // 모든 라벨 표시
                  angle={-45}   // 라벨 각도 조정
                  textAnchor="end"
                  height={50}   // X축 높이 확보
                />
                <YAxis 
                  domain={yAxisDomain}
                  tickFormatter={(value) => {
                    if (value >= 1000000) {
                      return `${(value / 1000000).toFixed(1)}M`;
                    } else if (value >= 1000) {
                      return `${(value / 1000).toFixed(0)}K`;
                    } else {
                      return `${value}`;
                    }
                  }}
                  tick={{ fontSize: 10, fill: '#9CA3AF' }}
                  stroke="#6B7280"
                  width={40}    // Y축 너비 확보
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    borderColor: '#374151', 
                    color: '#F3F4F6',
                    fontSize: '12px',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    padding: '8px'
                  }}
                  itemStyle={{ color: '#10B981' }}
                  labelStyle={{ color: '#D1D5DB', marginBottom: '3px' }}
                  formatter={(value, name) => [
                    `₩${value.toLocaleString()}`,
                    '총 매출'
                  ]}
                  labelFormatter={(label, payload) => {
                    if (payload && payload[0]) {
                      return `${payload[0].payload.fullTime}`;
                    }
                    return `${label}`;
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalSales" 
                  stroke="#10B981" 
                  strokeWidth={2.5}        // 선 굵기 조정
                  dot={{ fill: '#10B981', r: 4, strokeWidth: 1, stroke: '#065F46' }}  
                  activeDot={{ r: 6, fill: '#10B981', stroke: '#065F46', strokeWidth: 2 }}  
                  connectNulls={false}
                  animationDuration={1000} // 애니메이션 도입
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-3 bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
                <h4 className="text-white font-medium mb-1">시간별 데이터 수집중</h4>
                <p className="text-xs text-gray-400 mb-3">
                  매출 업데이트를 기다리는 중입니다...
                </p>
                <div className="flex space-x-2 justify-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalesTotalChart;