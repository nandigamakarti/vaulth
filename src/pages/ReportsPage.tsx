import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useHabits } from '@/contexts/HabitContext';

const ReportsPage: React.FC = () => {
  const { habits, loading } = useHabits();

  // Helper to get completion rate for a habit
  const getCompletionRate = (habit) => {
    const totalPossible = (() => {
      const start = new Date(habit.startDate);
      const today = new Date();
      let count = 0;
      for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
        const dayName = d.toLocaleDateString('en-US', { weekday: 'long' });
        if (habit.targetDays.includes(dayName)) count++;
      }
      return count;
    })();
    return totalPossible > 0 ? Math.round((habit.completedDates.length / totalPossible) * 100) : 0;
  };

  // Helper to get target days label
  const getTargetDaysLabel = (targetDays) => {
    const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const weekends = ['Saturday', 'Sunday'];
    if (targetDays.length === 5 && weekdays.every(day => targetDays.includes(day))) return 'Weekdays';
    if (targetDays.length === 2 && weekends.every(day => targetDays.includes(day))) return 'Weekends';
    return 'Custom';
  };

  // Calculate total average completion rate
  const totalCompletionRate = habits.length > 0 ? Math.round(habits.reduce((sum, h) => sum + getCompletionRate(h), 0) / habits.length) : 0;

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">Habit Reports</h1>
      <p className="text-muted-foreground mb-8">
        View detailed reports and analytics for all your habits
      </p>

      <div className="bg-card rounded-lg p-6">
        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading...</div>
        ) : (
        <>
        <Table>
          <TableHeader>
            <TableRow>
                <TableHead>ID</TableHead>
              <TableHead>Habit Name</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Target Days</TableHead>
              <TableHead>Current Streak</TableHead>
              <TableHead>Completion Rate</TableHead>
              <TableHead>Highest Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {habits.map((habit) => (
              <TableRow key={habit.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{habit.id.slice(0, 6)}</TableCell>
                  <TableCell className="font-medium text-base text-foreground">{habit.name}</TableCell>
                  <TableCell className="text-base text-foreground">{habit.startDate}</TableCell>
                  <TableCell className="text-base text-foreground">{getTargetDaysLabel(habit.targetDays)}</TableCell>
                  <TableCell className="text-base text-foreground">{habit.streak} days</TableCell>
                  <TableCell className="text-base text-foreground">{getCompletionRate(habit)}%</TableCell>
                  <TableCell className="text-base text-foreground">{habit.highestStreak} days</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          <div className="mt-4 text-right text-lg font-semibold text-primary">
            Total Habits Completion Rate: {totalCompletionRate}%
          </div>
        </>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;
