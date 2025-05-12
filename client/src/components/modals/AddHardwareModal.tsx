import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertHardwareSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddHardwareModalProps {
  open: boolean;
  onClose: () => void;
}

const hardwareFormSchema = insertHardwareSchema.extend({
  purchaseDate: z.string().optional(),
  warrantyExpiry: z.string().optional(),
});

type HardwareFormValues = z.infer<typeof hardwareFormSchema>;

export function AddHardwareModal({ open, onClose }: AddHardwareModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<HardwareFormValues>({
    resolver: zodResolver(hardwareFormSchema),
    defaultValues: {
      name: '',
      type: 'laptop',
      manufacturer: '',
      model: '',
      serialNumber: '',
      purchaseDate: '',
      warrantyExpiry: '',
      status: 'in_stock',
      location: '',
      assignedTo: '',
      notes: '',
      imageUrl: '',
    },
  });
  
  const addHardwareMutation = useMutation({
    mutationFn: async (data: HardwareFormValues) => {
      // Convert date strings to Date objects if they exist
      const formattedData = {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
        warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/hardware', formattedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Hardware Added',
        description: 'The hardware has been successfully added to inventory.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/hardware'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add hardware: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: HardwareFormValues) => {
    addHardwareMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Hardware</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Hardware Type</Label>
              <Select 
                onValueChange={(value) => form.setValue('type', value as any)}
                defaultValue={form.getValues('type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="monitor">Monitor</SelectItem>
                  <SelectItem value="printer">Printer</SelectItem>
                  <SelectItem value="network">Network Equipment</SelectItem>
                  <SelectItem value="peripheral">Peripheral</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
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
              <Label htmlFor="name">Name/Description</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="Enter a descriptive name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manufacturer">Manufacturer</Label>
              <Input 
                id="manufacturer" 
                {...form.register('manufacturer')}
                placeholder="e.g. Dell, HP, Cisco"
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
                placeholder="e.g. XPS 15, EliteBook 840"
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
            
            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry</Label>
              <Input 
                id="warrantyExpiry" 
                type="date" 
                {...form.register('warrantyExpiry')}
              />
              {form.formState.errors.warrantyExpiry && (
                <p className="text-sm text-red-500">{form.formState.errors.warrantyExpiry.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                {...form.register('location')}
                placeholder="e.g. IT Storage, Server Room"
              />
              {form.formState.errors.location && (
                <p className="text-sm text-red-500">{form.formState.errors.location.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="assignedTo">Assigned To</Label>
              <Input 
                id="assignedTo" 
                {...form.register('assignedTo')}
                placeholder="Person or department (if assigned)"
              />
              {form.formState.errors.assignedTo && (
                <p className="text-sm text-red-500">{form.formState.errors.assignedTo.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input 
                id="imageUrl" 
                {...form.register('imageUrl')}
                placeholder="URL to image of the hardware"
              />
              {form.formState.errors.imageUrl && (
                <p className="text-sm text-red-500">{form.formState.errors.imageUrl.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                {...form.register('notes')}
                placeholder="Additional information about this hardware"
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
              disabled={addHardwareMutation.isPending}
            >
              {addHardwareMutation.isPending ? 'Adding...' : 'Add Hardware'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
