import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Assignment, InsertAssignment } from '@shared/schema';

export function useAssignments() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add assignment mutation
  const addAssignment = useMutation({
    mutationFn: async (data: InsertAssignment) => {
      const response = await apiRequest('POST', '/api/assignments', data);
      return response.json();
    },
    onSuccess: (newAssignment: Assignment) => {
      toast({
        title: 'Assignment Created',
        description: `The item has been successfully assigned to ${newAssignment.assignedTo}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      
      // Update the status of the assigned item
      if (newAssignment.hardwareId) {
        queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
        apiRequest('PUT', `/api/hardware/${newAssignment.hardwareId}`, { status: 'assigned' });
      } else if (newAssignment.networkDeviceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
        apiRequest('PUT', `/api/network-devices/${newAssignment.networkDeviceId}`, { status: 'assigned' });
      } else if (newAssignment.generalInventoryId) {
        queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
        apiRequest('PUT', `/api/general-inventory/${newAssignment.generalInventoryId}`, { status: 'assigned' });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to create assignment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update assignment mutation
  const updateAssignment = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertAssignment> }) => {
      const response = await apiRequest('PUT', `/api/assignments/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedAssignment: Assignment) => {
      toast({
        title: 'Assignment Updated',
        description: `The assignment to ${updatedAssignment.assignedTo} has been updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      
      // If assignment status changed to returned, update the item status
      if (updatedAssignment.status === 'returned') {
        if (updatedAssignment.hardwareId) {
          queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
          apiRequest('PUT', `/api/hardware/${updatedAssignment.hardwareId}`, { status: 'in_stock' });
        } else if (updatedAssignment.networkDeviceId) {
          queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
          apiRequest('PUT', `/api/network-devices/${updatedAssignment.networkDeviceId}`, { status: 'in_stock' });
        } else if (updatedAssignment.generalInventoryId) {
          queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
          apiRequest('PUT', `/api/general-inventory/${updatedAssignment.generalInventoryId}`, { status: 'in_stock' });
        }
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update assignment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete assignment mutation
  const deleteAssignment = useMutation({
    mutationFn: async (id: number) => {
      // Get the assignment first to know what item to update
      const response = await fetch(`/api/assignments/${id}`, { credentials: 'include' });
      const assignment: Assignment = await response.json();
      
      // Delete the assignment
      await apiRequest('DELETE', `/api/assignments/${id}`);
      return assignment;
    },
    onSuccess: (assignment: Assignment) => {
      toast({
        title: 'Assignment Deleted',
        description: 'The assignment has been successfully removed.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      
      // Update the status of the previously assigned item back to in_stock
      if (assignment.hardwareId) {
        queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
        apiRequest('PUT', `/api/hardware/${assignment.hardwareId}`, { status: 'in_stock' });
      } else if (assignment.networkDeviceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
        apiRequest('PUT', `/api/network-devices/${assignment.networkDeviceId}`, { status: 'in_stock' });
      } else if (assignment.generalInventoryId) {
        queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
        apiRequest('PUT', `/api/general-inventory/${assignment.generalInventoryId}`, { status: 'in_stock' });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete assignment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Return item mutation (shorthand for updating status to returned)
  const returnItem = useMutation({
    mutationFn: async (id: number) => {
      const response = await apiRequest('PUT', `/api/assignments/${id}`, { 
        status: 'returned',
        returnDate: new Date()
      });
      return response.json();
    },
    onSuccess: (updatedAssignment: Assignment) => {
      toast({
        title: 'Item Returned',
        description: `The item has been marked as returned by ${updatedAssignment.assignedTo}.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      
      // Update the status of the previously assigned item back to in_stock
      if (updatedAssignment.hardwareId) {
        queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
        apiRequest('PUT', `/api/hardware/${updatedAssignment.hardwareId}`, { status: 'in_stock' });
      } else if (updatedAssignment.networkDeviceId) {
        queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
        apiRequest('PUT', `/api/network-devices/${updatedAssignment.networkDeviceId}`, { status: 'in_stock' });
      } else if (updatedAssignment.generalInventoryId) {
        queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
        apiRequest('PUT', `/api/general-inventory/${updatedAssignment.generalInventoryId}`, { status: 'in_stock' });
      }
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to return item: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    addAssignment,
    updateAssignment,
    deleteAssignment,
    returnItem
  };
}
