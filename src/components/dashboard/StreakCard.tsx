import React from 'react';
import { cn } from '@/lib/utils';
import { Flame } from 'lucide-react';

interface StreakCardProps {
  value: number;
  label: string;
  isHighest?: boolean;
  className?: string;
}

const StreakCard: React.FC<StreakCardProps> = ({
  value,
  label,
  isHighest = false,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border p-6 flex flex-col items-center transition-all hover:shadow-lg hover:-translate-y-1',
        isHighest && 'border-primary/30 bg-primary/5',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-1">
        <Flame className={cn('h-5 w-5', isHighest ? 'text-blue-500' : 'text-orange-500')} />
        <span className={cn('text-4xl font-bold', isHighest ? 'text-blue-600' : 'text-primary')}>{value}</span>
      </div>
      <span className={cn('text-base mt-1', isHighest ? 'text-blue-500' : 'text-muted-foreground')}>{label}</span>
    </div>
  );
};

export default StreakCard;
