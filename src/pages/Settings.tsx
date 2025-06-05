import React, { useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const [showDailyQuote, setShowDailyQuote] = useState(() => {
    const saved = localStorage.getItem('showDailyQuote');
    return saved ? JSON.parse(saved) : false;
  });

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    toast.success(`Theme set to ${newTheme}`);
  };

  const handleQuoteChange = (checked: boolean) => {
    setShowDailyQuote(checked);
    localStorage.setItem('showDailyQuote', JSON.stringify(checked));
    if (checked) {
      toast.success('Daily quotes enabled');
    } else {
      toast.success('Daily quotes disabled');
    }
  };

  return (
    <div className="container py-8 max-w-3xl animate-fade-in">
      <h1 className="text-3xl font-bold mb-2">Settings</h1>
      <p className="text-muted-foreground mb-8">Customize your HabitVault experience</p>

      <div className="space-y-10">
        {/* Appearance */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Appearance</h2>
          <Separator />
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="theme-toggle" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <Switch
                id="theme-toggle"
                checked={theme === 'dark'}
                onCheckedChange={handleThemeChange}
              />
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">Preferences</h2>
          <Separator />
          
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="show-quotes" className="text-base">Daily Quotes</Label>
                <p className="text-sm text-muted-foreground">
                  Show motivational quotes on the dashboard
                </p>
              </div>
              <Switch
                id="show-quotes"
                checked={showDailyQuote}
                onCheckedChange={handleQuoteChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
