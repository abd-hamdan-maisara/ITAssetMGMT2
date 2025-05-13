import { Activity, ActivityTypes } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle, AlertTriangle, ShoppingCart, TruckIcon, Plus, RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityListProps {
  activities: Activity[];
}

export function ActivityList({ activities }: ActivityListProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case ActivityTypes.PRODUCT_ADDED:
        return <Plus className="text-primary p-1 rounded-full text-sm" />;
      case ActivityTypes.STOCK_UPDATED:
        return <RefreshCcw className="text-green-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.LOW_STOCK_ALERT:
        return <AlertTriangle className="text-amber-500 p-1 rounded-full text-sm" />;
      case ActivityTypes.ORDER_PLACED:
        return <ShoppingCart className="text-primary p-1 rounded-full text-sm" />;
      case ActivityTypes.ORDER_RECEIVED:
        return <TruckIcon className="text-blue-500 p-1 rounded-full text-sm" />;
      default:
        return <CheckCircle className="text-primary p-1 rounded-full text-sm" />;
    }
  };

  const getActivityIconBackground = (type: string) => {
    switch (type) {
      case ActivityTypes.PRODUCT_ADDED:
        return "bg-primary bg-opacity-20";
      case ActivityTypes.STOCK_UPDATED:
        return "bg-green-500 bg-opacity-20";
      case ActivityTypes.LOW_STOCK_ALERT:
        return "bg-amber-500 bg-opacity-20";
      case ActivityTypes.ORDER_PLACED:
        return "bg-primary bg-opacity-20";
      case ActivityTypes.ORDER_RECEIVED:
        return "bg-blue-500 bg-opacity-20";
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
              <div className={cn("flex items-center justify-center rounded-full", getActivityIconBackground(activity.type))}>
                {getActivityIcon(activity.type)}
              </div>
            </div>
            <div>
              <p className="text-sm">{activity.description}</p>
              <p className="text-xs text-gray-500">{formatTimeAgo(activity.createdAt)}</p>
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
