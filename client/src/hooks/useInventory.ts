import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Hardware, InsertHardware } from '@shared/schema';

export function useInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add hardware mutation
  const addHardware = useMutation({
    mutationFn: async (data: InsertHardware) => {
      const response = await apiRequest('POST', '/api/hardware', data);
      return response.json();
    },
    onSuccess: (newHardware: Hardware) => {
      toast({
        title: 'Hardware Added',
        description: `${newHardware.name} has been successfully added to inventory.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add hardware: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update hardware mutation
  const updateHardware = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertHardware> }) => {
      const response = await apiRequest('PUT', `/api/hardware/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedHardware: Hardware) => {
      toast({
        title: 'Hardware Updated',
        description: `${updatedHardware.name} has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update hardware: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete hardware mutation
  const deleteHardware = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/hardware/${id}`);
      return id;
    },
    onSuccess: (id: number) => {
      toast({
        title: 'Hardware Deleted',
        description: 'The hardware has been successfully removed from inventory.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete hardware: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    addHardware,
    updateHardware,
    deleteHardware
  };
}
