import { useState } from "react";
import { Menu, Search, Bell, ChevronDown, ChevronUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NotificationPanel } from "@/components/inventory/notification-panel";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ sidebarOpen, setSidebarOpen }: HeaderProps) {
  const [location] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [notificationCount] = useState(3);

  const getPageTitle = () => {
    switch (location) {
      case "/":
        return "Dashboard";
      case "/products":
        return "All Products";
      case "/categories":
        return "Categories";
      case "/orders":
        return "Orders";
      case "/suppliers":
        return "Suppliers";
      case "/reports":
        return "Reports";
      case "/settings":
        return "Settings";
      default:
        return "Dashboard";
    }
  };

  return (
    <header className="bg-primary text-primary-foreground border-b border-primary/20 z-10">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)} 
              className="lg:hidden text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
              aria-label={sidebarOpen ? "Close sidebar menu" : "Open sidebar menu"}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle sidebar</span>
            </Button>
            <h1 className="ml-2 text-lg font-medium md:block">{getPageTitle()}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative hidden md:block">
              <Input 
                type="text" 
                placeholder="Search inventory..." 
                className="w-64 pl-10"
                aria-label="Search inventory"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowNotifications(!showNotifications)} 
                className="relative text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                aria-label="Notifications"
                aria-expanded={showNotifications}
                aria-haspopup="true"
              >
                <Bell className="h-5 w-5" />
                {notificationCount > 0 && (
                  <span 
                    className="absolute top-0 right-0 h-4 w-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full"
                    aria-label={`${notificationCount} unread notifications`}
                  >
                    {notificationCount}
                  </span>
                )}
              </Button>
              
              {/* Notification Panel */}
              {showNotifications && (
                <NotificationPanel 
                  onClose={() => setShowNotifications(false)} 
                />
              )}
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)} 
                className="flex items-center space-x-1"
                aria-label="User menu"
                aria-expanded={showUserMenu}
                aria-haspopup="true"
              >
                <Avatar className="h-8 w-8 mr-2">
                  <AvatarImage src="https://github.com/shadcn.png" alt="User profile" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm">System Admin</span>
                {showUserMenu ? (
                  <ChevronUp className="h-4 w-4 text-gray-600" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-600" />
                )}
              </Button>
              
              {/* User Dropdown */}
              {showUserMenu && (
                <div 
                  className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg py-1 z-50"
                  onClick={() => setShowUserMenu(false)}
                >
                  <a href="/profile" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Your Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    System Settings
                  </a>
                  <a href="/activity-log" className="block px-4 py-2 text-sm text-foreground hover:bg-muted">
                    Activity Log
                  </a>
                  <div className="border-t border-border my-1"></div>
                  <a href="/auth" className="block px-4 py-2 text-sm text-destructive hover:bg-destructive/10">
                    Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
