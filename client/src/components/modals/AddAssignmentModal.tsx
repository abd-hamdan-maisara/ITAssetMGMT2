import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertAssignmentSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddAssignmentModalProps {
  open: boolean;
  onClose: () => void;
  hardwareId?: number;
  networkDeviceId?: number;
  generalInventoryId?: number;
  itemName?: string;
}

const assignmentFormSchema = insertAssignmentSchema.extend({
  assignmentDate: z.string().optional(),
  returnDate: z.string().optional(),
});

type AssignmentFormValues = z.infer<typeof assignmentFormSchema>;

export function AddAssignmentModal({ 
  open, 
  onClose, 
  hardwareId, 
  networkDeviceId, 
  generalInventoryId,
  itemName
}: AddAssignmentModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<AssignmentFormValues>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      hardwareId: hardwareId || undefined,
      networkDeviceId: networkDeviceId || undefined,
      generalInventoryId: generalInventoryId || undefined,
      assignedTo: '',
      department: '',
      status: 'active',
      notes: '',
      assignmentDate: new Date().toISOString().split('T')[0],
      returnDate: '',
    },
  });
  
  const { data: hardware } = useQuery({
    queryKey: ['/api/hardware'],
    enabled: !hardwareId && !networkDeviceId && !generalInventoryId,
  });
  
  const { data: networkDevices } = useQuery({
    queryKey: ['/api/network-devices'],
    enabled: !hardwareId && !networkDeviceId && !generalInventoryId,
  });
  
  const { data: generalInventory } = useQuery({
    queryKey: ['/api/general-inventory'],
    enabled: !hardwareId && !networkDeviceId && !generalInventoryId,
  });
  
  const addAssignmentMutation = useMutation({
    mutationFn: async (data: AssignmentFormValues) => {
      // Convert date strings to Date objects if they exist
      const formattedData = {
        ...data,
        assignmentDate: data.assignmentDate ? new Date(data.assignmentDate) : new Date(),
        returnDate: data.returnDate ? new Date(data.returnDate) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/assignments', formattedData);
      
      // Update the status of the assigned item after successful assignment
      const hwId = formattedData.hardwareId;
      const netId = formattedData.networkDeviceId;
      const genId = formattedData.generalInventoryId;
      
      if (hwId) {
        apiRequest('PUT', `/api/hardware/${hwId}`, { status: 'assigned' });
      } else if (netId) {
        apiRequest('PUT', `/api/network-devices/${netId}`, { status: 'assigned' });
      } else if (genId) {
        apiRequest('PUT', `/api/general-inventory/${genId}`, { status: 'assigned' });
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Assignment Created',
        description: 'The item has been successfully assigned.',
      });
      
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/assignments'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
      
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to create assignment: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: AssignmentFormValues) => {
    addAssignmentMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {itemName ? `Assign ${itemName}` : 'Create New Assignment'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!hardwareId && !networkDeviceId && !generalInventoryId && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="itemType">Item Type</Label>
                <Select 
                  onValueChange={(value) => {
                    form.setValue('hardwareId', undefined);
                    form.setValue('networkDeviceId', undefined);
                    form.setValue('generalInventoryId', undefined);
                  }}
                  defaultValue="hardware"
                >
                  <SelectTrigger id="itemType">
                    <SelectValue placeholder="Select item type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="network">Network Device</SelectItem>
                    <SelectItem value="general">General Inventory</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {hardwareId ? (
              <div className="space-y-2 md:col-span-2">
                <Label>Hardware Item</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {itemName || `Hardware ID: ${hardwareId}`}
                </div>
                <input type="hidden" {...form.register('hardwareId', { valueAsNumber: true })} value={hardwareId} />
              </div>
            ) : networkDeviceId ? (
              <div className="space-y-2 md:col-span-2">
                <Label>Network Device</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {itemName || `Network Device ID: ${networkDeviceId}`}
                </div>
                <input type="hidden" {...form.register('networkDeviceId', { valueAsNumber: true })} value={networkDeviceId} />
              </div>
            ) : generalInventoryId ? (
              <div className="space-y-2 md:col-span-2">
                <Label>Inventory Item</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {itemName || `Inventory Item ID: ${generalInventoryId}`}
                </div>
                <input type="hidden" {...form.register('generalInventoryId', { valueAsNumber: true })} value={generalInventoryId} />
              </div>
            ) : (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="itemSelect">Select Item</Label>
                <Select 
                  onValueChange={(value) => {
                    const [type, id] = value.split('_');
                    const numId = parseInt(id);
                    
                    if (type === 'hw') {
                      form.setValue('hardwareId', numId);
                      form.setValue('networkDeviceId', undefined);
                      form.setValue('generalInventoryId', undefined);
                    } else if (type === 'net') {
                      form.setValue('hardwareId', undefined);
                      form.setValue('networkDeviceId', numId);
                      form.setValue('generalInventoryId', undefined);
                    } else if (type === 'gen') {
                      form.setValue('hardwareId', undefined);
                      form.setValue('networkDeviceId', undefined);
                      form.setValue('generalInventoryId', numId);
                    }
                  }}
                >
                  <SelectTrigger id="itemSelect">
                    <SelectValue placeholder="Select an item to assign" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem key="select-placeholder" value="item_placeholder">Select an item</SelectItem>
                    {hardware && Array.isArray(hardware) && hardware.filter((h: any) => h.status === 'in_stock').map((h: any) => (
                      <SelectItem key={`hw_${h.id}`} value={`hw_${h.id}`}>{h.name} (Hardware)</SelectItem>
                    ))}
                    {networkDevices && Array.isArray(networkDevices) && networkDevices.filter((n: any) => n.status === 'in_stock').map((n: any) => (
                      <SelectItem key={`net_${n.id}`} value={`net_${n.id}`}>{n.name} (Network)</SelectItem>
                    ))}
                    {generalInventory && Array.isArray(generalInventory) && generalInventory.filter((g: any) => g.status === 'in_stock').map((g: any) => (
                      <SelectItem key={`gen_${g.id}`} value={`gen_${g.id}`}>{g.name} (General)</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input 
                id="assignedTo" 
                {...form.register('assignedTo')}
                placeholder="Name of person or team"
              />
              {form.formState.errors.assignedTo && (
                <p className="text-sm text-red-500">{form.formState.errors.assignedTo.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Input 
                id="department" 
                {...form.register('department')}
                placeholder="Department or team"
              />
              {form.formState.errors.department && (
                <p className="text-sm text-red-500">{form.formState.errors.department.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignmentDate">Assignment Date</Label>
              <Input 
                id="assignmentDate" 
                type="date" 
                {...form.register('assignmentDate')}
                defaultValue={new Date().toISOString().split('T')[0]}
              />
              {form.formState.errors.assignmentDate && (
                <p className="text-sm text-red-500">{form.formState.errors.assignmentDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="returnDate">Expected Return Date</Label>
              <Input 
                id="returnDate" 
                type="date" 
                {...form.register('returnDate')}
              />
              {form.formState.errors.returnDate && (
                <p className="text-sm text-red-500">{form.formState.errors.returnDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => form.setValue('status', value)}
                defaultValue={form.getValues('status')}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="returned">Returned</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                {...form.register('notes')}
                placeholder="Additional information about this assignment"
                rows={3}
              />
              {form.formState.errors.notes && (
                <p className="text-sm text-red-500">{form.formState.errors.notes.message}</p>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={addAssignmentMutation.isPending}
            >
              {addAssignmentMutation.isPending ? 'Creating...' : 'Create Assignment'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
