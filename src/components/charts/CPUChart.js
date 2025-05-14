import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// 샘플 데이터 생성 함수
const generateData = (baseValue, variance, length = 30) => {
  const data = [];
  let lastValue = baseValue;
  
  for (let i = 0; i < length; i++) {
    // 이전 값에서 변동을 주어 자연스러운 그래프 생성
    lastValue = Math.max(5, Math.min(95, lastValue + (Math.random() - 0.5) * variance));
    data.push({
      time: `11:${String(Math.floor(i * 2) + 10).padStart(2, '0')}`,
      value: lastValue,
      value2: Math.max(5, Math.min(95, baseValue - 10 + (Math.random() - 0.5) * variance)),
      value3: Math.max(5, Math.min(95, baseValue - 20 + (Math.random() - 0.5) * variance)),
    });
  }
  
  return data;
};

const CPUChart = ({ title, multiLine = false, namespace = false }) => {
  // 샘플 데이터 생성
  const baseValue = title.includes('Master') ? 50 : title.includes('Compute') ? 20 : 40;
  const variance = title.includes('Master') ? 30 : 15;
  const data = generateData(baseValue, variance);
  
  // 색상 설정
  const getLineColors = () => {
    if (namespace) {
      return ['#8884d8', '#82ca9d', '#ffc658', '#ff8042'];
    }
    return ['#8884d8'];
  };
  
  return (
    <div className="bg-gray-900 p-3 rounded-lg">
      <div className="flex items-center mb-2">
        <div className={`w-3 h-3 rounded-full mr-2 ${title.includes('CPU') ? 'bg-green-500' : 'bg-blue-500'}`}></div>
        <h3 className="text-sm font-medium text-gray-300">{title}</h3>
      </div>
      
      <div className="h-40">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 10, fill: '#aaa' }} 
              stroke="#555"
            />
            <YAxis 
              tickFormatter={(value) => `${value}${namespace ? '' : '%'}`} 
              domain={[0, namespace ? 'auto' : 100]} 
              tick={{ fontSize: 10, fill: '#aaa' }}
              stroke="#555"
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#2d3748', borderColor: '#4a5568', color: '#e2e8f0' }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#e2e8f0' }}
            />
            
            {/* 임계값 라인 (빨간색) */}
            {!namespace && (
              <Line 
                type="monotone" 
                dataKey={() => 80} 
                stroke="#f56565" 
                strokeWidth={1} 
                dot={false}
                activeDot={false}
              />
            )}
            
            {/* 데이터 라인 */}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={getLineColors()[0]} 
              dot={false} 
              strokeWidth={1.5}
            />
            
            {multiLine && namespace && (
              <>
                <Line 
                  type="monotone" 
                  dataKey="value2" 
                  stroke={getLineColors()[1]} 
                  dot={false} 
                  strokeWidth={1.5}
                />
                <Line 
                  type="monotone" 
                  dataKey="value3" 
                  stroke={getLineColors()[2]} 
                  dot={false} 
                  strokeWidth={1.5}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default CPUChart;
