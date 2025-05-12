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
  HardDrive,
  Projector,
  Usb,
  Printer,
  Headphones,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { GeneralInventoryItem } from '@shared/schema';
import { AddGeneralInventoryModal } from '@/components/modals/AddGeneralInventoryModal';

export default function GeneralInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: inventory, isLoading, error } = useQuery<GeneralInventoryItem[]>({
    queryKey: ['/api/general-inventory'],
  });

  const filteredInventory = inventory?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.serialNumber && item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getIconForCategory = (category: string) => {
    switch (category.toLowerCase()) {
      case 'storage':
        return <HardDrive className="h-5 w-5 text-primary" />;
      case 'av':
      case 'audio/visual':
        return <Projector className="h-5 w-5 text-secondary-500" />;
      case 'peripheral':
        return <Usb className="h-5 w-5 text-amber-500" />;
      case 'printing':
        return <Printer className="h-5 w-5 text-red-500" />;
      case 'audio':
        return <Headphones className="h-5 w-5 text-indigo-500" />;
      default:
        return <MoreHorizontal className="h-5 w-5 text-slate-500" />;
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">General IT Inventory</h1>
          <p className="text-muted-foreground">Manage miscellaneous IT equipment and assets</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </div>

      {/* Category Quick Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('storage')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2">
              <HardDrive className="h-6 w-6 text-primary" />
            </div>
            <span className="font-medium text-center">Storage Devices</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('av')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-secondary-500/10 flex items-center justify-center mb-2">
              <Projector className="h-6 w-6 text-secondary-500" />
            </div>
            <span className="font-medium text-center">AV Equipment</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('peripheral')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center mb-2">
              <Usb className="h-6 w-6 text-amber-500" />
            </div>
            <span className="font-medium text-center">Peripherals</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('printing')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-2">
              <Printer className="h-6 w-6 text-red-500" />
            </div>
            <span className="font-medium text-center">Printing</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('audio')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center mb-2">
              <Headphones className="h-6 w-6 text-indigo-500" />
            </div>
            <span className="font-medium text-center">Audio</span>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setCategoryFilter('all')}>
          <CardContent className="p-4 flex flex-col items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center mb-2">
              <MoreHorizontal className="h-6 w-6 text-slate-500 dark:text-slate-400" />
            </div>
            <span className="font-medium text-center">View All</span>
          </CardContent>
        </Card>
      </div>

      {/* Images of IT Hardware */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1598986646512-9330bcc4c0dc?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="IT peripherals including keyboard, mouse and dongles" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Peripherals Inventory</h3>
            <p className="text-sm text-muted-foreground mb-3">Keyboards, mice, adapters and more</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => setCategoryFilter('peripheral')}>
              Manage inventory →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Office workstation setup with multiple monitors" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Workstation Equipment</h3>
            <p className="text-sm text-muted-foreground mb-3">Monitors, docking stations and accessories</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => setCategoryFilter('workstation')}>
              Manage inventory →
            </Button>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1571756800439-d1c8cc6a6aa8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Conference room with projector and AV equipment" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">AV Equipment</h3>
            <p className="text-sm text-muted-foreground mb-3">Projectors, screens and conference room tech</p>
            <Button variant="link" className="p-0 h-auto" onClick={() => setCategoryFilter('av')}>
              Manage inventory →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Select 
              value={categoryFilter}
              onValueChange={setCategoryFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="storage">Storage</SelectItem>
                <SelectItem value="av">AV Equipment</SelectItem>
                <SelectItem value="peripheral">Peripherals</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="workstation">Workstation</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <Card className="overflow-hidden">
        <div className="border-b border-border p-4 flex justify-between items-center">
          <h3 className="font-semibold">General Inventory Items</h3>
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
            <h3 className="text-lg font-medium mb-2">Error Loading Inventory</h3>
            <p className="text-muted-foreground">There was a problem fetching the inventory items.</p>
          </div>
        ) : filteredInventory && filteredInventory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Serial Number</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Location</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredInventory.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-muted rounded-lg flex items-center justify-center">
                          {getIconForCategory(item.category)}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium">{item.name}</div>
                          <div className="text-sm text-muted-foreground">{item.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap capitalize">{item.category}</td>
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
            <HardDrive className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Inventory Items Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || categoryFilter !== 'all' 
                ? "No items match your current filters." 
                : "Start by adding items to your general inventory."}
            </p>
            {(searchTerm || categoryFilter !== 'all') && (
              <Button className="mt-2" onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddGeneralInventoryModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
