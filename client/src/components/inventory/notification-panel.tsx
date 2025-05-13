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

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "product_added":
        return <Plus className="text-primary p-1 rounded-full text-sm" />;
      case "stock_updated":
        return <RefreshCcw className="text-green-500 p-1 rounded-full text-sm" />;
      case "low_stock_alert":
        return <AlertTriangle className="text-amber-500 p-1 rounded-full text-sm" />;
      case "order_placed":
        return <ShoppingCart className="text-primary p-1 rounded-full text-sm" />;
      case "order_received":
        return <TruckIcon className="text-blue-500 p-1 rounded-full text-sm" />;
      default:
        return <CheckCircle className="text-primary p-1 rounded-full text-sm" />;
    }
  };

  const getNotificationIconBackground = (type: string) => {
    switch (type) {
      case "product_added":
        return "bg-primary bg-opacity-20";
      case "stock_updated":
        return "bg-green-500 bg-opacity-20";
      case "low_stock_alert":
        return "bg-amber-500 bg-opacity-20";
      case "order_placed":
        return "bg-primary bg-opacity-20";
      case "order_received":
        return "bg-blue-500 bg-opacity-20";
      default:
        return "bg-primary bg-opacity-20";
    }
  };

  return (
    <div 
      ref={panelRef}
      className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50 max-h-[70vh] overflow-y-auto"
      aria-labelledby="notifications-heading"
    >
      <div className="px-4 py-2 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 id="notifications-heading" className="text-sm font-semibold">Notifications</h3>
          <button className="text-xs text-primary hover:text-primary-dark">Mark all as read</button>
        </div>
      </div>
      
      {notifications.length === 0 ? (
        <div className="p-4 text-center">
          <p className="text-gray-500">No notifications</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <a
            key={notification.id}
            href="#"
            className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100"
            onClick={(e) => e.preventDefault()}
          >
            <div className="flex items-start">
              <div className={cn("mr-3 flex items-center justify-center rounded-full", getNotificationIconBackground(notification.type))}>
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{notification.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p className="text-xs text-gray-500">{notification.description}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          </a>
        ))
      )}
    </div>
  );
}
