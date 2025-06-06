import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getItem, setItem, removeItem, clearAllData } from '@/lib/local-storage';
import { supabase } from '@/integrations/supabase/client';

// Types
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create context
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  // Supabase auth state change listener
  useEffect(() => {
    setIsLoading(true);
    let didCancel = false;
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (event === 'SIGNED_IN' && session) {
          console.log('[AuthContext] onAuthStateChange: SIGNED_IN event received. Session:', session);
          // Fetch profile data when user signs in
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            toast.error(`Error fetching profile: ${profileError.message}`);
            // Potentially sign out user if profile is essential and not found
            await supabase.auth.signOut();
            setUser(null);
            removeItem('user');
            removeItem('auth_token');
            removeItem('refresh_token');
            setIsLoading(false);
            console.error('[AuthContext] onAuthStateChange SIGNED_IN: Error fetching profile:', profileError);
            return;
          }
          console.log('[AuthContext] onAuthStateChange SIGNED_IN: Profile fetched:', profileData);

          const userObj: User = {
            id: session.user.id,
            email: session.user.email!,
            name: profileData?.name || session.user.email?.split('@')[0],
            createdAt: session.user.created_at,
          };
          setUser(userObj);
          console.log('[AuthContext] onAuthStateChange SIGNED_IN: User state set:', userObj);
          setItem('user', userObj);
          console.log('[AuthContext] onAuthStateChange SIGNED_IN: User set in localStorage.');
          setItem('auth_token', session.access_token);
          console.log('[AuthContext] onAuthStateChange SIGNED_IN: Auth token set in localStorage.');
          setItem('refresh_token', session.refresh_token);
          console.log('[AuthContext] onAuthStateChange SIGNED_IN: Refresh token set in localStorage.');
          // Optional: navigate('/dashboard') or let ProtectedRoute handle it
        } else if (event === 'SIGNED_OUT') {
          console.log('[AuthContext] onAuthStateChange: SIGNED_OUT event received.');
          setUser(prevUser => {
            console.log('[AuthContext] SIGNED_OUT: Current user state before setting to null:', prevUser);
            return null;
          });
          removeItem('user');
          console.log('[AuthContext] SIGNED_OUT: Removed user from localStorage.');
          removeItem('auth_token');
          console.log('[AuthContext] SIGNED_OUT: Removed auth_token from localStorage.');
          removeItem('refresh_token');
          console.log('[AuthContext] SIGNED_OUT: Removed refresh_token from localStorage.');
          // navigate('/login'); // Navigation on logout is handled by the logout function or ProtectedRoute
          console.log('[AuthContext] SIGNED_OUT: Auth state processed. User should be null.');
        } else if (event === 'TOKEN_REFRESHED' && session) {
          setItem('auth_token', session.access_token);
          setItem('refresh_token', session.refresh_token);
          // Potentially re-fetch user profile if it can change and needs to be fresh
          const storedUser = getItem<User | null>('user', null);
          if (storedUser && storedUser.id === session.user.id) {
            setUser(storedUser); // Keep existing user data, token is updated
          } else {
            // If no user or different user, treat as sign in to fetch profile
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();
            if (profileError) {
              toast.error(`Error fetching profile on token refresh: ${profileError.message}`);
            } else {
              const userObj: User = {
                id: session.user.id,
                email: session.user.email!,
                name: profileData?.name || session.user.email?.split('@')[0],
                createdAt: session.user.created_at,
              };
              setUser(userObj);
              setItem('user', userObj);
            }
          }
        }
        if (!didCancel) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] onAuthStateChange: Unexpected error:', err);
        if (!didCancel) {
          setIsLoading(false);
        }
      }
    });

    // Check initial session on mount
    const checkInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          console.log('[AuthContext] checkInitialSession: Session found:', session);
          // Manually trigger a 'SIGNED_IN' like flow if session exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            toast.error(`Error fetching initial profile: ${profileError.message}`);
            console.error('[AuthContext] checkInitialSession: Error fetching initial profile:', profileError);
            await supabase.auth.signOut(); // Sign out if profile fetch fails
          } else {
            console.log('[AuthContext] checkInitialSession: Initial profile fetched:', profileData);
            const userObj: User = {
              id: session.user.id,
              email: session.user.email!,
              name: profileData?.name || session.user.email?.split('@')[0],
              createdAt: session.user.created_at,
            };
            setUser(userObj);
            setItem('user', userObj);
            setItem('auth_token', session.access_token);
            setItem('refresh_token', session.refresh_token);
            console.log('[AuthContext] checkInitialSession: User and tokens set from initial session.');
          }
        }
        if (!didCancel) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error('[AuthContext] checkInitialSession: Unexpected error:', err);
        if (!didCancel) {
          setIsLoading(false);
        }
      }
    };

    checkInitialSession();

    return () => {
      didCancel = true;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    console.log('[AuthContext] login: Called with email:', email);
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('[AuthContext] login: supabase.auth.signInWithPassword error:', error);
        throw error;
      }
      console.log('[AuthContext] login: supabase.auth.signInWithPassword successful. User data from Supabase:', data.user);
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) {
        console.error('[AuthContext] login: Error fetching profile:', profileError);
        throw profileError;
      }
      console.log('[AuthContext] login: Profile fetched successfully:', profileData);
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: profileData.name,
        createdAt: data.user.created_at,
      };
      setUser(userObj);
      setItem('user', userObj);
      setItem('auth_token', data.session.access_token);
      console.log('[AuthContext] login: User object created and set in state & localStorage:', userObj);
      toast.success('Logged in successfully');
      navigate('/dashboard');
      console.log('[AuthContext] login: Navigated to /dashboard.');
    } catch (error: any) {
      console.error('[AuthContext] login: Catch block error:', error);
      toast.error(`Login failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      console.log('[AuthContext] login: Finally block reached. Setting isLoading to false.');
      setIsLoading(false);
    }
  };

  // Signup function
  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    try {
      // 1. Sign up user with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) throw error;
      // 2. Create profile in 'profiles' table
      const user = data.user;
      if (user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: name || user.email?.split('@')[0],
          });
        if (profileError) throw profileError;
      }
      toast.success('Account created successfully. Please check your email to confirm your account.');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Signup failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    console.log('[AuthContext] logout: Called');
    setIsLoading(true);
    const { error } = await supabase.auth.signOut();
    // The onAuthStateChange listener will handle clearing user state and localStorage
    // for SIGNED_OUT event. We just need to ensure navigation and toast.
    if (error) {
      console.error('[AuthContext] logout: supabase.auth.signOut() error:', error);
      toast.error(`Logout failed: ${error.message}`);
    } else {
      console.log('[AuthContext] logout: supabase.auth.signOut() successful. Waiting for onAuthStateChange SIGNED_OUT.');
      toast.info('Logged out successfully');
    }
    // Extra cleanup: clear all HabitVault-related data from localStorage
    clearAllData();
    // Debug: Check if session is really gone
    const { data: { session } } = await supabase.auth.getSession();
    console.log('[AuthContext] logout: Session after signOut:', session);
    if (session) {
      console.warn('[AuthContext] logout: Session still exists after signOut! Forcing reload.');
      window.location.reload();
      return;
    }
    navigate('/login'); // Explicit navigation after logout action
    console.log('[AuthContext] logout: Navigated to /login');
    setIsLoading(false);
  };

  // Reset password function
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      toast.success('Password reset email sent');
    } catch (error: any) {
      toast.error(`Password reset failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Update profile function
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('No user');
      const { error } = await supabase
        .from('profiles')
        .update({ name: data.name, email: data.email })
        .eq('id', user.id);
      if (error) throw error;
      const updatedUser = { ...user, ...data } as User;
      setItem('user', updatedUser);
      setUser(updatedUser);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(`Profile update failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user, // Log this value when it changes or is accessed
        isLoading,
        login,
        signup,
        logout,
        resetPassword,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);
