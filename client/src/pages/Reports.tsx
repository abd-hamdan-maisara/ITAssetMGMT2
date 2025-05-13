import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  Download, 
  FileText, 
  BarChart3, 
  PieChart as PieChartIcon,
  FileDown,
  AlertCircle
} from 'lucide-react';
import { Hardware, NetworkDevice, Assignment, Activity } from '@shared/schema';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [reportPeriod, setReportPeriod] = useState('all');
  const [reportType, setReportType] = useState('inventory');

  const { data: hardware, isLoading: isLoadingHardware } = useQuery<Hardware[]>({
    queryKey: ['/api/hardware'],
  });

  const { data: networkDevices, isLoading: isLoadingNetwork } = useQuery<NetworkDevice[]>({
    queryKey: ['/api/network-devices'],
  });

  const { data: generalInventory, isLoading: isLoadingGeneral } = useQuery<any[]>({
    queryKey: ['/api/general-inventory'],
  });

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery<Assignment[]>({
    queryKey: ['/api/assignments'],
  });

  const { data: activityLogs, isLoading: isLoadingLogs } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
  });

  // Calculate inventory statistics by type
  const hardwareByType = hardware?.reduce((acc: Record<string, number>, item) => {
    acc[item.type] = (acc[item.type] || 0) + 1;
    return acc;
  }, {});

  const hardwareTypeData = hardwareByType ? Object.entries(hardwareByType).map(([name, value]) => ({
    name,
    value
  })) : [];

  // Calculate inventory statistics by status
  const hardwareByStatus = hardware?.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const hardwareStatusData = hardwareByStatus ? Object.entries(hardwareByStatus).map(([name, value]) => ({
    name: name.replace('_', ' ').toUpperCase(),
    value
  })) : [];

  // Calculate assignment statistics
  const assignmentsByStatus = assignments?.reduce((acc: Record<string, number>, item) => {
    acc[item.status] = (acc[item.status] || 0) + 1;
    return acc;
  }, {});

  const assignmentStatusData = assignmentsByStatus ? Object.entries(assignmentsByStatus).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  })) : [];

  // Activity over time (last 10 logs grouped by date)
  const activityByDate = activityLogs?.reduce((acc: Record<string, number>, log) => {
    const date = format(new Date(log.createdAt || new Date()), 'MMM d');
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const activityData = activityByDate ? Object.entries(activityByDate)
    .slice(-10)
    .map(([date, count]) => ({
      date,
      count
    })) : [];

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  // Determine if still loading
  const isLoading = isLoadingHardware || isLoadingNetwork || isLoadingGeneral || 
                   isLoadingAssignments || isLoadingLogs;

  // Generate inventory report
  const generateInventoryReport = () => {
    // In a real app, this would generate a CSV or PDF file
    console.log('Generating inventory report');
    const reportData = {
      hardware,
      networkDevices,
      generalInventory
    };
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData)
    )}`;
    
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'inventory_report.json';
    link.click();
  };

  // Generate assignments report
  const generateAssignmentsReport = () => {
    // In a real app, this would generate a CSV or PDF file
    console.log('Generating assignments report');
    const reportData = {
      assignments
    };
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData)
    )}`;
    
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'assignments_report.json';
    link.click();
  };

  // Generate activity report
  const generateActivityReport = () => {
    // In a real app, this would generate a CSV or PDF file
    console.log('Generating activity report');
    const reportData = {
      activityLogs
    };
    
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(reportData)
    )}`;
    
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'activity_report.json';
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Generate and view inventory reports and analytics</p>
        </div>
        <div className="flex space-x-3">
          <Select 
            value={reportType} 
            onValueChange={setReportType}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Report Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory">Inventory Report</SelectItem>
              <SelectItem value="assignments">Assignments Report</SelectItem>
              <SelectItem value="activity">Activity Report</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={() => {
            if (reportType === 'inventory') {
              generateInventoryReport();
            } else if (reportType === 'assignments') {
              generateAssignmentsReport();
            } else if (reportType === 'activity') {
              generateActivityReport();
            }
          }}>
            <Download className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType('inventory')}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
              <BarChart3 className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Inventory Report</h3>
              <p className="text-sm text-muted-foreground">Hardware and equipment status</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType('assignments')}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Assignments Report</h3>
              <p className="text-sm text-muted-foreground">Assigned hardware tracking</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setReportType('activity')}>
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center text-amber-600">
              <PieChartIcon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-medium">Activity Report</h3>
              <p className="text-sm text-muted-foreground">System usage and changes</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Visualizations */}
      <Tabs defaultValue="charts" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="charts" className="flex items-center">
            <BarChart3 className="mr-2 h-4 w-4" />
            Charts
          </TabsTrigger>
          <TabsTrigger value="data" className="flex items-center">
            <FileText className="mr-2 h-4 w-4" />
            Raw Data
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="charts" className="pt-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Hardware by Type Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Hardware by Type</CardTitle>
                  <CardDescription>Distribution of hardware types in inventory</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={hardwareTypeData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {hardwareTypeData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Hardware by Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Hardware by Status</CardTitle>
                  <CardDescription>Current status of hardware items</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={hardwareStatusData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="value" name="Count" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Assignment Status Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Status</CardTitle>
                  <CardDescription>Current status of hardware assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={assignmentStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {assignmentStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              {/* Activity Over Time Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Over Time</CardTitle>
                  <CardDescription>System activity in the last 10 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={activityData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="count" name="Activities" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="data" className="pt-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Report Data Summary</CardTitle>
                  <CardDescription>Overview of inventory items and assignments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{hardware?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Hardware Items</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{networkDevices?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Network Devices</div>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="text-2xl font-bold">{assignments?.length || 0}</div>
                      <div className="text-sm text-muted-foreground">Total Assignments</div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-sm font-medium">Download Raw Data</h3>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={generateInventoryReport}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Inventory
                        </Button>
                        <Button variant="outline" size="sm" onClick={generateAssignmentsReport}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Assignments
                        </Button>
                        <Button variant="outline" size="sm" onClick={generateActivityReport}>
                          <FileDown className="mr-2 h-4 w-4" />
                          Activity
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest activities in the system</CardDescription>
                </CardHeader>
                <CardContent>
                  {activityLogs && activityLogs.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border">
                        <thead className="bg-muted/50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">User</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          {activityLogs.slice(0, 10).map((log) => (
                            <tr key={log.id} className="hover:bg-muted/50 transition">
                              <td className="px-6 py-4 whitespace-nowrap">
                                {format(new Date(log.createdAt || new Date()), 'MMM d, yyyy h:mm a')}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                {log.userId}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap capitalize">
                                {log.action}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap capitalize">
                                {log.action?.replace('_', ' ') || log.entityType || 'Unknown'}
                              </td>
                              <td className="px-6 py-4">
                                {log.details ? JSON.stringify(log.details) : '-'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Activity Logs Found</h3>
                      <p className="text-muted-foreground">
                        There are no recent activities to display.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
