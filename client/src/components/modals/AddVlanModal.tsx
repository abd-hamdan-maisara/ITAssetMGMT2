import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertVlanSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddVlanModalProps {
  open: boolean;
  onClose: () => void;
}

type VlanFormValues = z.infer<typeof insertVlanSchema>;

export function AddVlanModal({ open, onClose }: AddVlanModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<VlanFormValues>({
    resolver: zodResolver(insertVlanSchema),
    defaultValues: {
      vlanId: undefined,
      name: '',
      subnet: '',
      description: '',
      assignedDevices: '',
    },
  });
  
  const addVlanMutation = useMutation({
    mutationFn: async (data: VlanFormValues) => {
      const response = await apiRequest('POST', '/api/vlans', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'VLAN Added',
        description: 'The VLAN has been successfully added.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/vlans'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add VLAN: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: VlanFormValues) => {
    addVlanMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add VLAN</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="vlanId">VLAN ID</Label>
              <Input 
                id="vlanId" 
                type="number"
                {...form.register('vlanId', { valueAsNumber: true })}
                placeholder="e.g. 10, 20, 30"
              />
              {form.formState.errors.vlanId && (
                <p className="text-sm text-red-500">{form.formState.errors.vlanId.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">VLAN Name</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="e.g. Management, Staff, Guest"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subnet">Subnet</Label>
              <Input 
                id="subnet" 
                {...form.register('subnet')}
                placeholder="e.g. 10.1.10.0/24"
              />
              {form.formState.errors.subnet && (
                <p className="text-sm text-red-500">{form.formState.errors.subnet.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedDevices">Assigned Devices</Label>
              <Input 
                id="assignedDevices" 
                {...form.register('assignedDevices')}
                placeholder="List of devices using this VLAN"
              />
              {form.formState.errors.assignedDevices && (
                <p className="text-sm text-red-500">{form.formState.errors.assignedDevices.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                {...form.register('description')}
                placeholder="Purpose and details of this VLAN"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addVlanMutation.isPending}
            >
              {addVlanMutation.isPending ? 'Adding...' : 'Add VLAN'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
