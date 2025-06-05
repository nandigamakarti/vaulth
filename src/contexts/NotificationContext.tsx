import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NotificationPreferences {
  browserNotifications: boolean;
  emailDigests: boolean;
  timeBasedAlerts: boolean;
  reminderTime: string; // 24-hour format "HH:mm"
}

interface NotificationContextType {
  preferences: NotificationPreferences;
  updatePreferences: (prefs: Partial<NotificationPreferences>) => void;
  requestNotificationPermission: () => Promise<void>;
  sendBrowserNotification: (title: string, body: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(() => {
    const saved = localStorage.getItem('notificationPreferences');
    return saved ? JSON.parse(saved) : {
      browserNotifications: false,
      emailDigests: false,
      timeBasedAlerts: false,
      reminderTime: "20:00" // Default to 8 PM
    };
  });

  useEffect(() => {
    localStorage.setItem('notificationPreferences', JSON.stringify(preferences));
  }, [preferences]);

  const requestNotificationPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setPreferences(prev => ({ ...prev, browserNotifications: true }));
        toast.success('Browser notifications enabled!');
      } else {
        toast.error('Please enable notifications in your browser settings.');
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast.error('Failed to enable notifications.');
    }
  };

  const sendBrowserNotification = (title: string, body: string) => {
    if (preferences.browserNotifications && Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon: '/favicon.ico'
      });
    }
  };

  const updatePreferences = (newPrefs: Partial<NotificationPreferences>) => {
    setPreferences(prev => ({ ...prev, ...newPrefs }));
  };

  return (
    <NotificationContext.Provider value={{
      preferences,
      updatePreferences,
      requestNotificationPermission,
      sendBrowserNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}; 