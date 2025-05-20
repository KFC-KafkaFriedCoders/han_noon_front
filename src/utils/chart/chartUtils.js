export const generateChartData = (timeSeries) => {
  if (!timeSeries || timeSeries.length === 0) return [];

  const sortedData = [...timeSeries].reverse();

  return sortedData.map((item, index) => ({
    time: item.displayTime,
    totalSales: item.totalSales,
    fullTime: new Date(item.time).toLocaleString('ko-KR'),
    index: index
  }));
};

export const calculateYAxisDomain = (data, valueKey = 'totalSales', range = 500000) => {
  if (!data || data.length === 0) return [0, 'auto'];
  
  const values = data.map(item => item[valueKey]);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  
  if (minValue === maxValue) {
    const baseValue = minValue || 1000000;
    return [baseValue - range, baseValue + range];
  }
  
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  
  const adjustedMin = avgValue - range;
  const adjustedMax = avgValue + range;
  
  return [adjustedMin, adjustedMax];
};

export const calculateStats = (chartData, valueKey = 'totalSales') => {
  if (!chartData || chartData.length < 2) return { avg: 0, change: 0, changePercent: 0 };
  
  const values = chartData.map(item => item[valueKey]);
  const avg = Math.round(values.reduce((sum, val) => sum + val, 0) / values.length);
  const firstValue = chartData[0]?.[valueKey] || 0;
  const lastValue = chartData[chartData.length - 1]?.[valueKey] || 0;
  const change = lastValue - firstValue;
  const changePercent = firstValue !== 0 ? ((change / firstValue) * 100).toFixed(1) : 0;
  
  return { avg, change, changePercent };
};

export const formatAxisValue = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}K`;
  } else {
    return `${value}`;
  }
};

export const defaultTooltipStyle = {
  contentStyle: { 
    backgroundColor: '#1F2937', 
    borderColor: '#374151', 
    color: '#F3F4F6',
    fontSize: '12px',
    border: '1px solid #374151',
    borderRadius: '6px',
    padding: '8px'
  },
  itemStyle: { color: '#10B981' },
  labelStyle: { color: '#D1D5DB', marginBottom: '3px' }
};