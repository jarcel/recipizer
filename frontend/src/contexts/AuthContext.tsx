import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Provider } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import AuthService, { Profile } from '../services/auth.service';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isAuthenticated: boolean;
  isPremium: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithProvider: (provider: Provider) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (profile: Partial<Profile>) => Promise<void>;
  updateEmail: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  upgradeToPremium: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user || null);

        if (session?.user) {
          try {
            // Get user profile from database
            const userProfile = await AuthService.getCurrentUserProfile();
            setProfile(userProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        } else {
          setProfile(null);
        }

        setLoading(false);
      }
    );

    // Get initial session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);

        try {
          // Get user profile from database
          const userProfile = await AuthService.getCurrentUserProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      }

      setLoading(false);
    };

    initializeAuth();

    // Cleanup subscription
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Login with email/password
  const login = async (email: string, password: string) => {
    const response = await AuthService.login(email, password);

    if (response.error) {
      throw response.error;
    }
  };

  // Login with a provider
  const loginWithProvider = async (provider: Provider) => {
    await AuthService.loginWithProvider(provider);
  };

  // Register a new user
  const register = async (email: string, password: string, name: string) => {
    const response = await AuthService.register(email, password, name);

    if (response.error) {
      throw response.error;
    }
  };

  // Logout
  const logout = async () => {
    await AuthService.logout();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    await AuthService.resetPassword(email);
  };

  // Update user profile
  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    const newProfile = await AuthService.updateProfile(updatedProfile);
    setProfile(newProfile);
  };

  // Update email
  const updateEmail = async (email: string) => {
    await AuthService.updateEmail(email);
  };

  // Update password
  const updatePassword = async (password: string) => {
    await AuthService.updatePassword(password);
  };

  // Upgrade to premium
  const upgradeToPremium = async () => {
    const newProfile = await AuthService.upgradeToPremium();
    setProfile(newProfile);
  };

  const value = {
    user,
    profile,
    isAuthenticated: !!user,
    isPremium: profile?.account_type === 'premium',
    loading,
    login,
    loginWithProvider,
    register,
    logout,
    resetPassword,
    updateProfile,
    updateEmail,
    updatePassword,
    upgradeToPremium
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading...</div>}
    </AuthContext.Provider>
  );
};