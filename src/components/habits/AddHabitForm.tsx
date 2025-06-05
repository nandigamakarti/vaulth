import React from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useHabits } from '@/contexts/HabitContext';
import { Calendar } from '@/components/ui/calendar';
import { Check, Calendar as CalendarIcon, Plus, Target, Clock, Sparkles } from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

const daysOfWeek = [
  { id: 'Monday', label: 'Mon' },
  { id: 'Tuesday', label: 'Tue' },
  { id: 'Wednesday', label: 'Wed' },
  { id: 'Thursday', label: 'Thu' },
  { id: 'Friday', label: 'Fri' },
  { id: 'Saturday', label: 'Sat' },
  { id: 'Sunday', label: 'Sun' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Habit name is required'),
  targetDays: z.array(z.string()).min(1, 'Select at least one day'),
  startDate: z.date({
    required_error: 'Please select a start date',
  }),
});

type FormValues = z.infer<typeof formSchema>;

interface AddHabitFormProps {
  triggerClassName?: string;
  showIcon?: boolean;
}

const AddHabitForm: React.FC<AddHabitFormProps> = ({ triggerClassName, showIcon = true }) => {
  const { addHabit } = useHabits();
  const { toast } = useToast();
  const [open, setOpen] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      targetDays: [],
      startDate: new Date(),
    },
  });

  const handleSelectAllDays = () => {
    const allDays = daysOfWeek.map(day => day.id);
    form.setValue('targetDays', allDays);
  };

  const handleSelectWeekdays = () => {
    const weekdays = daysOfWeek.slice(0, 5).map(day => day.id);
    form.setValue('targetDays', weekdays);
  };

  const handleSelectWeekends = () => {
    const weekends = daysOfWeek.slice(5).map(day => day.id);
    form.setValue('targetDays', weekends);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await addHabit({
        name: data.name,
        targetDays: data.targetDays,
        startDate: data.startDate.toISOString(),
      });
      
      toast({
        title: 'Habit created',
        description: `${data.name} has been added to your habits`,
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create habit. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={triggerClassName} size="lg">
          {showIcon && <Plus className="mr-2 h-5 w-5" />}
          Add New Habit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Create a new habit
          </DialogTitle>
          <DialogDescription>
            Start your journey to building better habits. Fill in the details below to create a new habit.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Habit Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Morning Meditation, Read 30 mins, Exercise" {...field} />
                  </FormControl>
                  <FormDescription>
                    Choose a clear and specific name for your habit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="targetDays"
              render={() => (
                <FormItem>
                  <div className="space-y-2">
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Target Days
                    </FormLabel>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectAllDays}
                      >
                        All Days
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectWeekdays}
                      >
                        Weekdays
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleSelectWeekends}
                      >
                        Weekends
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {daysOfWeek.map((day) => (
                        <FormField
                          key={day.id}
                          control={form.control}
                          name="targetDays"
                          render={({ field }) => {
                            const isChecked = field.value?.includes(day.id);
                            return (
                              <FormItem key={day.id}>
                                <FormControl>
                                  <div
                                    className={cn(
                                      "flex items-center justify-center w-12 h-12 rounded-full cursor-pointer transition-colors",
                                      isChecked
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80"
                                    )}
                                    onClick={() => {
                                      const newValue = isChecked
                                        ? field.value.filter((value) => value !== day.id)
                                        : [...field.value, day.id];
                                      field.onChange(newValue);
                                    }}
                                  >
                                    <span className="text-sm font-medium">{day.label}</span>
                                  </div>
                                </FormControl>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Start Date
                  </FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className="rounded-md border"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Choose when you want to start this habit
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="submit" className="w-full sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Habit
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHabitForm;
