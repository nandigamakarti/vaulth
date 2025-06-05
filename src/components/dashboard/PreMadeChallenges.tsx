import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dumbbell, Book, Moon, Apple, Heart } from 'lucide-react';
import { useHabits } from '@/contexts/HabitContext';
import { toast } from 'sonner';

interface Challenge {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ReactNode;
  habits: {
    name: string;
    targetDays: string[];
  }[];
}

const challenges: Challenge[] = [
  {
    id: 'fitness-30',
    title: '30-Day Fitness Challenge',
    description: 'Build strength and improve your fitness with daily exercises',
    duration: '30 days',
    icon: <Dumbbell className="h-5 w-5" />,
    habits: [
      { name: 'Morning Workout', targetDays: ['Monday', 'Wednesday', 'Friday'] },
      { name: 'Evening Stretch', targetDays: ['Tuesday', 'Thursday', 'Saturday'] },
      { name: '10,000 Steps', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    ]
  },
  {
    id: 'reading-21',
    title: '21-Day Reading Challenge',
    description: 'Develop a daily reading habit and expand your knowledge',
    duration: '21 days',
    icon: <Book className="h-5 w-5" />,
    habits: [
      { name: 'Read 30 Minutes', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    ]
  },
  {
    id: 'sleep-14',
    title: '14-Day Sleep Challenge',
    description: 'Improve your sleep quality and establish a healthy sleep routine',
    duration: '14 days',
    icon: <Moon className="h-5 w-5" />,
    habits: [
      { name: 'Bedtime at 10 PM', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      { name: 'No Screens 1 Hour Before Bed', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    ]
  },
  {
    id: 'nutrition-30',
    title: '30-Day Nutrition Challenge',
    description: 'Develop healthy eating habits and improve your diet',
    duration: '30 days',
    icon: <Apple className="h-5 w-5" />,
    habits: [
      { name: 'Eat 5 Servings of Vegetables', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      { name: 'Drink 8 Glasses of Water', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] }
    ]
  },
  {
    id: 'mindfulness-21',
    title: '21-Day Mindfulness Challenge',
    description: 'Practice mindfulness and improve your mental well-being',
    duration: '21 days',
    icon: <Heart className="h-5 w-5" />,
    habits: [
      { name: '10-Minute Meditation', targetDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] },
      { name: 'Gratitude Journal', targetDays: ['Monday', 'Wednesday', 'Friday'] }
    ]
  }
];

const PreMadeChallenges: React.FC = () => {
  const { addHabit } = useHabits();

  const startChallenge = async (challenge: Challenge) => {
    try {
      // Add each habit from the challenge
      for (const habit of challenge.habits) {
        await addHabit({
          name: habit.name,
          targetDays: habit.targetDays,
          startDate: new Date().toISOString().split('T')[0],
          completedDates: [],
          completionTimestamps: {},
          streak: 0,
          highestStreak: 0,
          created_at: new Date().toISOString()
        });
      }
      toast.success(`Started ${challenge.title} successfully!`);
    } catch (error) {
      console.error('Error starting challenge:', error);
      toast.error('Failed to start challenge. Please try again.');
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Pre-Made Challenges</h2>
      <div className="grid gap-4">
        {challenges.map((challenge) => (
          <Card key={challenge.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-md">
                {challenge.icon}
              </div>
              <div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
                <CardDescription>{challenge.description}</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Badge variant="secondary">{challenge.duration}</Badge>
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium mb-1">Included habits:</p>
                  <ul className="list-disc list-inside space-y-1">
                    {challenge.habits.map((habit, index) => (
                      <li key={index}>
                        {habit.name} ({habit.targetDays.length} days/week)
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={() => startChallenge(challenge)}
                className="w-full"
              >
                Start Challenge
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PreMadeChallenges; 