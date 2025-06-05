import React, { useMemo } from 'react';
import { GradientText } from '@/components/ui/gradient-text';

interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  avatar?: string; // Optional: URL to an avatar image
}

const testimonialsData: Testimonial[] = [
  {
    id: 1,
    quote: "HabitVault has completely transformed how I build and track my habits. The analytics are a game-changer!",
    author: "Alex P.",
    role: "Software Developer",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg"
  },
  {
    id: 2,
    quote: "I love the simplicity and power of HabitVault. It's intuitive and keeps me motivated every day.",
    author: "Sarah M.",
    role: "UX Designer",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    id: 3,
    quote: "Finally, a habit tracker that understands what users need. The customizable goals and streaks are fantastic.",
    author: "David K.",
    role: "Product Manager",
    avatar: "https://randomuser.me/api/portraits/men/50.jpg"
  },
  {
    id: 4,
    quote: "The reminder system in HabitVault is top-notch! I haven't missed a habit since I started using it.",
    author: "N Kartikeya",
    role: "Student",
    avatar: "https://randomuser.me/api/portraits/men/51.jpg"
  },
  {
    id: 5,
    quote: "As a busy professional, HabitVault helps me stay organized and focused on my personal growth. Highly recommended!",
    author: "S Susmitha",
    role: "Marketing Manager",
    avatar: "https://randomuser.me/api/portraits/women/54.jpg" // Changed avatar
  },
  {
    id: 6,
    quote: "I've tried many habit trackers, but HabitVault's clean interface and insightful progress charts make it stand out.",
    author: "V Yogesh",
    role: "Entrepreneur",
    avatar: "https://randomuser.me/api/portraits/men/53.jpg"
  }
];

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border-2 border-transparent hover:bg-emerald-50 dark:hover:bg-emerald-800/40 hover:border-accent dark:hover:border-accent hover:shadow-xl transform hover:scale-105 transition-all duration-300 ease-in-out">
      {testimonial.avatar && (
        <img 
          src={testimonial.avatar} 
          alt={`${testimonial.author}'s avatar`} 
          className="w-16 h-16 rounded-full mx-auto mb-4 border-2 border-primary dark:border-primary-dark"
        />
      )}
      <p className="text-gray-600 dark:text-gray-300 text-center italic mb-4 leading-relaxed">"{testimonial.quote}"</p>
      <div className="text-center">
        <p className="font-semibold text-lg"><GradientText>{testimonial.author}</GradientText></p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
      </div>
    </div>
  );
};

const TestimonialsSection: React.FC = () => {
  const shuffledTestimonials = useMemo(() => {
    const array = [...testimonialsData]; // Create a copy
    let currentIndex = array.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex !== 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
    return array;
  }, []); // Empty dependency array shuffles once on mount

  return (
    <section className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4"><GradientText>What Our Users Say</GradientText></h2>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-10 md:mb-16 max-w-2xl mx-auto">
          Hear from real users who have transformed their lives with HabitVault.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {shuffledTestimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
