import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types';
import { apiClient } from '@/services/api';
import { userApi } from '@/services/api/userApi';
import { Loader2 } from 'lucide-react';

interface AuthContextType {
  user: User | null;
  isInitializing: boolean; // <-- NEW: To track initial auth check
  login: (user: User) => void;
  logout: () => void;
  updateUserInContext: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // <-- NEW: Start in initializing state
  const { toast } = useToast();

  // This useEffect runs only once when the app starts
  useEffect(() => {
    const initializeAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken) {
        try {
          // Token exists, try to fetch the user profile
          const userProfile = await userApi.getCurrentUser();
          setUser(userProfile);
        } catch (error) {
          // Token might be expired or invalid, but apiClient will handle refresh
          console.error('Failed to initialize auth with stored token:', error);
          // Don't remove tokens here - let the apiClient handle token refresh
          // Only remove if it's a permanent failure (handled by apiClient)
        }
      }
      // Finished checking, set initializing to false
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      console.error('Server logout failed, proceeding with client cleanup:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      toast({
        title: 'Logged out',
        description: 'You have been logged out successfully.',
      });
    }
  };

  const updateUserInContext = (updatedUserData: User) => {
    setUser(updatedUserData);
  };

  // While initializing, show a global loading screen
  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isInitializing,
        login,
        logout,
        updateUserInContext,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};