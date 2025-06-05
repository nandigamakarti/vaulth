import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationService } from '@/services/notificationService';
import { TimePicker } from '@/components/ui/time-picker';

export const NotificationSettings: React.FC = () => {
  const { preferences, updatePreferences, requestNotificationPermission } = useNotifications();

  const handleBrowserNotificationToggle = async (enabled: boolean) => {
    if (enabled) {
      await requestNotificationPermission();
    } else {
      updatePreferences({ browserNotifications: false });
    }
  };

  const handleTimeBasedAlertsToggle = (enabled: boolean) => {
    updatePreferences({ timeBasedAlerts: enabled });
    if (enabled) {
      notificationService.startDailyReminder(preferences.reminderTime);
    } else {
      notificationService.stopReminders();
    }
  };

  const handleReminderTimeChange = (time: string) => {
    updatePreferences({ reminderTime: time });
    if (preferences.timeBasedAlerts) {
      notificationService.startDailyReminder(time);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications about your habits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Browser Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Receive notifications in your browser
            </p>
          </div>
          <Switch
            checked={preferences.browserNotifications}
            onCheckedChange={handleBrowserNotificationToggle}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Weekly Email Digests</Label>
            <p className="text-sm text-muted-foreground">
              Get a weekly summary of your progress
            </p>
          </div>
          <Switch
            checked={preferences.emailDigests}
            onCheckedChange={(enabled) => updatePreferences({ emailDigests: enabled })}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Daily Reminders</Label>
            <p className="text-sm text-muted-foreground">
              Get reminded to log your habits daily
            </p>
          </div>
          <Switch
            checked={preferences.timeBasedAlerts}
            onCheckedChange={handleTimeBasedAlertsToggle}
          />
        </div>

        {preferences.timeBasedAlerts && (
          <div className="space-y-2">
            <Label>Reminder Time</Label>
            <TimePicker
              value={preferences.reminderTime}
              onChange={handleReminderTimeChange}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}; 