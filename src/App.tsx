import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeContextProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import AuthLayout from "@/components/auth/AuthLayout";
import AppLayout from "@/components/layout/AppLayout";
import { HabitProvider } from "@/contexts/HabitContext";
import { NotificationProvider } from '@/contexts/NotificationContext';

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import SignupPage from "@/pages/SignupPage";
import ResetPasswordPage from "@/pages/ResetPasswordPage";
import LandingPage from "@/pages/LandingPage";
import BlogListPage from "@/pages/BlogListPage";
import BlogPostPage from "@/pages/BlogPostPage";

// App Pages
import Dashboard from "@/pages/Dashboard";
import CalendarPage from "@/pages/CalendarPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ReportsPage from "@/pages/ReportsPage";
import Settings from "@/pages/Settings";
import ProfilePage from "@/pages/ProfilePage";
import HabitTrackerPage from "@/pages/HabitTrackerPage";
import ChallengesPage from "@/pages/ChallengesPage";
import NotificationsPage from "@/pages/NotificationsPage";
import NotFound from "@/pages/NotFound";
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    const handlePopState = async () => {
      console.log('Popstate event (back/forward) triggered, signing out.');
      await supabase.auth.signOut();
      // Depending on your app's structure, you might want to explicitly redirect
      // to a login or home page here, though ProtectedRoute might handle this.
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  return (
  <ThemeContextProvider>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <HabitProvider>
            <NotificationProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner position="top-right" />
                
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/blog" element={<BlogListPage />} />
                  <Route path="/blog/:articleSlug" element={<BlogPostPage />} />
                  
                  {/* Auth Routes */}
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                  </Route>
                  
                  {/* Protected App Routes */}
                  <Route 
                    element={
                      <ProtectedRoute>
                        <AppLayout />
                      </ProtectedRoute>
                    }
                  >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calendar" element={<CalendarPage />} />
                    <Route path="/analytics" element={<AnalyticsPage />} />
                    <Route path="/reports" element={<ReportsPage />} />
                    <Route path="/tracker" element={<HabitTrackerPage />} />
                    <Route path="/challenges" element={<ChallengesPage />} />
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Route>
                  
                  {/* Not Found */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </NotificationProvider>
          </HabitProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </ThemeContextProvider>
  );
};

export default App;
