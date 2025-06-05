import React, { useState, useMemo } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO, isAfter, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';
import { Check, Calendar, Trophy, Trash2, X, Pencil, ChevronLeft, ChevronRight, Flame, Target, Book, Dumbbell, Coffee, Moon, Apple, Heart, PenLine, Sun, Droplet, Activity, Smile } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { Habit } from '@/types/habit';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import EditHabitForm from './EditHabitForm';
import TrendChart from '@/components/analytics/TrendChart';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit }) => {
  const { toggleHabitCompletion, deleteHabit, getCompletionTimestamp } = useHabits();
  const [currentWeekStart, setCurrentWeekStart] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [analyticsRange, setAnalyticsRange] = useState<'week' | 'month' | 'year'>('week');

  // Generate array of dates for current week view
  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));

  const previousWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, -7));
  };

  const nextWeek = () => {
    setCurrentWeekStart(addDays(currentWeekStart, 7));
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }));
  };

  const handleToggleDay = (date: Date) => {
    if (isAfter(date, new Date())) return; // Prevent future date selection
    toggleHabitCompletion(habit.id, format(date, "yyyy-MM-dd"));
  };

  const isDateCompleted = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return habit.completedDates.includes(dateString);
  };

  const isToday = (date: Date) => {
    return isSameDay(date, new Date());
  };

  const isTargetDay = (date: Date) => {
    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
    return habit.targetDays.includes(dayName);
  };

  const startDateObj = parseISO(habit.startDate);
  const isAfterStartDate = (date: Date) => {
    return date >= startDateObj;
  };

  const isFutureDate = (date: Date) => {
    return isAfter(date, new Date());
  };

  const getDateStatus = (date: Date) => {
    if (isFutureDate(date)) return 'future';
    if (isDateCompleted(date)) return 'completed';
    if (isTargetDay(date)) return 'missed';
    return 'inactive';
  };

  const getCompletionTime = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    const timestamp = getCompletionTimestamp(habit.id, dateString);
    if (!timestamp) return null;
    return format(parseISO(timestamp), 'h:mm a');
  };

  // Calculate completion percentage for the current week
  const completionPercentage = useMemo(() => {
    const currentWeekDays = weekDates.filter(date => 
      habit.targetDays.includes(date.toLocaleDateString('en-US', { weekday: 'long' })) &&
      !isFutureDate(date) &&
      isAfterStartDate(date)
    );
    
    if (currentWeekDays.length === 0) return 0;
    
    const completedDays = currentWeekDays.filter(date => isDateCompleted(date)).length;
    return Math.round((completedDays / currentWeekDays.length) * 100);
  }, [weekDates, habit, isAfterStartDate, isDateCompleted]);

  // Calculate days since habit started
  const daysSinceStart = differenceInDays(new Date(), parseISO(habit.startDate));

  // Helper to get completion rate array for a given range
  const getCompletionData = (range: 'week' | 'month' | 'year') => {
    const today = new Date();
    const days: Date[] = [];
    if (range === 'week') {
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        days.push(d);
      }
    } else if (range === 'month') {
      for (let i = 27; i >= 0; i -= 7) {
        const weekStart = new Date();
        weekStart.setDate(today.getDate() - i);
        days.push(weekStart);
      }
    } else if (range === 'year') {
      for (let i = 11; i >= 0; i--) {
        const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
        days.push(month);
      }
    }
    // For each period, calculate completion rate
    return days.map((date, idx) => {
      if (range === 'week') {
        const dateStr = date.toISOString().split('T')[0];
        const isTarget = habit.targetDays.includes(date.toLocaleDateString('en-US', { weekday: 'long' }));
        if (!isTarget || date < parseISO(habit.startDate)) return 0;
        return habit.completedDates.includes(dateStr) ? 100 : 0;
      } else if (range === 'month') {
        // Each week in the last 4 weeks
        let completed = 0, total = 0;
        for (let j = 0; j < 7; j++) {
          const d = new Date(date);
          d.setDate(d.getDate() + j);
          if (d > today) continue;
          const dateStr = d.toISOString().split('T')[0];
          const isTarget = habit.targetDays.includes(d.toLocaleDateString('en-US', { weekday: 'long' }));
          if (!isTarget || d < parseISO(habit.startDate)) continue;
          total++;
          if (habit.completedDates.includes(dateStr)) completed++;
        }
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      } else if (range === 'year') {
        // Each month in the last 12 months
        let completed = 0, total = 0;
        const month = date.getMonth();
        const year = date.getFullYear();
        for (let d = 1; d <= 31; d++) {
          const day = new Date(year, month, d);
          if (day.getMonth() !== month || day > today) break;
          const dateStr = day.toISOString().split('T')[0];
          const isTarget = habit.targetDays.includes(day.toLocaleDateString('en-US', { weekday: 'long' }));
          if (!isTarget || day < parseISO(habit.startDate)) continue;
          total++;
          if (habit.completedDates.includes(dateStr)) completed++;
        }
        return total > 0 ? Math.round((completed / total) * 100) : 0;
      }
      return 0;
    });
  };

  // Helper to get icon based on habit name
  const getHabitIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('read')) return <Book className="h-5 w-5 text-primary" />;
    if (lower.includes('exercise') || lower.includes('workout') || lower.includes('gym')) return <Dumbbell className="h-5 w-5 text-primary" />;
    if (lower.includes('meditate') || lower.includes('mindful')) return <Smile className="h-5 w-5 text-primary" />;
    if (lower.includes('water') || lower.includes('drink')) return <Droplet className="h-5 w-5 text-primary" />;
    if (lower.includes('walk') || lower.includes('run') || lower.includes('jog')) return <Activity className="h-5 w-5 text-primary" />;
    if (lower.includes('sleep') || lower.includes('bed') || lower.includes('night')) return <Moon className="h-5 w-5 text-primary" />;
    if (lower.includes('wake') || lower.includes('morning')) return <Sun className="h-5 w-5 text-primary" />;
    if (lower.includes('fruit') || lower.includes('apple')) return <Apple className="h-5 w-5 text-primary" />;
    if (lower.includes('journal') || lower.includes('write')) return <PenLine className="h-5 w-5 text-primary" />;
    if (lower.includes('gratitude') || lower.includes('happy')) return <Heart className="h-5 w-5 text-primary" />;
    if (lower.includes('coffee') || lower.includes('tea')) return <Coffee className="h-5 w-5 text-primary" />;
    return <Target className="h-5 w-5 text-primary" />;
  };

  return (
    <Card className="w-full mb-6 overflow-hidden transition-all hover:shadow-lg bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-3 border-b flex flex-row justify-between items-start">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-br from-primary/80 to-primary text-white shadow-md mr-2">
              {React.cloneElement(getHabitIcon(habit.name), { className: "h-6 w-6 text-white" })}
            </span>
            <CardTitle className="text-xl font-semibold text-foreground">{habit.name}</CardTitle>
            {/* Checkbox for today's completion status */}
            {(() => {
              const today = new Date().toISOString().split('T')[0];
              const isTodayCompleted = habit.completedDates.includes(today);
              return (
                <input
                  type="checkbox"
                  checked={isTodayCompleted}
                  onChange={() => toggleHabitCompletion(habit.id, today)}
                  className="form-checkbox h-5 w-5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-2 ml-2"
                  aria-label={isTodayCompleted ? 'Mark as missed' : 'Mark as completed'}
                />
              );
            })()}
            {habit.streak > 2 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" />
                {habit.streak} day{habit.streak !== 1 ? 's' : ''}
              </Badge>
            )}
          </div>
          {/* Habit ID badge */}
          <div className="mb-1">
            <span className="inline-block bg-[#23263a] text-[#b5b8e3] text-xs font-mono px-2 py-0.5 rounded-full">ID: {habit.id.slice(0, 6)}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            <span>Started {format(parseISO(habit.startDate), 'MMM d, yyyy')}</span>
            <span className="mx-2">•</span>
            <span>{daysSinceStart} day{daysSinceStart !== 1 ? 's' : ''} tracking</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <span>Created {format(new Date(habit.created_at || habit.startDate), 'MMM d, yyyy')}</span>
          </div>
          {/* Target days badges */}
          {habit.targetDays && habit.targetDays.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {habit.targetDays.map((day) => (
                <Badge
                  key={day}
                  variant="secondary"
                  className="text-xs font-medium px-3 py-1 bg-primary/5 text-primary"
                >
                  {day.substring(0, 3)}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <div className="flex gap-1.5 mt-1">
          <Button 
            variant="outline" 
            size="sm" 
            className="h-8 w-8 p-0" 
            onClick={() => setIsEditDialogOpen(true)}
          >
            <Pencil className="h-3.5 w-3.5" />
            <span className="sr-only">Edit</span>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span className="sr-only">Delete</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Delete Habit
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete <span className="font-medium text-foreground">"{habit.name}"</span>? 
                  This will permanently delete all your progress and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={() => deleteHabit(habit.id)} 
                  className="bg-destructive hover:bg-destructive/90"
                >
                  Delete Habit
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent className="py-4">
        {/* Analytics Visualization Tabs */}
        <div className="mb-6">
          <div className="text-lg font-semibold mb-2">Habit Analysis</div>
          <Tabs value={analyticsRange} onValueChange={v => setAnalyticsRange(v as 'week' | 'month' | 'year')}>
            <TabsList className="mb-2">
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
            <TabsContent value="week">
              <TrendChart data={getCompletionData('week')} timeRange="week" />
            </TabsContent>
            <TabsContent value="month">
              <TrendChart data={getCompletionData('month')} timeRange="month" />
            </TabsContent>
            <TabsContent value="year">
              <TrendChart data={getCompletionData('year')} timeRange="year" />
            </TabsContent>
          </Tabs>
        </div>

        {/* Weekly Progress Bar */}
        <div className="mb-4 space-y-1.5">
          <div className="flex justify-between text-sm font-medium text-muted-foreground mb-1">
            <span className="text-lg font-semibold mb-2">Weekly Progress</span>
            <span>{completionPercentage > 0 ? `${completionPercentage}%` : '0%'}</span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-muted">
            <div 
              className="h-full bg-primary transition-all duration-300 ease-in-out"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4 px-1">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={previousWeek}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous week</span>
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={goToCurrentWeek}
            className="text-sm font-medium px-3 h-8"
          >
            {format(currentWeekStart, 'MMM d')} - {format(endOfWeek(currentWeekStart, { weekStartsOn: 1 }), 'MMM d, yyyy')}
          </Button>
          
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={nextWeek}
            className="h-8 w-8 p-0 rounded-full"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next week</span>
          </Button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDates.map((date) => (
            <div key={date.toString()} className="text-center text-xs font-medium text-muted-foreground">
              {format(date, 'EEE')}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {weekDates.map((date) => {
            const dayLabel = format(date, 'EEE');
            const dayNumber = format(date, 'd');
            const isActive = isAfterStartDate(date);
            const status = getDateStatus(date);
            const completionTime = getCompletionTime(date);
            const isTarget = isTargetDay(date);
            
            return (
              <TooltipProvider key={date.toString()}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex flex-col items-center">
                      <div className="relative">
                        <Button
                        variant="ghost"
                        size="sm"
                        disabled={!isActive || isFutureDate(date) || !isTarget}
                        onClick={() => handleToggleDay(date)}
                        className={cn(
                          'relative h-10 w-10 p-0 rounded-full flex flex-col items-center justify-center transition-all',
                          'hover:bg-accent hover:text-accent-foreground',
                          status === 'completed' && 'bg-primary/30 hover:bg-primary/40 dark:bg-primary/40 dark:hover:bg-primary/50',
                          status === 'missed' && 'bg-destructive/20 hover:bg-destructive/30 dark:bg-destructive/30 dark:hover:bg-destructive/40',
                          isToday(date) && 'ring-2 ring-primary dark:ring-primary/80',
                          (!isActive || isFutureDate(date) || !isTarget) && 'opacity-50',
                          !isTarget && 'bg-transparent'
                        )}
                      >
                        <span className={cn(
                          'text-sm font-medium',
                          status === 'completed' && 'text-primary-700 dark:text-primary-300 font-semibold',
                          status === 'missed' && 'text-destructive-700 dark:text-destructive-300 font-semibold',
                          (!isActive || !isTarget) && 'text-muted-foreground',
                          'block text-center w-8 h-8 flex items-center justify-center rounded-full',
                          status === 'completed' && 'bg-primary/30 dark:bg-primary/20',
                          status === 'missed' && 'bg-destructive/20 dark:bg-destructive/10',
                          isToday(date) && 'ring-2 ring-primary dark:ring-primary/80'
                        )}>
                          {dayNumber}
                        </span>
                      </Button>
                      {completionTime && (
                        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-full text-center">
                          <span className="text-[10px] text-primary whitespace-nowrap">
                            {completionTime}
                          </span>
                        </div>
                      )}
                    </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{format(date, 'EEEE, MMMM d, yyyy')}</p>
                    {status === 'completed' ? (
                      <div className="flex items-center gap-1.5 text-green-600 dark:text-green-400 text-sm">
                        <Check className="h-3.5 w-3.5" />
                        <span>
                          {completionTime ? `Completed at ${completionTime}` : 'Completed'}
                        </span>
                      </div>
                    ) : status === 'missed' ? (
                      <div className="flex items-center gap-1.5 text-destructive text-sm">
                        <X className="h-3.5 w-3.5" />
                        <span>Not completed</span>
                      </div>
                    ) : (
                      <div className="text-muted-foreground text-sm">
                        Not a target day
                      </div>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </div>
      </CardContent>
      
      <CardFooter className="bg-muted/30 dark:bg-muted/10 py-2 px-4 border-t">
        <div className="flex items-center justify-between w-full text-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span>Best streak: {habit.highestStreak} days</span>
          </div>
          <div className="text-muted-foreground">
            {habit.completedDates.length} of {habit.targetDays.length * Math.ceil(daysSinceStart / 7)} targets
          </div>
        </div>
      </CardFooter>
      
      <EditHabitForm
        habit={habit}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
      />
    </Card>
  );
};

export default HabitCard;
