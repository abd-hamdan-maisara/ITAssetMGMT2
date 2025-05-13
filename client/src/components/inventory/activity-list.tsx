import { Activity, ActivityTypes } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { 
  CheckCircle, 
  AlertTriangle, 
  ShoppingCart, 
  TruckIcon, 
  Plus, 
  RefreshCcw, 
  LogIn, 
  LogOut, 
  Users, 
  Wifi, 
  Key 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case ActivityTypes.HARDWARE_ADDED:
        return <Plus className="text-primary p-1 rounded-full text-sm" />;
      case ActivityTypes.HARDWARE_UPDATED:
        return <RefreshCcw className="text-green-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.HARDWARE_RETIRED:
        return <AlertTriangle className="text-amber-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.REQUEST_CREATED:
        return <ShoppingCart className="text-primary p-1 rounded-full text-sm" />;
      case ActivityTypes.REQUEST_RESOLVED:
        return <TruckIcon className="text-blue-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.USER_LOGIN:
        return <LogIn className="text-green-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.USER_LOGOUT:
        return <LogOut className="text-blue-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.ASSIGNMENT_CREATED:
        return <Users className="text-indigo-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.NETWORK_DEVICE_ADDED:
        return <Wifi className="text-purple-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.CREDENTIAL_ADDED:
        return <Key className="text-amber-500 p-1 rounded-full text-sm" />;
      default:
        return <CheckCircle className="text-primary p-1 rounded-full text-sm" />;
    }
  };

  const getActivityIconBackground = (type: string) => {
    switch (type) {
      case ActivityTypes.HARDWARE_ADDED:
      case ActivityTypes.HARDWARE_UPDATED:
        return "bg-primary bg-opacity-20";
      case ActivityTypes.USER_LOGIN:
      case ActivityTypes.USER_LOGOUT:
        return "bg-green-500 bg-opacity-20";
      case ActivityTypes.HARDWARE_RETIRED:
      case ActivityTypes.CREDENTIAL_ADDED:
        return "bg-amber-500 bg-opacity-20";
      case ActivityTypes.REQUEST_CREATED:
        return "bg-primary bg-opacity-20";
      case ActivityTypes.REQUEST_RESOLVED:
        return "bg-blue-500 bg-opacity-20";
      case ActivityTypes.ASSIGNMENT_CREATED:
        return "bg-indigo-500 bg-opacity-20";
      case ActivityTypes.NETWORK_DEVICE_ADDED:
        return "bg-purple-500 bg-opacity-20";
      default:
        return "bg-primary bg-opacity-20";
    }
  };

  const formatTimeAgo = (date: Date | string) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  if (activities.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500">No recent activities</p>
      </div>
    );
  }

  return (
    <ul className="divide-y divide-gray-200">
      {activities.map((activity) => (
        <li key={activity.id} className="px-4 py-3">
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className={cn("flex items-center justify-center rounded-full", getActivityIconBackground(activity.action))}>
                {getActivityIcon(activity.action)}
              </div>
            </div>
            <div>
              <p className="text-sm">
                {activity.details && typeof activity.details === 'object' 
                  ? JSON.stringify(activity.details) 
                  : `Activity: ${activity.action}`}
              </p>
              <p className="text-xs text-gray-500">
                {activity.createdAt ? formatTimeAgo(activity.createdAt) : 'Recently'}
              </p>
            </div>
          </div>
        </li>
      ))}
      <div className="px-4 py-3 text-center border-t border-gray-200">
        <button className="text-sm text-primary hover:text-primary-dark">View All Activities</button>
      </div>
    </ul>
  );
}
