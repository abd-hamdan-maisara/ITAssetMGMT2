import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { ActivityLog as ActivityLogType } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';

interface ActivityItemProps {
  log: ActivityLogType;
}

const getIconForActivity = (itemType: string) => {
  switch (itemType) {
    case 'hardware':
      return (
        <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect width="16" height="12" x="4" y="6" rx="2" />
            <path d="M2 10h20" />
            <path d="M12 14v4" />
            <path d="M12 6V2" />
          </svg>
        </div>
      );
    case 'credential':
      return (
        <div className="h-8 w-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M2 18v3c0 .6.4 1 1 1h4v-3h3v-3h2l1.4-1.4a6.5 6.5 0 1 0-4-4Z" />
            <circle cx="16.5" cy="7.5" r=".5" />
          </svg>
        </div>
      );
    case 'network_device':
    case 'vlan':
      return (
        <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <rect x="2" y="2" width="20" height="8" rx="2" />
            <rect x="2" y="14" width="20" height="8" rx="2" />
            <path d="M6 10v4" />
            <path d="M12 10v4" />
            <path d="M18 10v4" />
          </svg>
        </div>
      );
    case 'assignment':
      return (
        <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>
      );
    default:
      return (
        <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
          >
            <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
            <path d="M18 14h-8" />
            <path d="M15 18h-5" />
            <path d="M10 6h8v4h-8V6Z" />
          </svg>
        </div>
      );
  }
};

function ActivityItem({ log }: ActivityItemProps) {
  return (
    <li className="flex items-start space-x-3 pb-3 border-b border-border">
      {getIconForActivity(log.itemType)}
      <div className="flex-1">
        <p className="font-medium">{log.details}</p>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}
        </p>
      </div>
    </li>
  );
}

export function ActivityLog() {
  const { data: activityLogs = [], isLoading, error } = useQuery<ActivityLogType[]>({
    queryKey: ['/api/activity-logs'],
    staleTime: 60000, // 1 minute
  });

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
            <div className="h-8 w-full bg-muted animate-pulse rounded" />
          </div>
        ) : error ? (
          <div className="text-center py-4 text-muted-foreground">
            Error loading activity logs
          </div>
        ) : activityLogs && activityLogs.length > 0 ? (
          <ul className="space-y-3">
            {activityLogs.slice(0, 5).map((log: ActivityLogType) => (
              <ActivityItem key={log.id} log={log} />
            ))}
          </ul>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            No recent activity
          </div>
        )}
        
        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-primary text-sm font-medium hover:underline">View all activity</button>
        </div>
      </CardContent>
    </Card>
  );
}
