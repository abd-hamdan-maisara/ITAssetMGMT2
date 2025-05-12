import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SystemStatusItemProps {
  name: string;
  status: 'operational' | 'degraded' | 'offline';
}

function StatusBadge({ status }: { status: 'operational' | 'degraded' | 'offline' }) {
  return (
    <span className={cn(
      "px-2 py-1 text-xs font-medium rounded-full",
      status === 'operational' ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" :
      status === 'degraded' ? "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-400" :
      "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    )}>
      {status === 'operational' ? 'Online' : 
       status === 'degraded' ? 'Degraded' : 
       'Offline'}
    </span>
  );
}

function SystemStatusItem({ name, status }: SystemStatusItemProps) {
  return (
    <li className="flex justify-between items-center">
      <span className="text-sm font-medium">{name}</span>
      <StatusBadge status={status} />
    </li>
  );
}

interface StorageUtilizationProps {
  percentUsed: number;
  storageDetails: string;
}

function StorageUtilization({ percentUsed, storageDetails }: StorageUtilizationProps) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-medium mb-2">Storage Utilization</h4>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded bg-muted">
          <div 
            style={{ width: `${percentUsed}%` }} 
            className={cn(
              "shadow-none flex flex-col text-center whitespace-nowrap justify-center",
              percentUsed < 70 ? "bg-primary" :
              percentUsed < 90 ? "bg-amber-500" :
              "bg-red-500"
            )}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{percentUsed}% used</span>
          <span>{100 - percentUsed}% free</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">{storageDetails}</p>
      </div>
    </div>
  );
}

export function SystemStatus() {
  const systems = [
    { name: 'Main Server', status: 'operational' as const },
    { name: 'Backup Server', status: 'operational' as const },
    { name: 'Network Gateway', status: 'operational' as const },
    { name: 'DNS Server', status: 'degraded' as const },
    { name: 'Cloud Storage', status: 'operational' as const },
  ];
  
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>System Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {systems.map((system) => (
            <SystemStatusItem 
              key={system.name}
              name={system.name}
              status={system.status}
            />
          ))}
        </ul>
        
        <StorageUtilization 
          percentUsed={68} 
          storageDetails="3.4TB / 5TB" 
        />
      </CardContent>
    </Card>
  );
}
