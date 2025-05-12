import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useInventory } from '@/hooks/useInventory';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InventoryCard } from '@/components/inventory/InventoryCard';
import { AddHardwareModal } from '@/components/modals/AddHardwareModal';
import { AddAssignmentModal } from '@/components/modals/AddAssignmentModal';
import { 
  Computer, 
  Search, 
  Filter, 
  Download,
  Plus
} from 'lucide-react';
import { Hardware } from '@shared/schema';

export default function HardwarePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedHardware, setSelectedHardware] = useState<Hardware | null>(null);

  const { data: hardware, isLoading, error } = useQuery<Hardware[]>({
    queryKey: ['/api/hardware'],
  });

  const handleAssign = (item: Hardware) => {
    setSelectedHardware(item);
    setAssignModalOpen(true);
  };

  const handleEdit = (item: Hardware) => {
    // Edit functionality would be implemented here
    console.log('Edit item:', item);
  };

  const filteredHardware = hardware?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Placeholder images for different hardware types
  const getImageForType = (type: string) => {
    switch (type) {
      case 'laptop':
        return 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'desktop':
        return 'https://images.unsplash.com/photo-1593640495253-23196b27a87f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'server':
        return 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'network':
        return 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      case 'monitor':
        return 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
      default:
        return 'https://images.unsplash.com/photo-1591405351990-4726e331f141?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <h1 className="text-2xl font-bold">Hardware Inventory</h1>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Hardware
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, model, serial number..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
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
                <SelectItem value="monitor">Monitors</SelectItem>
                <SelectItem value="printer">Printers</SelectItem>
                <SelectItem value="network">Network</SelectItem>
                <SelectItem value="peripheral">Peripherals</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="retired">Retired</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Apply Filters
            </Button>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Hardware Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-[350px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-card rounded-lg shadow p-8 text-center">
          <Computer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Hardware</h3>
          <p className="text-muted-foreground">There was a problem fetching the hardware inventory.</p>
        </div>
      ) : filteredHardware && filteredHardware.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredHardware.map((item) => (
            <InventoryCard
              key={item.id}
              image={item.imageUrl || getImageForType(item.type)}
              title={item.name}
              type={`${item.manufacturer} ${item.model}`}
              status={item.status}
              details={[
                { label: 'Serial', value: item.serialNumber },
                { label: 'Location', value: item.location || 'Not specified' },
                { label: 'Assigned To', value: item.assignedTo || 'Unassigned' },
              ]}
              onEdit={() => handleEdit(item)}
              onAssign={() => handleAssign(item)}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-lg shadow p-8 text-center">
          <Computer className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Hardware Found</h3>
          <p className="text-muted-foreground">No hardware items match your current filters.</p>
          <Button className="mt-4" onClick={() => {
            setSearchTerm('');
            setTypeFilter('all');
            setStatusFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Pagination - would implement for larger datasets */}
      
      {/* Modals */}
      <AddHardwareModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
      
      {selectedHardware && (
        <AddAssignmentModal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          hardwareId={selectedHardware.id}
          itemName={selectedHardware.name}
        />
      )}
    </div>
  );
}
