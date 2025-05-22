import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChartPanel from '../common/ui/ChartPanel';
import DataCard from '../common/ui/DataCard';
import LoadingState from '../common/ui/LoadingState';
import { generateChartData, calculateYAxisDomain, calculateStats, formatAxisValue, defaultTooltipStyle } from '../../utils/chart/chartUtils';

const SalesTotalChart = ({
  title,
  salesArr = [],
  timeSeriesData = [],
  onCardClick = () => {},
}) => {
  const chartData = generateChartData(timeSeriesData);
  const yAxisDomain = calculateYAxisDomain(chartData);
  const stats = calculateStats(chartData);
  const totalSales = salesArr.length > 0 ? salesArr[0]?.total_sales || 0 : 0;

  const renderChartContent = () => {
    if (chartData.length === 0) {
      return (
        <LoadingState 
          title="시간별 데이터 수집중"
          message="매출 업데이트를 기다리는 중입니다..."
          color="emerald"
          icon={
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
            </svg>
          }
        />
      );
    }

    return (
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }} isAnimationActive={false}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.5} />
          <XAxis 
            dataKey="time" 
            tick={{ fontSize: 10, fill: '#9CA3AF' }} 
            stroke="#6B7280"
            interval={0}
            angle={-45}
            textAnchor="end"
            height={50}
          />
          <YAxis 
            domain={yAxisDomain}
            tickFormatter={formatAxisValue}
            tick={{ fontSize: 10, fill: '#9CA3AF' }}
            stroke="#6B7280"
            width={40}
          />
          <Tooltip 
            {...defaultTooltipStyle}
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
            strokeWidth={2.5}
            dot={{ fill: '#10B981', r: 4, strokeWidth: 1, stroke: '#065F46' }}  
            activeDot={{ r: 6, fill: '#10B981', stroke: '#065F46', strokeWidth: 2 }}  
            connectNulls={false}
            isAnimationActive={false} // 애니메이션 비활성화
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  return (
    <ChartPanel 
      title={title}
      color="blue"
      rightComponent={
        chartData.length > 1 && (
          <div className="text-xs text-gray-500 font-mono">
            최신: ₩{chartData[chartData.length - 1]?.totalSales?.toLocaleString() || 0}
          </div>
        )
      }
    >
      <div className="mb-4">
        {salesArr.length > 0 ? (
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg transform transition-all duration-300">
            <div className="grid grid-cols-2 gap-3">
              <DataCard 
                label="현재 매출 총합" 
                value={totalSales} 
                color="blue" 
                prefix="₩" 
              />
              
              <DataCard 
                label="매장 수" 
                value={salesArr[0]?.store_count || 0} 
                color="indigo" 
              />

              {chartData.length > 1 && (
                <DataCard 
                  label="변화량" 
                  color={stats.change > 0 ? "green" : stats.change < 0 ? "red" : "gray"}
                >
                  {stats.change > 0 ? '↗' : stats.change < 0 ? '↘' : '→'} 
                  ₩{Math.abs(stats.change).toLocaleString()} 
                  <span className="text-sm">({stats.change > 0 ? '+' : ''}{stats.changePercent}%)</span>
                </DataCard>
              )}
            </div>
          </div>
        ) : (
          <LoadingState 
            title="매출 데이터 준비중"
            message="매출 정보를 기다리는 중입니다..."
            color="blue"
          />
        )}
      </div>

      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <div className="w-2 h-2 rounded-full mr-2 bg-emerald-500"></div>
            <h4 className="text-xs font-medium text-gray-400">시간별 매출 추이 (최근 {timeSeriesData.length}개)</h4>
          </div>
        </div>
        
        <div className="h-48">
          {renderChartContent()}
        </div>
      </div>
    </ChartPanel>
  );
};

export default SalesTotalChart;