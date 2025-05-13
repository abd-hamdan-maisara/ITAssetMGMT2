import { useQuery } from "@tanstack/react-query";
import { Activity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { CheckCircle, AlertTriangle, ShoppingCart, TruckIcon, Plus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useRef } from "react";

interface NotificationPanelProps {
  onClose: () => void;
}

export function NotificationPanel({ onClose }: NotificationPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: notifications = [] } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/activities?limit=5');
      return response.json();
    },
  });

  // Handle click outside to close panel
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const getNotificationIcon = (action: string) => {
    switch (action) {
      case "hardware_added":
        return <Plus className="text-primary p-1 rounded-full text-sm" />;
      case "hardware_updated":
        return <RefreshCcw className="text-green-500 p-1 rounded-full text-sm" />;
      case "low_stock_alert":
        return <AlertTriangle className="text-amber-500 p-1 rounded-full text-sm" />;
      case "assignment_created":
        return <ShoppingCart className="text-primary p-1 rounded-full text-sm" />;
      case "assignment_completed":
        return <TruckIcon className="text-blue-500 p-1 rounded-full text-sm" />;
      case "network_device_added":
        return <Plus className="text-primary p-1 rounded-full text-sm" />;
      case "user_login":
        return <CheckCircle className="text-green-500 p-1 rounded-full text-sm" />;
      default:
        return <CheckCircle className="text-primary p-1 rounded-full text-sm" />;
    }
  };

  const getNotificationIconBackground = (action: string) => {
    switch (action) {
      case "hardware_added":
        return "bg-primary bg-opacity-20";
      case "hardware_updated":
        return "bg-green-500 bg-opacity-20";
      case "low_stock_alert":
        return "bg-amber-500 bg-opacity-20";
      case "assignment_created":
        return "bg-primary bg-opacity-20";
      case "assignment_completed":
        return "bg-blue-500 bg-opacity-20";
      case "network_device_added":
        return "bg-primary bg-opacity-20";
      case "user_login":
        return "bg-green-500 bg-opacity-20";
      default:
        return "bg-primary bg-opacity-20";
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 bg-card text-card-foreground rounded-md shadow-lg py-1 z-50 max-h-[70vh] overflow-y-auto border border-border"
      aria-labelledby="notifications-heading"
    >
      <div className="px-4 py-2 border-b border-border">
        <div className="flex justify-between items-center">
          <h3 id="notifications-heading" className="text-sm font-semibold">Notifications</h3>
          <button className="text-xs text-primary hover:text-primary/80">Mark all as read</button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">No notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <a
            key={notification.id}
            href="#"
            className="block px-4 py-3 hover:bg-muted/50 border-b border-border"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex items-start">
              <div className={cn("mr-3 flex items-center justify-center rounded-full", getNotificationIconBackground(notification.action))}>
                {getNotificationIcon(notification.action)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.action ? notification.action.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) : 'Activity'}</p>
                <p className="text-xs text-muted-foreground">{notification.details ? JSON.stringify(notification.details) : notification.entityType}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  {notification.createdAt ? formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true }) : 'Recently'}
                </p>
              </div>
            </div>
          </a>
        ))
      )}
    </div>
  );
}
