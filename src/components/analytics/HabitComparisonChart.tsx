import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from 'recharts';
import { BarChart3 } from 'lucide-react';

interface HabitComparisonData {
  name: string;
  completion: number;
}

interface HabitComparisonChartProps {
  data: HabitComparisonData[];
}

const HabitComparisonChart: React.FC<HabitComparisonChartProps> = ({ data: rawData }) => {
  // Process data to handle long habit names and ensure we have valid data
  const processData = () => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0) {
      return [
        { name: 'No data', completion: 0, id: 'no-data' }
      ];
    }

    // Sort by completion rate (descending)
    const sortedData = [...rawData]
      .filter(item => item && typeof item.completion === 'number' && item.name)
      .sort((a, b) => b.completion - a.completion);
    
    // Limit to top 10 habits if there are many
    const limitedData = sortedData.slice(0, 10);
    
    if (limitedData.length === 0) {
      return [
        { name: 'No data', completion: 0, id: 'no-data' }
      ];
    }
    
    // Return data with full habit names
    return limitedData.map((item, index) => ({
      ...item,
      // Ensure completion is a number between 0 and 100 with 2 decimal places
      completion: Math.min(100, Math.max(0, Number(Number(item.completion).toFixed(2)))),
      // Add unique ID for each item
      id: `habit-${index}`
    }));
  };
  
  const data = processData();
  const hasData = data.length > 0 && data[0].name !== 'No data';
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Habit Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          {hasData ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={data} 
                margin={{ 
                  top: 5, 
                  right: 10, 
                  left: 0, 
                  bottom: 20 
                }}
                layout="vertical"
                barCategoryGap={12}
                barGap={6}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                <XAxis 
                  type="number"
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => `${Number(value).toFixed(2)}%`}
                />
                <YAxis 
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }}
                  width={180}
                  interval={0}
                />
                <Tooltip 
                  formatter={(value) => [`${Number(value).toFixed(2)}%`, 'Completion Rate']}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    borderColor: 'hsl(var(--border))',
                    color: 'hsl(var(--popover-foreground))',
                    borderRadius: '0.375rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                  }}
                  itemStyle={{ color: 'hsl(var(--primary))' }}
                  labelStyle={{ fontWeight: 'bold', color: 'hsl(var(--foreground))' }}
                />
                <Bar 
                  dataKey="completion" 
                  fill="url(#barGradient)"
                  radius={[4, 0, 0, 4]}
                  animationDuration={1000}
                  name="Completion Rate"
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`}
                      fill={`hsl(var(--primary) / ${0.7 + (index * 0.05)})`}
                    />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.9} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              No habit data available
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default HabitComparisonChart;
