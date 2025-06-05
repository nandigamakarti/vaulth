"use client"

import * as React from "react"
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  startOfToday,
  startOfWeek,
} from "date-fns"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusCircleIcon,
  SearchIcon,
} from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useHabits } from '@/contexts/HabitContext';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useMediaQuery } from "@/hooks/use-media-query"

interface Event {
  id: string
  name: string
  time: string
  datetime: string
  userId: string
  created_at?: string
}

interface CalendarData {
  day: Date
  events: Event[]
}

interface FullScreenCalendarProps {
  habits: import('@/types/habit').Habit[]
  loading: boolean
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
]

// Color logic from HabitHeatmap
const getCellColor = (value: number): string => {
  if (value === 0) return 'bg-muted hover:bg-muted/80';
  if (value < 0.5) return 'bg-accent/30 hover:bg-accent/40';
  if (value < 0.8) return 'bg-accent/50 hover:bg-accent/60';
  return 'bg-accent/80 hover:bg-accent/90';
};

function getDayCompletionRatio(day: Date, habits: import('@/types/habit').Habit[]): number {
  const today = new Date();
  // Only show status for today or past days
  if (day > today) return 0;
  const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
  const dateString = format(day, "yyyy-MM-dd");
  const scheduledHabits = habits.filter(habit => habit.targetDays.includes(dayName) && new Date(habit.startDate) <= day);
  if (scheduledHabits.length === 0) return 0;
  const completed = scheduledHabits.filter(habit => habit.completedDates.includes(dateString));
  return completed.length / scheduledHabits.length;
}

