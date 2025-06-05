import React from 'react';
import { useHabits } from '@/contexts/HabitContext';
import AddHabitForm from '@/components/habits/AddHabitForm';
import HabitCard from '@/components/habits/HabitCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Plus, Target, Trophy, Sparkles, ArrowRight, Quote, Rocket } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const exampleHabits = [
  "Drink 2L of water",
  "Read for 30 minutes",
  "Exercise for 20 minutes",
  "Meditate for 10 minutes",
  "Write a daily journal",
  "Wake up before 7am",
  "No sugar for a day",
  "Take a 15-minute walk",
  "Plan tomorrow's tasks",
  "Practice gratitude (list 3 things)"
];

const EmptyState = () => {
  const [showExamples, setShowExamples] = React.useState(false);
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-3xl mx-auto">
      <Card className="w-full p-8 text-center relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
        <div className="absolute top-2 right-2">
          <Sparkles className="h-5 w-5 text-primary animate-pulse" />
        </div>
        
        {/* Main content */}
        <div className="space-y-6">
          <div className="relative">
            <div className="absolute -top-1 -left-1 w-12 h-12 bg-primary/10 rounded-full animate-ping" />
            <div className="relative z-10 rounded-full bg-primary/10 p-4 mx-auto w-fit">
              <Rocket className="h-12 w-12 text-primary" />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-2xl font-bold">Start Your Journey</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">
              Create your first habit to begin building better routines and achieving your goals
            </p>
          </div>

          <div className="flex flex-col items-center gap-4">
            <AddHabitForm triggerClassName="w-full max-w-sm bg-primary hover:bg-primary/90" />
            <Button variant="outline" className="w-full max-w-sm" onClick={() => setShowExamples(v => !v)}>
              <Target className="mr-2 h-4 w-4" />
              {showExamples ? 'Hide Example Habits' : 'View Example Habits'}
            </Button>
          </div>

          {showExamples && (
            <div className="mt-6 bg-muted/50 rounded-lg p-6 text-left shadow-inner animate-fade-in">
              <h4 className="font-semibold mb-3 text-primary flex items-center gap-2">
                <Sparkles className="h-4 w-4" /> 10 Example Habits
              </h4>
              <ul className="space-y-2 pl-2">
                {exampleHabits.map((habit, idx) => (
                  <li key={habit} className="flex items-center gap-2 text-base">
                    <span className="inline-block w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">{idx+1}</span>
                    <span>{habit}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Quote section */}
        <div className="mt-12 pt-8 border-t">
          <div className="relative">
            <Quote className="h-8 w-8 text-primary/20 absolute -top-4 -left-4" />
            <blockquote className="text-lg font-medium text-muted-foreground italic">
              "A journey of a thousand miles begins with a single step."
            </blockquote>
            <footer className="mt-2 text-sm text-muted-foreground">
              — Lao Tzu
            </footer>
          </div>
        </div>
      </Card>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full mt-8">
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="rounded-full bg-primary/10 p-2 w-fit mx-auto mb-3">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-semibold mb-1">Track Daily</h4>
          <p className="text-sm text-muted-foreground">Monitor your progress with ease</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="rounded-full bg-primary/10 p-2 w-fit mx-auto mb-3">
            <Trophy className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-semibold mb-1">Build Streaks</h4>
          <p className="text-sm text-muted-foreground">Stay motivated with streak tracking</p>
        </Card>
        <Card className="p-4 text-center hover:shadow-md transition-shadow">
          <div className="rounded-full bg-primary/10 p-2 w-fit mx-auto mb-3">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <h4 className="font-semibold mb-1">Achieve Goals</h4>
          <p className="text-sm text-muted-foreground">Transform your daily habits</p>
        </Card>
      </div>
    </div>
  );
};

const HabitList = () => {
  const { habits, loading } = useHabits();

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-[300px] rounded-xl" />
        ))}
      </div>
    );
  }

  if (habits.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {habits.map(habit => (
        <HabitCard key={habit.id} habit={habit} />
      ))}
    </div>
  );
};

const HabitTrackerPage: React.FC = () => {
  const { habits } = useHabits();
  
  return (
    <div className="container py-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Habit Tracker</h1>
          <p className="text-muted-foreground">Track your daily habits and build consistency</p>
        </div>
        {habits.length > 0 && (
          <AddHabitForm showIcon />
        )}
      </div>
      
      <div className="mb-6 grid gap-4">
        {habits.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{habits.length}</div>
                <div className="text-sm text-muted-foreground">Active Habits</div>
              </div>
            </Card>
            <Card className="p-4 flex items-center gap-3">
              <div className="rounded-full bg-primary/10 p-2">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">
                  {Math.max(...habits.map(h => h.highestStreak))}
                </div>
                <div className="text-sm text-muted-foreground">Best Streak</div>
              </div>
            </Card>
          </div>
        )}
      </div>
      
      <HabitList />
    </div>
  );
};

export default HabitTrackerPage;
