import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { insertCredentialSchema } from '@shared/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Eye, EyeOff, Copy } from 'lucide-react';
import { useState } from 'react';

interface AddCredentialModalProps {
  open: boolean;
  onClose: () => void;
}

const credentialFormSchema = insertCredentialSchema.extend({
  expirationDate: z.string().optional(),
});

type CredentialFormValues = z.infer<typeof credentialFormSchema>;

export function AddCredentialModal({ open, onClose }: AddCredentialModalProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const form = useForm<CredentialFormValues>({
    resolver: zodResolver(credentialFormSchema),
    defaultValues: {
      name: '',
      type: 'network',
      username: '',
      password: '',
      url: '',
      ipAddress: '',
      notes: '',
      expirationDate: '',
    },
  });
  
  const addCredentialMutation = useMutation({
    mutationFn: async (data: CredentialFormValues) => {
      // Convert date string to Date object if it exists
      const formattedData = {
        ...data,
        expirationDate: data.expirationDate ? new Date(data.expirationDate) : undefined,
      };
      
      const response = await apiRequest('POST', '/api/credentials', formattedData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: 'Credential Added',
        description: 'The credential has been successfully added to the vault.',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/credentials'] });
      queryClient.invalidateQueries({ queryKey: ['/api/activity-logs'] });
      form.reset();
      onClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Failed to add credential: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  const onSubmit = (data: CredentialFormValues) => {
    addCredentialMutation.mutate(data);
  };

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${field} copied to clipboard`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Credential</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Credential Name</Label>
              <Input 
                id="name" 
                {...form.register('name')}
                placeholder="e.g. Core Switch Admin, File Server Root"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">{form.formState.errors.name.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Credential Type</Label>
              <Select 
                onValueChange={(value) => form.setValue('type', value as any)}
                defaultValue={form.getValues('type')}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="network">Network Device</SelectItem>
                  <SelectItem value="server">Server</SelectItem>
                  <SelectItem value="service">Service</SelectItem>
                  <SelectItem value="database">Database</SelectItem>
                  <SelectItem value="api">API Key</SelectItem>
                </SelectContent>
              </Select>
              {form.formState.errors.type && (
                <p className="text-sm text-red-500">{form.formState.errors.type.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex">
                <Input 
                  id="username" 
                  {...form.register('username')}
                  placeholder="Enter username"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="ml-1"
                  onClick={() => copyToClipboard(form.getValues('username'), 'Username')}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              {form.formState.errors.username && (
                <p className="text-sm text-red-500">{form.formState.errors.username.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"}
                  {...form.register('password')}
                  placeholder="Enter password"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="ml-1"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? 'Hide' : 'Show'} password</span>
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  className="ml-1"
                  onClick={() => copyToClipboard(form.getValues('password'), 'Password')}
                >
                  <Copy className="h-4 w-4" />
                  <span className="sr-only">Copy</span>
                </Button>
              </div>
              {form.formState.errors.password && (
                <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="url">URL/Endpoint</Label>
              <Input 
                id="url" 
                {...form.register('url')}
                placeholder="e.g. https://service.example.com"
              />
              {form.formState.errors.url && (
                <p className="text-sm text-red-500">{form.formState.errors.url.message}</p>
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
              <Label htmlFor="expirationDate">Expiration Date</Label>
              <Input 
                id="expirationDate" 
                type="date" 
                {...form.register('expirationDate')}
              />
              {form.formState.errors.expirationDate && (
                <p className="text-sm text-red-500">{form.formState.errors.expirationDate.message}</p>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea 
                id="notes" 
                {...form.register('notes')}
                placeholder="Additional information about this credential"
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
              disabled={addCredentialMutation.isPending}
            >
              {addCredentialMutation.isPending ? 'Adding...' : 'Add Credential'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
