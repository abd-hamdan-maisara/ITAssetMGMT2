import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'wouter';
import { formatDistanceToNow } from 'date-fns';
import { Hardware } from '@shared/schema';

interface DashboardStatsProps {
  title: string;
  isLoading: boolean;
  items: any[];
  viewAllLink: string;
}

export function DashboardStats({ title, isLoading, items, viewAllLink }: DashboardStatsProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case 'laptop':
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
              <rect width="18" height="12" x="3" y="4" rx="2" ry="2"></rect>
              <line x1="2" x2="22" y1="20" y2="20"></line>
            </svg>
          </div>
        );
      case 'desktop':
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
              <rect width="20" height="14" x="2" y="3" rx="2"></rect>
              <line x1="8" x2="16" y1="21" y2="21"></line>
              <line x1="12" x2="12" y1="17" y2="21"></line>
            </svg>
          </div>
        );
      case 'server':
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
              <line x1="6" x2="6" y1="6" y2="6"></line>
              <line x1="6" x2="6" y1="18" y2="18"></line>
            </svg>
          </div>
        );
      case 'network':
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
              <path d="M4 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M2 11h2"></path>
              <path d="M10 11h2"></path>
              <path d="M18 11h2"></path>
              <path d="M14 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M8 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M18 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M6 11v-3a6 6 0 0 1 12 0v3"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 bg-slate-200 dark:bg-slate-700 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-500 dark:text-slate-400">
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"></path>
              <path d="M18 14h-8"></path>
              <path d="M15 18h-5"></path>
              <path d="M10 6h8v4h-8V6Z"></path>
            </svg>
          </div>
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      in_stock: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "In Stock" },
      assigned: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Assigned" },
      maintenance: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Maintenance" },
      retired: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Retired" }
    };
    
    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2 flex justify-between items-center">
        <CardTitle>{title}</CardTitle>
        <Link href={viewAllLink} className="text-sm font-medium text-primary hover:underline">
          View all
        </Link>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded bg-muted animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                  <div className="h-3 w-1/2 bg-muted animate-pulse rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead>
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name/Model</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Serial</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-muted/50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">{item.type}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">{item.name || item.model}</td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-mono text-xs">{item.serialNumber}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No items found. Start by adding some {title.toLowerCase()}.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
