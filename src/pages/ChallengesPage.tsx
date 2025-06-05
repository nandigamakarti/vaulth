import React from 'react';
import PreMadeChallenges from '@/components/dashboard/PreMadeChallenges';
import { Trophy } from 'lucide-react';

const ChallengesPage: React.FC = () => {
  return (
    <div className="container py-8 animate-fade-in">
      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-2 rounded-md flex items-center justify-center">
            <Trophy className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Challenges</h1>
        </div>
        <p className="text-muted-foreground">
          Take on pre-made challenges to build new habits and achieve your goals. Each challenge includes carefully designed habits to help you succeed.
        </p>
      </header>

      <div className="max-w-4xl mx-auto">
        <PreMadeChallenges />
      </div>
    </div>
  );
};

export default ChallengesPage; 