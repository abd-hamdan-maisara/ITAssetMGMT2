import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  Laptop,
  Server,
  Printer,
  Monitor,
  Tablet,
  Smartphone,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { Hardware as HardwareType, HardwareStatus } from '@shared/schema';

export default function HardwarePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: hardware, isLoading, error } = useQuery<HardwareType[]>({
    queryKey: ['/api/hardware'],
  });

  const filteredHardware = hardware?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.manufacturer && item.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.model && item.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getIconForType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'laptop':
        return <Laptop className="h-5 w-5 text-primary" />;
      case 'server':
        return <Server className="h-5 w-5 text-amber-500" />;
      case 'printer':
        return <Printer className="h-5 w-5 text-red-500" />;
      case 'monitor':
        return <Monitor className="h-5 w-5 text-indigo-500" />;
      case 'tablet':
        return <Tablet className="h-5 w-5 text-purple-500" />;
      case 'phone':
      case 'smartphone':
        return <Smartphone className="h-5 w-5 text-blue-500" />;
      default:
        return <MoreHorizontal className="h-5 w-5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      [HardwareStatus.AVAILABLE]: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Available" },
      [HardwareStatus.ASSIGNED]: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Assigned" },
      [HardwareStatus.MAINTENANCE]: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Maintenance" },
      [HardwareStatus.RETIRED]: { color: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400", label: "Retired" }
    };
    
    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Hardware Inventory</h1>
          <p className="text-muted-foreground">Manage IT hardware assets and devices</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hardware
        </Button>
      </div>

      {/* Hardware Type Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('laptop')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <Laptop className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-center">Laptops</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('server')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Server className="h-6 w-6 text-amber-500" />
            </div>
            <span className="font-medium text-center">Servers</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('printer')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
              <Printer className="h-6 w-6 text-red-500" />
            </div>
            <span className="font-medium text-center">Printers</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('monitor')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
              <Monitor className="h-6 w-6 text-indigo-500" />
            </div>
            <span className="font-medium text-center">Monitors</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('tablet')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mb-2">
              <Tablet className="h-6 w-6 text-purple-500" />
            </div>
            <span className="font-medium text-center">Tablets</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setTypeFilter('all')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2">
              <MoreHorizontal className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <span className="font-medium text-center">View All</span>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hardware..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value={HardwareStatus.AVAILABLE}>Available</SelectItem>
                <SelectItem value={HardwareStatus.ASSIGNED}>Assigned</SelectItem>
                <SelectItem value={HardwareStatus.MAINTENANCE}>Maintenance</SelectItem>
                <SelectItem value={HardwareStatus.RETIRED}>Retired</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="laptop">Laptops</SelectItem>
                <SelectItem value="desktop">Desktops</SelectItem>
                <SelectItem value="server">Servers</SelectItem>
                <SelectItem value="printer">Printers</SelectItem>
                <SelectItem value="monitor">Monitors</SelectItem>
                <SelectItem value="tablet">Tablets</SelectItem>
                <SelectItem value="phone">Phones</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Hardware Table */}
      <Card className="overflow-hidden">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <h3 className="font-semibold">Hardware Inventory Items</h3>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Quick search..." 
                className="pl-8 h-8 text-sm w-[180px]" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="link" size="sm" className="text-primary">
              Export
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="p-4 space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
          </div>
        ) : error ? (
          <div className="text-center p-8">
            <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading Hardware</h3>
            <p className="text-muted-foreground">There was a problem fetching the hardware items.</p>
          </div>
        ) : filteredHardware && filteredHardware.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Device</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Serial Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredHardware.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                          {getIconForType(item.type)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {item.manufacturer} {item.model}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{item.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">{item.serialNumber || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.location || "—"}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8">
            <Laptop className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Hardware Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' || typeFilter !== 'all'
                ? "No hardware items match your search criteria. Try adjusting your filters."
                : "There are no hardware items in the inventory yet."}
            </p>
            <Button variant="outline" onClick={() => setAddModalOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Hardware
            </Button>
          </div>
        )}
      </Card>

      {/* Modal would go here */}
      {/* <AddHardwareModal
        open={addModalOpen}
        onOpenChange={setAddModalOpen}
      /> */}
    </div>
  );
}