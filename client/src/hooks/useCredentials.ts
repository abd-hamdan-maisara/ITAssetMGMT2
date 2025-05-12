import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Credential, InsertCredential } from '@shared/schema';

export function useCredentials() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add credential mutation
  const addCredential = useMutation({
    mutationFn: async (data: InsertCredential) => {
      const response = await apiRequest('POST', '/api/credentials', data);
      return response.json();
    },
    onSuccess: (newCredential: Credential) => {
      toast({
        title: 'Credential Added',
        description: `${newCredential.name} has been successfully added to the vault.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to add credential: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Update credential mutation
  const updateCredential = useMutation({
    mutationFn: async ({ id, data }: { id: number, data: Partial<InsertCredential> }) => {
      const response = await apiRequest('PUT', `/api/credentials/${id}`, data);
      return response.json();
    },
    onSuccess: (updatedCredential: Credential) => {
      toast({
        title: 'Credential Updated',
        description: `${updatedCredential.name} has been successfully updated.`,
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update credential: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  // Delete credential mutation
  const deleteCredential = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/credentials/${id}`);
      return id;
    },
    onSuccess: (id: number) => {
      toast({
        title: 'Credential Deleted',
        description: 'The credential has been successfully removed from the vault.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to delete credential: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  return {
    addCredential,
    updateCredential,
    deleteCredential
  };
}
