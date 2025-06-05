import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { GradientButton } from '@/components/ui/gradient-button';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import { Contact7 } from '@/components/ui/contact-7';
import { Feature } from '@/components/ui/feature-with-image-carousel';
import { Gallery6 } from '@/components/ui/gallery6';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/ui/footer-section';
import { HeroGeometric } from '@/components/ui/shape-landing-hero';
import { GradientText } from '@/components/ui/gradient-text';
import { StarBorder } from "@/components/ui/star-border";
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage: React.FC = () => {
  const { theme, setTheme } = useTheme();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <div className="font-bold text-2xl"><GradientText>HabitVault</GradientText></div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="h-9 w-9"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
            <StarBorder as={Link} to="/login" color="hsl(var(--primary))">
              Log in
            </StarBorder>
            <StarBorder as={Link} to="/signup" color="hsl(var(--primary))">
              Sign up
            </StarBorder>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative bg-background text-foreground overflow-hidden">
          <HeroGeometric
            badge="HabitVault"
            title1="Turn intention into"
            titleMiddle="action 🎯—"
          title2="one habit at a time"
          />
          {/* This content is positioned to appear towards the bottom of the HeroGeometric display */}
          <div className="container mx-auto px-4 md:px-6 text-center relative z-20 pb-16 md:pb-24 lg:pb-32 -mt-8 sm:-mt-10 md:-mt-12 lg:-mt-14 xl:-mt-16">
            <p className="mt-6 text-lg leading-8 text-muted-foreground max-w-2xl mx-auto">
              <strong>HabitVault</strong> is a simple and intuitive habit tracker that helps users build and maintain daily routines. With clean visuals, reminders, and progress tracking, it makes habit-building consistent and rewarding.
            </p>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1, ease: [0.25, 0.4, 0.25, 1] }}
              className="flex flex-wrap justify-center gap-4 mt-8"
            >
              <StarBorder
                as={Link}
                to="/signup"
                color="hsl(var(--primary))"
                className="mt-8 md:mt-10 text-lg md:text-xl rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                Get Started
              </StarBorder>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <Feature />

        {/* Blog Resources Section */}
        <Gallery6 />

        <TestimonialsSection />

        <Contact7 
          title="Get in Touch"
          description="Have questions about HabitVault? Our team is here to help you succeed on your habit-building journey."
          emailLabel="Email Support"
          emailDescription="We aim to respond to all inquiries within 24 hours."
          email="support@habitvault.com"
          officeLabel="Visit Us"
          officeDescription="Come by our office to meet the team."
          officeAddress="NRT Centre, Chilakaluripet"
          phoneLabel="Phone Support"
          phoneDescription="Available Monday through Friday, 9 AM - 6 PM PST"
          phone="+91 98765 43210"
        />
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