export function FullScreenCalendar({ habits, loading }: FullScreenCalendarProps) {
  const today = startOfToday()
  const [selectedDay, setSelectedDay] = React.useState(today)
  const [currentMonth, setCurrentMonth] = React.useState(format(today, "MMM-yyyy"))
  const [addEventOpen, setAddEventOpen] = React.useState(false)
  const [newEvent, setNewEvent] = React.useState<{ name: string; date: string; time: string }>({ name: '', date: format(today, 'yyyy-MM-dd'), time: '' })
  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date())
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { addEvent, events: userEvents } = useHabits();
  const [hoveredDay, setHoveredDay] = React.useState<Date | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  const days = eachDayOfInterval({
    start: startOfWeek(firstDayCurrentMonth),
    end: endOfWeek(endOfMonth(firstDayCurrentMonth)),
  })

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"))
  }

  function goToToday() {
    setCurrentMonth(format(today, "MMM-yyyy"))
  }

  async function handleAddEvent() {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add events",
        variant: "destructive",
      });
      return;
    }

    if (!newEvent.name || !newEvent.date || !newEvent.time) {
      toast({
        title: "Missing fields",
        description: "Please fill in all event details",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log('Adding event:', newEvent);
      const eventToAdd = {
        name: newEvent.name,
        time: newEvent.time,
        datetime: newEvent.date,
        userId: user.id,
      };
      
      await addEvent(eventToAdd);
      
      toast({
        title: "Event added",
        description: "Your event has been added successfully",
      });
      setAddEventOpen(false);
      setNewEvent({ name: '', date: format(today, 'yyyy-MM-dd'), time: '' });
    } catch (error: any) {
      console.error('Failed to add event:', error);
      toast({
        title: "Error adding event",
        description: error?.message || "There was a problem adding your event. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="flex flex-1 flex-col">
      {/* Calendar Header */}
      <div className="flex flex-col space-y-4 p-4 md:flex-row md:items-center md:justify-between md:space-y-0 lg:flex-none">
        <div className="flex flex-auto">
          <div className="flex items-center gap-4">
            <div className="hidden w-20 flex-col items-center justify-center rounded-lg border bg-muted p-0.5 md:flex">
              <h1 className="p-1 text-xs uppercase text-muted-foreground">
                {format(today, "MMM")}
              </h1>
              <div className="flex w-full items-center justify-center rounded-lg border bg-background p-0.5 text-lg font-bold">
                <span>{format(today, "d")}</span>
              </div>
            </div>
            <div className="flex flex-col">
              <h2 className="text-lg font-semibold text-foreground">
                {format(firstDayCurrentMonth, "MMMM, yyyy")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {format(firstDayCurrentMonth, "MMM d, yyyy")} -{" "}
                {format(endOfMonth(firstDayCurrentMonth), "MMM d, yyyy")}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
          <div className="inline-flex w-full -space-x-px rounded-lg shadow-sm shadow-black/5 md:w-auto rtl:space-x-reverse">
            <Button
              onClick={previousMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to previous month"
            >
              <ChevronLeftIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
            <Button
              onClick={goToToday}
              className="w-full rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10 md:w-auto"
              variant="outline"
            >
              Today
            </Button>
            <Button
              onClick={nextMonth}
              className="rounded-none shadow-none first:rounded-s-lg last:rounded-e-lg focus-visible:z-10"
              variant="outline"
              size="icon"
              aria-label="Navigate to next month"
            >
              <ChevronRightIcon size={16} strokeWidth={2} aria-hidden="true" />
            </Button>
          </div>

          <Separator orientation="vertical" className="hidden h-6 md:block" />

          <Button className="w-full gap-2 md:w-auto" onClick={() => setAddEventOpen(true)}>
            <PlusCircleIcon size={16} strokeWidth={2} aria-hidden="true" />
            <span>New Event</span>
          </Button>

          <Separator
            orientation="horizontal"
            className="block w-full md:hidden"
          />
        </div>
      </div>

      {/* Add Event Modal */}
      <Dialog open={addEventOpen} onOpenChange={setAddEventOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Event name"
              value={newEvent.name}
              onChange={e => setNewEvent(ev => ({ ...ev, name: e.target.value }))}
            />
            <Input
              type="date"
              value={newEvent.date}
              onChange={e => setNewEvent(ev => ({ ...ev, date: e.target.value }))}
            />
            <Input
              type="time"
              value={newEvent.time}
              onChange={e => setNewEvent(ev => ({ ...ev, time: e.target.value }))}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleAddEvent} disabled={!newEvent.name || !newEvent.date || !newEvent.time}>
              Add Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Calendar Grid */}
      <div className="lg:flex lg:flex-auto lg:flex-col">
        {/* Week Days Header */}
        <div className="grid grid-cols-7 border text-center text-xs font-semibold leading-6 lg:flex-none">
          <div className="border-r py-2.5">Sun</div>
          <div className="border-r py-2.5">Mon</div>
          <div className="border-r py-2.5">Tue</div>
          <div className="border-r py-2.5">Wed</div>
          <div className="border-r py-2.5">Thu</div>
          <div className="border-r py-2.5">Fri</div>
          <div className="py-2.5">Sat</div>
        </div>

        {/* Calendar Days */}
        <div className="flex text-xs leading-6 lg:flex-auto">
          <div className="hidden w-full border-x lg:grid lg:grid-cols-7 lg:grid-rows-5">
            {days.map((day, dayIdx) => {
              const completionRatio = getDayCompletionRatio(day, habits);
              const dayEvents = userEvents.filter(e => e.datetime === format(day, "yyyy-MM-dd"));
              const dayName = day.toLocaleDateString('en-US', { weekday: 'long' });
              const dateString = format(day, "yyyy-MM-dd");
              const scheduledHabits = habits.filter(habit => habit.targetDays.includes(dayName) && new Date(habit.startDate) <= day);
              const isPopoverOpen = hoveredDay && isSameDay(day, hoveredDay);
              return (
                <div
                  key={dayIdx}
                  className={cn(dayIdx === 0 && colStartClasses[getDay(day)])}
                  onMouseEnter={() => setHoveredDay(day)}
                  onMouseLeave={() => setHoveredDay(null)}
                  style={{ position: 'relative' }}
                >
                  <button
                    type="button"
                    className={cn(
                      isEqual(day, selectedDay) && "text-primary-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-foreground",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-muted-foreground",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      getCellColor(completionRatio),
                      "w-full flex h-14 flex-col border-b border-r px-3 py-2 hover:bg-muted focus:z-10",
                    )}
                  >
                    <time
                      dateTime={format(day, "yyyy-MM-dd")}
                      className={cn(
                        "ml-auto flex size-6 items-center justify-center rounded-full",
                        isEqual(day, selectedDay) &&
                          isToday(day) &&
                          "bg-primary text-primary-foreground",
                        isEqual(day, selectedDay) &&
                          !isToday(day) &&
                          "bg-primary text-primary-foreground",
                      )}
                    >
                      {format(day, "d")}
                    </time>
                    {completionRatio > 0 && (
                      <div className="mt-1 text-[10px] text-primary font-semibold">{Math.round(completionRatio * 100)}%</div>
                    )}
                  </button>
                  {isPopoverOpen && (
                    <div className="absolute z-50 left-1/2 -translate-x-1/2 top-14 bg-popover border rounded-lg shadow-lg p-4 w-64 animate-fade-in">
                      <div>
                        <h3 className="font-semibold mb-2 text-base">Events</h3>
                        {dayEvents.length === 0 ? (
                          <div className="text-muted-foreground text-sm">No events for this day.</div>
                        ) : (
                          <ul className="space-y-2">
                            {dayEvents.map(event => (
                              <li key={event.id} className="flex items-center gap-2">
                                <span className="font-semibold text-lg">{event.name}</span>
                                <span className="text-base text-muted-foreground">{event.time}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                      <div className="mt-4">
                        <h3 className="font-semibold mb-2 text-base">Habits</h3>
                        {scheduledHabits.length === 0 ? (
                          <div className="text-muted-foreground text-sm">No habits scheduled for this day.</div>
                        ) : (
                          <ul className="space-y-2">
                            {scheduledHabits.map(habit => {
                              const completed = habit.completedDates.includes(dateString);
                              return (
                                <li key={habit.id} className="flex items-center gap-2">
                                  <span className={cn(
                                    "font-semibold text-lg",
                                    completed ? "text-green-600" : "text-red-600"
                                  )}>
                                    {habit.name}
                                  </span>
                                  {completed ? (
                                    <span className="text-base text-green-500">Completed</span>
                                  ) : (
                                    <span className="text-base text-red-500">Not completed</span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events Display Section */}
      <div className="mt-8 px-4">
        <h2 className="text-2xl font-semibold mb-4">Upcoming Events</h2>
        {userEvents.length === 0 ? (
          <p className="text-muted-foreground">No events scheduled.</p>
        ) : (
          <div className="space-y-4">
            {userEvents
              .sort((a, b) => {
                const dateA = new Date(`${a.datetime}T${a.time}`);
                const dateB = new Date(`${b.datetime}T${b.time}`);
                return dateA.getTime() - dateB.getTime();
              })
              .map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex flex-col">
                    <span className="text-lg font-semibold">{event.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(event.datetime), 'MMMM d, yyyy')} at {event.time}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  )
}