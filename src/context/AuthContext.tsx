
import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: {
    theme?: "light" | "dark";
    currency?: string;
  };
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User["preferences"]>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (userData: User) => {
    setUser(userData);
    toast({
      title: "Logged in successfully",
      description: `Welcome back, ${userData.name}!`,
    });
  };

  const logout = () => {
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
    });
  };

  const updateUserPreferences = (preferences: Partial<User["preferences"]>) => {
    if (user) {
      setUser({
        ...user,
        preferences: {
          ...user.preferences,
          ...preferences,
        },
      });
      toast({
        title: "Preferences updated",
        description: "Your profile preferences have been updated.",
      });
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUserPreferences }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
