import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface SparklineChartProps {
  data: number[];
  title: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, title }) => {
  const chartData = data.map((value, index) => ({
    day: index + 1,
    value: value
  }));

  // Get day names for X-axis
  const getDayName = (index: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const dayIndex = (today.getDay() - (6 - index) + 7) % 7;
    return days[dayIndex];
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData} 
              margin={{ top: 10, right: 10, left: 30, bottom: 25 }}
            >
              <defs>
                <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                tickFormatter={(value) => getDayName(value - 1)}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                padding={{ left: 20, right: 20 }}
              />
              <YAxis 
                domain={[0, 100]}
                tickFormatter={(value) => `${value}%`}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={{ stroke: 'hsl(var(--border))' }}
                padding={{ top: 10, bottom: 10 }}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--popover))',
                  borderColor: 'hsl(var(--border))',
                  borderRadius: '0.375rem',
                }}
                formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Completion']}
                labelFormatter={(label) => getDayName(label - 1)}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ r: 3, fill: 'hsl(var(--primary))' }}
                activeDot={{ r: 4, fill: 'hsl(var(--primary))' }}
                isAnimationActive={true}
                animationDuration={1000}
              />
              <path
                d={`M0,${chartData[0].value} ${chartData.map((point, i) => `L${i},${point.value}`).join(' ')} L${chartData.length - 1},0 L0,0 Z`}
                fill="url(#sparklineGradient)"
                transform="translate(30, 0)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default SparklineChart; 