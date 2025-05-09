
import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/components/ui/use-toast";
import { UserPreferences } from "@/types";

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  preferences?: UserPreferences;
}

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<UserPreferences>) => void;
  addLocation: (location: string) => void;
  removeLocation: (location: string) => void;
  addTag: (tag: string) => void;
  removeTag: (tag: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = (userData: User) => {
    // Initialize preferences if not present
    if (!userData.preferences) {
      userData.preferences = {
        theme: "light",
        currency: "USD",
        locations: ["Wardrobe", "Kitchen", "Bookshelf", "Drawer"],
        tags: ["Clothing", "Book", "Electronics", "Furniture"]
      };
    }
    
    if (!userData.preferences.locations) {
      userData.preferences.locations = ["Wardrobe", "Kitchen", "Bookshelf", "Drawer"];
    }

    if (!userData.preferences.tags) {
      userData.preferences.tags = ["Clothing", "Book", "Electronics", "Furniture"];
    }
    
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

  const updateUserPreferences = (preferences: Partial<UserPreferences>) => {
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

  const addLocation = (location: string) => {
    if (user && user.preferences) {
      // Check if locations exist, initialize if not
      const currentLocations = user.preferences.locations || [];
      
      // Check if we already have the maximum number of locations
      if (currentLocations.length >= 20) {
        toast({
          title: "Too many locations",
          description: "You can have a maximum of 20 locations.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if location already exists
      if (currentLocations.includes(location)) {
        toast({
          title: "Location already exists",
          description: `${location} is already in your list.`,
          variant: "destructive"
        });
        return;
      }
      
      // Add the new location
      const updatedLocations = [...currentLocations, location];
      
      updateUserPreferences({
        locations: updatedLocations
      });
    }
  };

  const removeLocation = (location: string) => {
    if (user && user.preferences && user.preferences.locations) {
      const updatedLocations = user.preferences.locations.filter(loc => loc !== location);
      
      updateUserPreferences({
        locations: updatedLocations
      });
    }
  };
  
  const addTag = (tag: string) => {
    if (user && user.preferences) {
      // Check if tags exist, initialize if not
      const currentTags = user.preferences.tags || [];
      
      // Check if we already have the maximum number of tags
      if (currentTags.length >= 20) {
        toast({
          title: "Too many tags",
          description: "You can have a maximum of 20 common tags.",
          variant: "destructive"
        });
        return;
      }
      
      // Check if tag already exists
      if (currentTags.includes(tag)) {
        toast({
          title: "Tag already exists",
          description: `${tag} is already in your list.`,
          variant: "destructive"
        });
        return;
      }
      
      // Add the new tag
      const updatedTags = [...currentTags, tag];
      
      updateUserPreferences({
        tags: updatedTags
      });
    }
  };

  const removeTag = (tag: string) => {
    if (user && user.preferences && user.preferences.tags) {
      const updatedTags = user.preferences.tags.filter(t => t !== tag);
      
      updateUserPreferences({
        tags: updatedTags
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        login, 
        logout, 
        updateUserPreferences,
        addLocation,
        removeLocation,
        addTag,
        removeTag
      }}
    >
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
