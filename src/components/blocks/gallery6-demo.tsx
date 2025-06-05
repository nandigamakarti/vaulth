import { Gallery6 } from "@/components/ui/gallery6";

const demoData = {
  heading: "Habit Development Resources",
  demoUrl: "/blog",
  items: [
    {
      id: "item-1",
      title: "The Science of Habit Formation",
      summary: "Learn about the psychology behind habit formation and how to leverage it for lasting change.",
      url: "/blog/science-of-habits",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
    },
    {
      id: "item-2",
      title: "Building Morning Routines",
      summary: "Discover how to create effective morning routines that set you up for success throughout the day.",
      url: "/blog/morning-routines",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
    },
    {
      id: "item-3",
      title: "Breaking Bad Habits",
      summary: "Practical strategies for identifying and overcoming negative habits that hold you back.",
      url: "/blog/breaking-bad-habits",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
    },
    {
      id: "item-4",
      title: "Habit Stacking Guide",
      summary: "Learn how to build new habits by stacking them onto existing ones for better consistency.",
      url: "/blog/habit-stacking",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
    },
    {
      id: "item-5",
      title: "Tracking Progress Effectively",
      summary: "Master the art of habit tracking to maintain motivation and measure your success.",
      url: "/blog/habit-tracking",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070"
    },
  ],
};

function Gallery6Demo() {
  return <Gallery6 {...demoData} />;
}

export { Gallery6Demo }; 