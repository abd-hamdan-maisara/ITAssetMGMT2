import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { NetworkDevice, NetworkDeviceStatus } from '@shared/schema';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const networkDeviceSchema = z.object({
  name: z.string().min(2, { message: 'Name is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  ipAddress: z.string().optional(),
  macAddress: z.string().optional(),
  location: z.string().optional(),
  manufacturer: z.string().optional(),
  model: z.string().optional(),
  serialNumber: z.string().optional(),
  firmwareVersion: z.string().optional(),
  status: z.string().default('active'),
  notes: z.string().optional(),
});

type NetworkDeviceFormData = z.infer<typeof networkDeviceSchema>;

interface EditNetworkDeviceModalProps {
  open: boolean;
  onClose: () => void;
  device: NetworkDevice | null;
}

export function EditNetworkDeviceModal({ open, onClose, device }: EditNetworkDeviceModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NetworkDeviceFormData>({
    resolver: zodResolver(networkDeviceSchema),
    defaultValues: {
      name: '',
      type: 'switch',
      ipAddress: '',
      macAddress: '',
      location: '',
      manufacturer: '',
      model: '',
      serialNumber: '',
      firmwareVersion: '',
      status: 'active',
      notes: '',
    },
  });

  // Update form values when device changes
  useEffect(() => {
    if (device) {
      form.reset({
        name: device.name,
        type: device.type,
        ipAddress: device.ipAddress || '',
        macAddress: device.macAddress || '',
        location: device.location || '',
        manufacturer: device.manufacturer || '',
        model: device.model || '',
        serialNumber: device.serialNumber || '',
        firmwareVersion: device.firmwareVersion || '',
        status: device.status,
        notes: device.notes || '',
      });
    }
  }, [device, form]);

  const updateNetworkDeviceMutation = useMutation({
    mutationFn: async (data: NetworkDeviceFormData) => {
      if (!device) return null;
      const response = await apiRequest('PATCH', `/api/network-devices/${device.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/network-devices'] });
      toast({
        title: 'Network Device Updated',
        description: 'The network device has been successfully updated.',
      });
      form.reset();
      onClose();
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: `Failed to update network device: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: NetworkDeviceFormData) => {
    if (!device) return;
    setIsSubmitting(true);
    updateNetworkDeviceMutation.mutate(data);
  };

  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Network Device</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Device name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="switch">Switch</SelectItem>
                        <SelectItem value="router">Router</SelectItem>
                        <SelectItem value="access_point">Access Point</SelectItem>
                        <SelectItem value="firewall">Firewall</SelectItem>
                        <SelectItem value="server">Server</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">Maintenance</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ipAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP Address</FormLabel>
                    <FormControl>
                      <Input placeholder="192.168.1.1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="macAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>MAC Address</FormLabel>
                    <FormControl>
                      <Input placeholder="00:1A:2B:3C:4D:5E" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="manufacturer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Manufacturer</FormLabel>
                    <FormControl>
                      <Input placeholder="Cisco" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl>
                      <Input placeholder="Catalyst 3750" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Serial Number</FormLabel>
                    <FormControl>
                      <Input placeholder="SN12345678" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="firmwareVersion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Firmware Version</FormLabel>
                    <FormControl>
                      <Input placeholder="15.2(4)E" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Server Room - Rack 3" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional information about this device"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Device'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}