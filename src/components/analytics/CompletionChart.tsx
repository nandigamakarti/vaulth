import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart } from 'lucide-react';

interface CompletionChartProps {
  data: number;
}

const CompletionChart: React.FC<CompletionChartProps> = ({ data }) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Overall Completion Rate
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center">
          <div className="relative w-40 h-40 mb-4">
            {/* Enhanced circular progress indicator */}
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background circle with gradient */}
              <defs>
                <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.7} />
                </linearGradient>
              </defs>
              
              {/* Background circle */}
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                className="stroke-muted-foreground/20"
                strokeWidth="8" 
              />
              
              {/* Progress circle with gradient and animation */}
              <circle 
                cx="50" cy="50" r="40" 
                fill="none" 
                className="stroke-primary"
                strokeWidth="8" 
                strokeLinecap="round"
                strokeDasharray={`${data * 2.51} 251`} 
                strokeDashoffset="0" 
                transform="rotate(-90 50 50)"
                style={{
                  stroke: 'url(#progressGradient)',
                  transition: 'stroke-dasharray 1s ease-in-out'
                }}
              />
            </svg>
            
            {/* Enhanced percentage text in the center */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  {Number(data).toFixed(2)}%
                </span>
                <p className="text-xs text-muted-foreground mt-1">Completion Rate</p>
              </div>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mt-2">
            Based on your habit check-ins over the selected period
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompletionChart;
