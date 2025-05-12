import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { NetworkDevice } from "@shared/schema";
import { Edit, Settings, Trash2, Router, Wifi, Shield } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NetworkDeviceTableProps {
  devices: NetworkDevice[];
  isLoading: boolean;
  searchTerm: string;
}

export function NetworkDeviceTable({ devices, isLoading, searchTerm }: NetworkDeviceTableProps) {
  const getDeviceIcon = (type: string) => {
    if (type.toLowerCase().includes('router')) {
      return <Router className="h-4 w-4 text-blue-500" />;
    } else if (type.toLowerCase().includes('switch')) {
      return <Router className="h-4 w-4 text-green-500" />;
    } else if (type.toLowerCase().includes('ap') || type.toLowerCase().includes('access point') || type.toLowerCase().includes('wireless')) {
      return <Wifi className="h-4 w-4 text-purple-500" />;
    } else if (type.toLowerCase().includes('firewall') || type.toLowerCase().includes('security')) {
      return <Shield className="h-4 w-4 text-red-500" />;
    } else {
      return <Router className="h-4 w-4 text-slate-500" />;
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

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
      </div>
    );
  }

  if (devices.length === 0) {
    return (
      <div className="text-center p-8 border border-border rounded-lg">
        <Router className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">
          {searchTerm ? "No matching network devices found" : "No network devices found"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm 
            ? "Try adjusting your search term." 
            : "Start by adding network devices to your inventory."}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Device</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>MAC Address</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {devices.map((device) => (
            <TableRow key={device.id}>
              <TableCell>
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="font-medium">{device.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {device.manufacturer} {device.model}
                    </div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="font-mono">{device.ipAddress}</TableCell>
              <TableCell className="font-mono text-xs">{device.macAddress || "—"}</TableCell>
              <TableCell>{device.location || "—"}</TableCell>
              <TableCell>{getStatusBadge(device.status)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
