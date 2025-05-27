import React from 'react';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { useTheme } from '../../context/theme/ThemeContext';
import ChartPanel from '../common/ui/ChartPanel';
import LoadingState from '../common/ui/LoadingState';

const SalesMinuteChart = ({
  title,
  salesMinuteArr = [],
  minuteTimeSeriesData = [],
  onCardClick = () => {},
}) => {
  const { isDarkMode } = useTheme();

  const chartData = minuteTimeSeriesData
    .slice()
    .reverse()
    .map((data, index) => ({
      time: data.displayTime,
      amount: data.totalSales || 0,
      index: index
    }));
  
  return (
    <ChartPanel 
      title={title}
      color="teal"
    >
      <div className="h-80 flex flex-col">
        {chartData.length > 0 && (
          <div className={`mb-4 p-3 rounded-lg transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800' : 'bg-gray-50'
          }`}>
            <div className={`text-sm mb-2 font-medium transition-colors duration-300 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              최근 5분 매출 추이
            </div>
            <ResponsiveContainer width="100%" height={80}>
              <LineChart data={chartData}>
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#14b8a6" 
                  strokeWidth={2}
                  dot={{ fill: '#14b8a6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: '#14b8a6' }}
                />
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: isDarkMode ? '#9ca3af' : '#6b7280' }}
                />
                <YAxis hide />
              </LineChart>
            </ResponsiveContainer>
            <div className={`text-xs mt-1 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              현재 매출: ₩{(chartData[chartData.length - 1]?.amount || 0).toLocaleString()} | 데이터 포인트: {chartData.length}개
            </div>
          </div>
        )}
        
        <div className="flex-1 overflow-y-auto custom-scrollbar p-1">
          {salesMinuteArr.length > 0 ? (
            <ul className="space-y-2">
              {salesMinuteArr.map((data, index) => {
                const messageText = `총 매출: ₩${(data.total_sales || 0).toLocaleString()} | 매장 수: ${data.store_count || 0}개 | Franchise ID: ${data.franchise_id || 'N/A'}`;
                
                return (
                  <li
                    key={data.id || index}
                    className={`relative p-3 rounded-lg text-sm transition-all duration-200 ${
                      isDarkMode 
                        ? 'bg-gray-800' 
                        : 'bg-white border border-gray-200'
                    }`}
                    onClick={() => onCardClick(data.id)}
                  >
                    <div className={`transition-colors duration-300 ${
                      isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                      <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {data.store_brand || ''}
                        </span>
                        <span className={`text-xs transition-colors duration-300 ${
                          isDarkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                          {data.time || new Date().toLocaleTimeString()}
                        </span>
                      </div>
                      <div className={`p-2 rounded-md mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {messageText}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <LoadingState 
              title="1분당 매출 데이터 준비중"
              message="1분당 매출 정보를 기다리는 중입니다..."
              color="teal"
              icon={
                <svg className="w-8 h-8 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
              }
            />
          )}
        </div>
      </div>
    </ChartPanel>
  );
};

export default SalesMinuteChart;