import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { getItem, setItem, removeItem } from '@/lib/local-storage';
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
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
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
          return;
        }

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
      setIsLoading(false);
    });

    // Check initial session on mount
    // This replaces the previous localStorage check for a more robust session handling
    const checkInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Manually trigger a 'SIGNED_IN' like flow if session exists
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          toast.error(`Error fetching initial profile: ${profileError.message}`);
          await supabase.auth.signOut(); // Sign out if profile fetch fails
        } else {
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
        }
      }
      setIsLoading(false);
    };

    checkInitialSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      // Fetch profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();
      if (profileError) throw profileError;
      const userObj = {
        id: data.user.id,
        email: data.user.email,
        name: profileData.name,
        createdAt: data.user.created_at,
      };
      setUser(userObj);
      setItem('user', userObj);
      setItem('auth_token', data.session.access_token);
      toast.success('Logged in successfully');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(`Login failed: ${error.message || 'An error occurred'}`);
      throw error;
    } finally {
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
    // setUser(null); // Handled by onAuthStateChange
    // removeItem('user'); // Handled by onAuthStateChange
    // removeItem('auth_token'); // Handled by onAuthStateChange
    // removeItem('refresh_token'); // Handled by onAuthStateChange
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
