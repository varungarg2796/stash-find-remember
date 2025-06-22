import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { useAuth } from '@/context/AuthContext';
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
  FolderOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // The login logic is now handled by the AuthCallback page, so this can be simplified.
  const handleLoginRedirect = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const navigationItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/my-stash', label: 'My Stash', icon: <Box className="h-4 w-4 mr-2" /> },
    { path: '/collections', label: 'Collections', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
    { path: '/about', label: 'About', icon: <Info className="h-4 w-4 mr-2" /> },
  ];

  return (
    <header className="py-3 px-4 border-b relative">
      <div className="flex items-center">
        {/* Mobile Menu Trigger */}
        <div className="md:hidden flex-shrink-0">
          <Button variant="ghost" size="sm" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mr-2 p-2">
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex flex-1 justify-start">
          <NavigationMenu>
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.path}>
                  {/* --- THIS IS THE FIX --- */}
                  <Link to={item.path}>
                    <NavigationMenuLink
                      active={location.pathname === item.path}
                      className={navigationMenuTriggerStyle()}
                    >
                      {item.icon} {item.label}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        
        {/* Logo */}
        <div className="flex-1 md:flex-none flex justify-center items-center min-w-0">
            <Link to="/" className="flex items-center gap-2">
              <img src="/stasher-logo.svg" alt="Stasher Logo" className="h-8 w-8" />
              <span className="font-bold text-xl">Stasher</span>
            </Link>
        </div>
        
        {/* User Menu */}
        <div className="flex flex-1 justify-end">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <p className="font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild><Link to="/profile"><Settings className="mr-2 h-4 w-4" /> Profile</Link></DropdownMenuItem>
                <DropdownMenuItem asChild><Link to="/archive"><Archive className="mr-2 h-4 w-4" /> Archive</Link></DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={handleLoginRedirect} size="sm">Login</Button>
          )}
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-background border-b shadow-md md:hidden">
          <nav className="p-4 flex flex-col gap-1">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn("flex items-center p-2 rounded-md hover:bg-accent", location.pathname === item.path && "bg-accent")}
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