import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { signIn, signUp, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';
import { apiService } from '../services/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await getCurrentUser();
      const session = await fetchAuthSession();
      
      if (session.tokens?.accessToken && currentUser) {
        // Try to get cached user first
        const cachedUser = await AsyncStorage.getItem('user');
        if (cachedUser) {
          setUser(JSON.parse(cachedUser));
        }

        // Fetch fresh user data
        const userResponse = await apiService.getUser(currentUser.userId);
        if (userResponse.success && userResponse.data) {
          setUser(userResponse.data);
          await AsyncStorage.setItem('user', JSON.stringify(userResponse.data));
        }
      }
    } catch (error) {
      console.log('No authenticated user', error);
      setUser(null);
      await AsyncStorage.removeItem('user');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const handleSignIn = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      const { isSignedIn } = await signIn({ username, password });
      
      if (isSignedIn) {
        await checkAuthStatus();
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Failed to sign in');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (
    username: string,
    email: string,
    password: string,
    displayName: string
  ) => {
    try {
      setIsLoading(true);
      
      await signUp({
        username,
        password,
        options: {
          userAttributes: {
            email,
            preferred_username: username,
            name: displayName,
          },
        },
      });

      await apiService.createUser({
        email,
        username,
        displayName,
      });
    } catch (error: any) {
      console.error('Sign up error:', error);
      throw new Error(error.message || 'Failed to sign up');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      await AsyncStorage.removeItem('user');
    } catch (error: any) {
      console.error('Sign out error:', error);
      throw new Error(error.message || 'Failed to sign out');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signOut: handleSignOut,
    isAuthenticated: !!user,
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