import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNetworking } from '@/hooks/useNetworking';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NetworkDeviceTable } from '@/components/NetworkDeviceTable';
import { VlanTable } from '@/components/VlanTable';
import { AddNetworkDeviceModal } from '@/components/modals/AddNetworkDeviceModal';
import { AddVlanModal } from '@/components/modals/AddVlanModal';
import { 
  Search, 
  Plus,
  Router,
  Network,
  ServerCrash
} from 'lucide-react';
import { NetworkDevice, Vlan } from '@shared/schema';

export default function NetworkingPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [deviceModalOpen, setDeviceModalOpen] = useState(false);
  const [vlanModalOpen, setVlanModalOpen] = useState(false);

  const { data: networkDevices, isLoading: isLoadingDevices } = useQuery<NetworkDevice[]>({
    queryKey: ['/api/network-devices'],
  });

  const { data: vlans, isLoading: isLoadingVlans } = useQuery<Vlan[]>({
    queryKey: ['/api/vlans'],
  });

  const filteredDevices = networkDevices?.filter(device => 
    device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    device.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredVlans = vlans?.filter(vlan => 
    vlan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vlan.subnet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vlan.vlanId.toString().includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Networking & VLANs</h1>
          <p className="text-muted-foreground">Manage network equipment and VLAN configurations</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setDeviceModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </Button>
          <Button variant="outline" onClick={() => setVlanModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add VLAN
          </Button>
        </div>
      </div>

      {/* Network Diagram */}
      <Card>
        <CardHeader className="pb-3 flex justify-between items-center">
          <CardTitle>Network Topology</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm">Zoom In</Button>
            <Button variant="outline" size="sm">Zoom Out</Button>
            <Button variant="outline" size="sm">Reset</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="border border-border rounded-lg p-4 bg-muted/30 h-64 flex items-center justify-center">
            <div className="text-center">
              <ServerCrash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Network topology visualization would go here</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search devices or VLANs..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabs for Network Devices and VLANs */}
      <Tabs defaultValue="devices" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="devices" className="flex items-center">
            <Router className="mr-2 h-4 w-4" />
            Network Devices
          </TabsTrigger>
          <TabsTrigger value="vlans" className="flex items-center">
            <Network className="mr-2 h-4 w-4" />
            VLANs
          </TabsTrigger>
        </TabsList>
        <TabsContent value="devices" className="pt-4">
          <NetworkDeviceTable 
            devices={filteredDevices || []} 
            isLoading={isLoadingDevices} 
            searchTerm={searchTerm}
          />
        </TabsContent>
        <TabsContent value="vlans" className="pt-4">
          <VlanTable 
            vlans={filteredVlans || []} 
            isLoading={isLoadingVlans}
            searchTerm={searchTerm}
          />
        </TabsContent>
      </Tabs>

      {/* Network Images */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1551645120-d70bfe84c826?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Server rack with patch panels and cables" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Main Server Rack</h3>
            <p className="text-sm text-muted-foreground mb-2">Core network infrastructure</p>
            <div className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 inline-block">
              Operational
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1544197150-b99a580bb7a8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Network switches with connected ethernet cables" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Distribution Switches</h3>
            <p className="text-sm text-muted-foreground mb-2">Floor connectivity</p>
            <div className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 inline-block">
              Operational
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1555664424-778a1e5e1b48?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Wireless access points" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Wireless Infrastructure</h3>
            <p className="text-sm text-muted-foreground mb-2">Building-wide coverage</p>
            <div className="px-2 py-1 text-xs rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 inline-block">
              Partial Issues
            </div>
          </CardContent>
        </Card>
        
        <Card className="overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1562408590-e32931084e23?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
            alt="Network security appliance in rack" 
            className="w-full h-48 object-cover" 
          />
          <CardContent className="p-4">
            <h3 className="font-bold">Security Infrastructure</h3>
            <p className="text-sm text-muted-foreground mb-2">Firewalls and IPS</p>
            <div className="px-2 py-1 text-xs rounded-full bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 inline-block">
              Operational
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <AddNetworkDeviceModal
        open={deviceModalOpen}
        onClose={() => setDeviceModalOpen(false)}
      />
      
      <AddVlanModal
        open={vlanModalOpen}
        onClose={() => setVlanModalOpen(false)}
      />
    </div>
  );
}
