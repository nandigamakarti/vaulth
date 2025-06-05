import { useNotifications } from '@/contexts/NotificationContext';
import { useHabits } from '@/contexts/HabitContext';

class NotificationService {
  private static instance: NotificationService;
  private reminderInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  startDailyReminder(time: string) {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
    }

    const [hours, minutes] = time.split(':').map(Number);
    const now = new Date();
    const scheduledTime = new Date(now);
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime < now) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    const timeUntilScheduled = scheduledTime.getTime() - now.getTime();

    setTimeout(() => {
      this.sendDailyReminder();
      this.reminderInterval = setInterval(() => {
        this.sendDailyReminder();
      }, 24 * 60 * 60 * 1000); // 24 hours
    }, timeUntilScheduled);
  }

  private sendDailyReminder() {
    const { sendBrowserNotification } = useNotifications();
    sendBrowserNotification(
      "Don't forget to log your habits!",
      "Take a moment to update your habit progress for today."
    );
  }

  async sendWeeklyDigest() {
    const { habits } = useHabits();
    const currentStreak = habits.reduce((max, habit) => Math.max(max, habit.streak), 0);
    
    const { sendBrowserNotification } = useNotifications();
    sendBrowserNotification(
      "Weekly Habit Summary",
      `You're on a ${currentStreak}-day streak! Keep up the great work!`
    );
  }

  stopReminders() {
    if (this.reminderInterval) {
      clearInterval(this.reminderInterval);
      this.reminderInterval = null;
    }
  }
}

export const notificationService = NotificationService.getInstance(); 