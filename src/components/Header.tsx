
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  LogOut, 
  Settings, 
  Box, 
  Home,
  MessageSquare,
  FileText,
  Archive,
  Menu
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  const handleLogin = () => {
    setIsLoggingIn(true);
    // Simulate login process
    setTimeout(() => {
      login({
        id: "user-1",
        name: "John Doe",
        email: "john@example.com",
        avatarUrl: "https://i.pravatar.cc/150?u=user-1"
      });
      setIsLoggingIn(false);
    }, 800);
  };

  const navigationItems = [
    { path: "/", label: "Home", icon: <Home className="h-4 w-4 mr-2" /> },
    { path: "/ask", label: "Ask Stasher", icon: <MessageSquare className="h-4 w-4 mr-2" /> },
    { path: "/bulk-import", label: "Bulk Import", icon: <FileText className="h-4 w-4 mr-2" /> },
    { path: "/archive", label: "Archive", icon: <Archive className="h-4 w-4 mr-2" /> }
  ];

  return (
    <header className="py-4 px-4 flex items-center border-b">
      {/* Mobile Menu Trigger - Left Side */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mr-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation - Left Side */}
      <div className="hidden md:block">
        <NavigationMenu>
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link to={item.path}>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    {item.icon}
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Logo & Tagline - Center */}
      <div className="flex flex-col items-center justify-center mx-auto">
        <Link to="/" className="flex items-center gap-2">
          <img 
            src="/stasher-logo.svg" 
            alt="Stasher Logo" 
            className="h-8 w-8"
            onError={(e) => {
              e.currentTarget.src = "/placeholder.svg";
            }}
          />
          <span className="font-bold text-xl">Stasher</span>
        </Link>
        <span className="text-xs text-muted-foreground hidden sm:block">Organize your belongings with ease</span>
      </div>

      {/* User Menu - Right Side (Always) */}
      <div className="flex items-center gap-4 ml-auto">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">{user.name}</p>
                  <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/profile" className="cursor-pointer flex w-full items-center">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button 
            onClick={handleLogin} 
            variant="default" 
            size="sm"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Logging in..." : "Login"}
            {!isLoggingIn && <User className="ml-2 h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Mobile Navigation Menu - Slide down from top */}
      {mobileMenuOpen && (
        <div className="absolute top-16 left-0 right-0 bg-white z-50 border-b shadow-md md:hidden">
          <nav className="p-4 flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path} 
                className={cn(
                  "flex items-center p-2 rounded-md hover:bg-accent",
                  location.pathname === item.path && "bg-accent text-accent-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
