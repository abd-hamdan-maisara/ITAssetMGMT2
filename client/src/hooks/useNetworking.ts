import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { NetworkDevice, InsertNetworkDevice, Vlan, InsertVlan } from '@shared/schema';

export function useNetworking() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Network device mutations
  const addNetworkDevice = useMutation({
    mutationFn: async (data: InsertNetworkDevice) => {
      const response = await apiRequest('POST', '/api/network-devices', data);
      return response.json();
    },
    onSuccess: (newDevice: NetworkDevice) => {
      toast({
        title: 'Network Device Added',
        description: `${newDevice.name} has been successfully added to inventory.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add network device: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateNetworkDevice = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertNetworkDevice> }) => {
      const response = await apiRequest('PUT', `/api/network-devices/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedDevice: NetworkDevice) => {
      toast({
        title: 'Network Device Updated',
        description: `${updatedDevice.name} has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update network device: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteNetworkDevice = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/network-devices/${id}`);
      return id;
    },
    onSuccess: (id: number) => {
      toast({
        title: 'Network Device Deleted',
        description: 'The network device has been successfully removed from inventory.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete network device: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // VLAN mutations
  const addVlan = useMutation({
    mutationFn: async (data: InsertVlan) => {
      const response = await apiRequest('POST', '/api/vlans', data);
      return response.json();
    },
    onSuccess: (newVlan: Vlan) => {
      toast({
        title: 'VLAN Added',
        description: `VLAN ${newVlan.name} (ID: ${newVlan.vlanId}) has been successfully added.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vlans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add VLAN: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const updateVlan = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertVlan> }) => {
      const response = await apiRequest('PUT', `/api/vlans/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedVlan: Vlan) => {
      toast({
        title: 'VLAN Updated',
        description: `VLAN ${updatedVlan.name} (ID: ${updatedVlan.vlanId}) has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vlans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update VLAN: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const deleteVlan = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/vlans/${id}`);
      return id;
    },
    onSuccess: (id: number) => {
      toast({
        title: 'VLAN Deleted',
        description: 'The VLAN has been successfully removed.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vlans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete VLAN: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    // Network device methods
    addNetworkDevice,
    updateNetworkDevice,
    deleteNetworkDevice,
    
    // VLAN methods
    addVlan,
    updateVlan,
    deleteVlan
  };
}
