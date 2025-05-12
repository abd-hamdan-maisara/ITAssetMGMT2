import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertNetworkDeviceSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddNetworkDeviceModalProps {
  open: boolean;
  onClose: () => void;
}

const networkFormSchema = insertNetworkDeviceSchema.extend({
  purchaseDate: z.string().optional(),
});

type NetworkFormValues = z.infer<typeof networkFormSchema>;

export function AddNetworkDeviceModal({ open, onClose }: AddNetworkDeviceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<NetworkFormValues>({
    resolver: zodResolver(networkFormSchema),
    defaultValues: {
      name: '',
      type: 'switch',
      manufacturer: '',
      model: '',
      serialNumber: '',
      ipAddress: '',
      macAddress: '',
      location: '',
      status: 'in_stock',
      notes: '',
      purchaseDate: '',
    },
  });
  
  const addNetworkDeviceMutation = useMutation({
    mutationFn: async (data: NetworkFormValues) => {
      // Convert date string to Date object if it exists
      const formattedData = {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/network-devices', formattedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Network Device Added',
        description: 'The network device has been successfully added to inventory.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add network device: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: NetworkFormValues) => {
    addNetworkDeviceMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Network Device</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Device Name</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="e.g. Core Switch, Edge Router"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Device Type</Label>
              <Input 
                id="type" 
                {...form.register('type')}
                placeholder="e.g. switch, router, firewall"
              />
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input 
                id="manufacturer" 
                {...form.register('manufacturer')}
                placeholder="e.g. Cisco, Juniper, Ubiquiti"
              />
              {form.formState.errors.manufacturer && (
                <p className="text-sm text-red-500">{form.formState.errors.manufacturer.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input 
                id="model" 
                {...form.register('model')}
                placeholder="e.g. Catalyst 9300, SRX300"
              />
              {form.formState.errors.model && (
                <p className="text-sm text-red-500">{form.formState.errors.model.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input 
                id="serialNumber" 
                {...form.register('serialNumber')}
                placeholder="Enter serial number"
              />
              {form.formState.errors.serialNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.serialNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ipAddress">IP Address</Label>
              <Input 
                id="ipAddress" 
                {...form.register('ipAddress')}
                placeholder="e.g. 192.168.1.1"
              />
              {form.formState.errors.ipAddress && (
                <p className="text-sm text-red-500">{form.formState.errors.ipAddress.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="macAddress">MAC Address</Label>
              <Input 
                id="macAddress" 
                {...form.register('macAddress')}
                placeholder="e.g. 00:1A:2B:3C:4D:5E"
              />
              {form.formState.errors.macAddress && (
                <p className="text-sm text-red-500">{form.formState.errors.macAddress.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                {...form.register('location')}
                placeholder="e.g. Server Room, MDF, IDF"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                onValueChange={(value) => form.setValue('status', value as any)}
                defaultValue={form.getValues('status')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_stock">In Stock</SelectItem>
                  <SelectItem value="assigned">Assigned</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.status && (
                <p className="text-sm text-red-500">{form.formState.errors.status.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input 
                id="purchaseDate" 
                type="date" 
                {...form.register('purchaseDate')}
              />
              {form.formState.errors.purchaseDate && (
                <p className="text-sm text-red-500">{form.formState.errors.purchaseDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                {...form.register('notes')}
                placeholder="Additional information about this device"
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
              disabled={addNetworkDeviceMutation.isPending}
            >
              {addNetworkDeviceMutation.isPending ? 'Adding...' : 'Add Network Device'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
