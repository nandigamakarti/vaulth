import React from 'react';
import { Bell } from 'lucide-react';
import { NotificationSettings } from '@/components/settings/NotificationSettings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNotifications } from '@/contexts/NotificationContext';

const NotificationsPage: React.FC = () => {
  const { preferences } = useNotifications();

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-bold">Notifications</h1>
      </div>

      <div className="grid gap-6">
        <NotificationSettings />

        <Card>
          <CardHeader>
            <CardTitle>Notification History</CardTitle>
            <CardDescription>
              Your recent notifications and alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {preferences.browserNotifications ? (
                <div className="text-sm text-muted-foreground">
                  <p>Browser notifications are enabled. You'll receive:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Daily reminders to log your habits</li>
                    <li>Weekly progress summaries</li>
                    <li>Challenge completion notifications</li>
                  </ul>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Enable browser notifications to receive updates about your habits and progress.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotificationsPage; 