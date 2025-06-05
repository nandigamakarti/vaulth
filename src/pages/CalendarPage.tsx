import React from "react";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";
import { useHabits } from "@/contexts/HabitContext";

const CalendarPage: React.FC = () => {
  const { habits, loading } = useHabits();
  
  return <FullScreenCalendar habits={habits} loading={loading} />;
};

export default CalendarPage;
