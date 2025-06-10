
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
  Menu,
  Info,
  Share,
  FolderOpen
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
    { path: "/my-stash", label: "My Stash", icon: <Box className="h-4 w-4 mr-2" /> },
    { path: "/collections", label: "Collections", icon: <FolderOpen className="h-4 w-4 mr-2" /> },
    { path: "/about", label: "About", icon: <Info className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="py-3 px-4 flex items-center border-b relative">
      {/* Mobile Menu Trigger - Left Side */}
      <div className="md:hidden">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="mr-2 p-2"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* Navigation - Left Side - Reduced padding and spacing */}
      <div className="hidden md:block flex-shrink-0">
        <NavigationMenu>
          <NavigationMenuList className="gap-0.5">
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.path + item.label}>
                <Link to={item.path}>
                  <NavigationMenuLink 
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "px-1.5 py-1 text-xs h-auto min-w-0",
                      location.pathname === item.path && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="hidden lg:block mr-1">{item.icon}</span>
                    <span className="truncate">{item.label}</span>
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Logo & Tagline - Center - Better responsive handling */}
      <div className="flex-1 flex justify-center items-center min-w-0">
        <div className="flex flex-col items-center justify-center">
          <Link to="/" className="flex items-center gap-2">
            <img 
              src="/stasher-logo.svg" 
              alt="Stasher Logo" 
              className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
            <span className="font-bold text-lg sm:text-xl truncate">Stasher</span>
          </Link>
          <span className="text-xs text-muted-foreground hidden sm:block text-center">Organize your belongings with ease</span>
        </div>
      </div>

      {/* User Menu - Right Side - Flex shrink to prevent overflow */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative rounded-full h-8 w-8 p-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name ? user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center justify-start gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>{user.name ? user.name.split(' ').map(n => n.charAt(0)).join('').toUpperCase() : "U"}</AvatarFallback>
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
              <DropdownMenuItem asChild>
                <Link to="/ask" className="cursor-pointer flex w-full items-center">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  <span>Ask Stasher</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/bulk-import" className="cursor-pointer flex w-full items-center">
                  <FileText className="mr-2 h-4 w-4" />
                  <span>Bulk Import</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/archive" className="cursor-pointer flex w-full items-center">
                  <Archive className="mr-2 h-4 w-4" />
                  <span>Archive</span>
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
            className="px-2 py-1 text-xs sm:px-3 sm:py-1.5 sm:text-sm"
          >
            {isLoggingIn ? "Logging in..." : "Login"}
            {!isLoggingIn && <User className="ml-1 h-3 w-3 sm:ml-2 sm:h-4 sm:w-4" />}
          </Button>
        )}
      </div>

      {/* Mobile Navigation Menu - Slide down from top */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white z-50 border-b shadow-md md:hidden">
          <nav className="p-4 flex flex-col gap-2">
            {navigationItems.map((item) => (
              <Link 
                key={item.path + item.label} 
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
