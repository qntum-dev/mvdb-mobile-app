import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthState, User } from '@/interfaces/interfaces';
import { getCurrentUser, loginWithGoogle, logout } from '@/services/appwrite';

interface AuthContextType extends AuthState {
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error: any) {
      // Silently handle expected authentication errors for anonymous users
      // This is normal behavior when no user is authenticated
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      await loginWithGoogle();
      
      // For Expo Go, we need to manually check for successful auth
      // Poll for session creation since we can't capture the redirect
      const checkInterval = setInterval(async () => {
        const user = await getCurrentUser();
        if (user) {
          clearInterval(checkInterval);
          setUser(user);
          setIsAuthenticated(true);
          setIsLoading(false);
        }
      }, 1000);
      
      // Stop checking after 30 seconds
      setTimeout(() => {
        clearInterval(checkInterval);
        setIsLoading(false);
      }, 30000);
    } catch (error) {
      console.error('Google sign in error:', error);
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};