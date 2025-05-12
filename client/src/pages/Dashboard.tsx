import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Computer, 
  Router, 
  Network, 
  UserPlus, 
  HardDrive, 
  Key, 
  Server 
} from 'lucide-react';
import { StatusCard } from '@/components/dashboard/StatusCard';
import { ActivityLog } from '@/components/dashboard/ActivityLog';
import { SystemStatus } from '@/components/dashboard/SystemStatus';
import { DashboardStats } from '@/components/DashboardStats';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function Dashboard() {
  const { data: hardware, isLoading: isLoadingHardware } = useQuery({
    queryKey: ['/api/hardware'],
  });

  const { data: networkDevices, isLoading: isLoadingNetworkDevices } = useQuery({
    queryKey: ['/api/network-devices'],
  });

  const { data: credentials, isLoading: isLoadingCredentials } = useQuery({
    queryKey: ['/api/credentials'],
  });

  const { data: vlans, isLoading: isLoadingVlans } = useQuery({
    queryKey: ['/api/vlans'],
  });

  const { data: generalInventory, isLoading: isLoadingGeneralInventory } = useQuery({
    queryKey: ['/api/general-inventory'],
  });

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery({
    queryKey: ['/api/assignments'],
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Router className="mr-2 h-4 w-4" />
            Network Status
          </Button>
          <Button size="sm">
            <Computer className="mr-2 h-4 w-4" />
            Inventory Report
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatusCard
          title="Total Hardware"
          value={isLoadingHardware ? "..." : hardware?.length || 0}
          icon={<Computer className="h-5 w-5" />}
          iconColor="text-blue-500"
          trend={{
            value: "+3",
            direction: "up",
            label: "from last month"
          }}
        />
        
        <StatusCard
          title="Network Equipment"
          value={isLoadingNetworkDevices ? "..." : networkDevices?.length || 0}
          icon={<Router className="h-5 w-5" />}
          iconColor="text-purple-500"
          trend={{
            value: "0",
            direction: "neutral",
            label: "no change"
          }}
        />
        
        <StatusCard
          title="Active VLANs"
          value={isLoadingVlans ? "..." : vlans?.length || 0}
          icon={<Network className="h-5 w-5" />}
          iconColor="text-green-500"
          trend={{
            value: "+2",
            direction: "up",
            label: "new this quarter"
          }}
        />
        
        <StatusCard
          title="Pending Assignments"
          value={
            isLoadingAssignments 
              ? "..." 
              : assignments?.filter(a => a.status === 'pending')?.length || 0
          }
          icon={<UserPlus className="h-5 w-5" />}
          iconColor="text-amber-500"
          trend={{
            value: "+5",
            direction: "up",
            label: "require attention"
          }}
        />
      </div>

      {/* Recent Activity and System Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <ActivityLog />
        </div>
        <div className="col-span-1">
          <SystemStatus />
        </div>
      </div>

      {/* Quick Access and Recent Hardware */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DashboardStats
          title="Recent Hardware"
          isLoading={isLoadingHardware}
          items={hardware?.slice(0, 4) || []}
          viewAllLink="/hardware"
        />

        <div className="bg-white dark:bg-card rounded-lg shadow-md border border-border p-6">
          <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/hardware">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-primary/5 hover:border-primary/20 transition-colors duration-200">
                <Computer className="h-8 w-8 text-primary mb-2" />
                <span className="text-sm font-medium">Add Hardware</span>
              </a>
            </Link>
            
            <Link href="/credentials">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-blue-500/5 hover:border-blue-500/20 transition-colors duration-200">
                <Key className="h-8 w-8 text-blue-500 mb-2" />
                <span className="text-sm font-medium">Add Credential</span>
              </a>
            </Link>
            
            <Link href="/networking">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-green-500/5 hover:border-green-500/20 transition-colors duration-200">
                <Network className="h-8 w-8 text-green-500 mb-2" />
                <span className="text-sm font-medium">Add VLAN</span>
              </a>
            </Link>
            
            <Link href="/assignments">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-purple-500/5 hover:border-purple-500/20 transition-colors duration-200">
                <UserPlus className="h-8 w-8 text-purple-500 mb-2" />
                <span className="text-sm font-medium">New Assignment</span>
              </a>
            </Link>
            
            <Link href="/hardware">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-amber-500/5 hover:border-amber-500/20 transition-colors duration-200">
                <HardDrive className="h-8 w-8 text-amber-500 mb-2" />
                <span className="text-sm font-medium">Search Inventory</span>
              </a>
            </Link>
            
            <Link href="/reports">
              <a className="flex flex-col items-center p-4 bg-muted/50 rounded-lg border border-border hover:bg-red-500/5 hover:border-red-500/20 transition-colors duration-200">
                <Server className="h-8 w-8 text-red-500 mb-2" />
                <span className="text-sm font-medium">Generate Report</span>
              </a>
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}
