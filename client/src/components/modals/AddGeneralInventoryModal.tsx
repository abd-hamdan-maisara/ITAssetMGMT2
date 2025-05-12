import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertGeneralInventorySchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

interface AddGeneralInventoryModalProps {
  open: boolean;
  onClose: () => void;
}

const inventoryFormSchema = insertGeneralInventorySchema.extend({
  purchaseDate: z.string().optional(),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

export function AddGeneralInventoryModal({ open, onClose }: AddGeneralInventoryModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
      serialNumber: '',
      quantity: 1,
      location: '',
      status: 'in_stock',
      notes: '',
      purchaseDate: '',
    },
  });
  
  const addInventoryItemMutation = useMutation({
    mutationFn: async (data: InventoryFormValues) => {
      // Convert date string to Date object if it exists
      const formattedData = {
        ...data,
        purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/general-inventory', formattedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Inventory Item Added',
        description: 'The item has been successfully added to general inventory.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/general-inventory'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add inventory item: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: InventoryFormValues) => {
    addInventoryItemMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add Inventory Item</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="Enter item name"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                onValueChange={(value) => form.setValue('category', value)}
                defaultValue={form.getValues('category')}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="storage">Storage Devices</SelectItem>
                  <SelectItem value="av">AV Equipment</SelectItem>
                  <SelectItem value="peripheral">Peripherals</SelectItem>
                  <SelectItem value="printing">Printing</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="workstation">Workstation</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.category && (
                <p className="text-sm text-red-500">{form.formState.errors.category.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <Input 
                id="serialNumber" 
                {...form.register('serialNumber')}
                placeholder="Enter serial number (optional)"
              />
              {form.formState.errors.serialNumber && (
                <p className="text-sm text-red-500">{form.formState.errors.serialNumber.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input 
                id="quantity" 
                type="number"
                {...form.register('quantity', { valueAsNumber: true })}
                min="1"
                defaultValue="1"
              />
              {form.formState.errors.quantity && (
                <p className="text-sm text-red-500">{form.formState.errors.quantity.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input 
                id="location" 
                {...form.register('location')}
                placeholder="Where is this item stored?"
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
                <SelectTrigger id="status">
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
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                {...form.register('description')}
                placeholder="Enter item description"
                rows={3}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">{form.formState.errors.description.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                {...form.register('notes')}
                placeholder="Additional notes about this item"
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
              disabled={addInventoryItemMutation.isPending}
            >
              {addInventoryItemMutation.isPending ? 'Adding...' : 'Add Item'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
