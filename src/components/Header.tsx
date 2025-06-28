import { useState, useEffect, useRef } from 'react';
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
  X,
  Info,
  FolderOpen,
  BarChart3,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setMobileMenuOpen(false);
      }
    };

    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // The login logic is now handled by the AuthCallback page, so this can be simplified.
  const handleLoginRedirect = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`;
  };

  const primaryNavigationItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4 mr-2" /> },
    { path: '/my-stash', label: 'My Stash', icon: <Box className="h-4 w-4 mr-2" /> },
    { path: '/collections', label: 'Collections', icon: <FolderOpen className="h-4 w-4 mr-2" /> },
    { path: '/ask', label: 'Ask Stasher', icon: <MessageSquare className="h-4 w-4 mr-2" /> },
  ];

  const secondaryNavigationItems = [
    { path: '/profile', label: 'Profile & Settings', icon: <Settings className="h-4 w-4 mr-2" /> },
    { path: '/add-item', label: 'Add Item', icon: <Plus className="h-4 w-4 mr-2" /> },
    { path: '/archive', label: 'Archive', icon: <Archive className="h-4 w-4 mr-2" /> },
    { path: '/stats', label: 'Stats', icon: <BarChart3 className="h-4 w-4 mr-2" /> },
    { path: '/about', label: 'About', icon: <Info className="h-4 w-4 mr-2" /> },
  ];

  return (
    <>
      <header className="py-3 px-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="relative flex items-center justify-between max-w-full">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="p-2"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex flex-1 justify-start">
            <NavigationMenu>
              <NavigationMenuList>
                {primaryNavigationItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink
                      asChild
                      active={location.pathname === item.path}
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link to={item.path}>
                        {item.icon} {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Tablet Navigation - Condensed */}
          <div className="hidden md:flex lg:hidden flex-1 justify-start">
            <NavigationMenu>
              <NavigationMenuList>
                {primaryNavigationItems.slice(0, 3).map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuLink
                      asChild
                      active={location.pathname === item.path}
                      className={navigationMenuTriggerStyle()}
                    >
                      <Link to={item.path}>
                        {item.icon} {item.label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          
          {/* Logo - Absolutely centered on all screen sizes */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <Link to="/" className="flex items-center gap-2 min-w-0">
                <img src="/stasher-logo.svg" alt="Stasher Logo" className="h-8 w-8 flex-shrink-0" />
                <span className="font-bold text-xl truncate">Stasher</span>
              </Link>
          </div>
          
          {/* User Menu & Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {user ? (
              <>
                {/* Quick Actions - Desktop Only */}
                <div className="hidden lg:flex items-center gap-1">
                  <Button asChild variant="outline" size="sm">
                    <Link to="/add-item">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Item
                    </Link>
                  </Button>
                  <Button asChild variant="ghost" size="sm" title="Profile & Settings">
                    <Link to="/profile">
                      <Settings className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>

                {/* User Avatar & Menu */}
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
                    <DropdownMenuItem asChild>
                      <Link to="/profile">
                        <Settings className="mr-2 h-4 w-4" /> 
                        Profile & Settings
                        <span className="ml-auto text-xs text-muted-foreground">Tags, Locations</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/archive">
                        <Archive className="mr-2 h-4 w-4" /> 
                        Archive
                        <span className="ml-auto text-xs text-muted-foreground">Archived Items</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600"><LogOut className="mr-2 h-4 w-4" /> Log out</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button onClick={handleLoginRedirect} size="sm">Login</Button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" aria-hidden="true" />
          
          {/* Mobile Menu */}
          <div 
            ref={mobileMenuRef}
            className="fixed top-[73px] left-0 right-0 bg-background border-b shadow-lg z-50 lg:hidden max-h-[calc(100vh-73px)] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation menu"
          >
            <nav className="p-4">
              {user && (
                <>
                  {/* User Info Section */}
                  <div className="mb-4 p-3 bg-accent/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatarUrl} alt={user.name} />
                        <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{user.name}</p>
                        <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link to="/add-item" onClick={() => setMobileMenuOpen(false)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Item
                        </Link>
                      </Button>
                      <Button asChild variant="outline" size="sm" className="justify-start">
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Settings className="h-4 w-4 mr-2" />
                          <div className="flex flex-col items-start">
                            <span>Settings</span>
                            <span className="text-xs text-muted-foreground">Tags & Locations</span>
                          </div>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {/* Primary Navigation */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">Navigation</h3>
                <div className="flex flex-col gap-1">
                  {primaryNavigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={cn(
                        "flex items-center p-3 rounded-lg hover:bg-accent transition-colors",
                        location.pathname === item.path && "bg-accent font-medium"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Secondary Navigation */}
              {user && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-muted-foreground mb-2 px-3">More</h3>
                  <div className="flex flex-col gap-1">
                    {secondaryNavigationItems.filter(item => !['Profile & Settings', 'Add Item'].includes(item.label)).map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={cn(
                          "flex items-center p-3 rounded-lg hover:bg-accent transition-colors",
                          location.pathname === item.path && "bg-accent font-medium"
                        )}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Logout */}
              {user && (
                <div className="pt-4 border-t">
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              )}
            </nav>
          </div>
        </>
      )}
    </>
  );
};

export default Header;