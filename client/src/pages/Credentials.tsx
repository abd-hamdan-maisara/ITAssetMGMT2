import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCredentials } from '@/hooks/useCredentials';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AddCredentialModal } from '@/components/modals/AddCredentialModal';
import { CredentialCard } from '@/components/CredentialCard';
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  Key,
  AlertCircle
} from 'lucide-react';
import { Credential } from '@shared/schema';

export default function CredentialsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: credentials, isLoading, error } = useQuery<Credential[]>({
    queryKey: ['/api/credentials'],
  });

  const filteredCredentials = credentials?.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.ipAddress && item.ipAddress.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Credentials Management</h1>
          <p className="text-muted-foreground">Securely manage access credentials for all systems</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Credential
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search credentials..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Select 
              value={typeFilter}
              onValueChange={setTypeFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="network">Network Devices</SelectItem>
                <SelectItem value="server">Servers</SelectItem>
                <SelectItem value="service">Services</SelectItem>
                <SelectItem value="database">Databases</SelectItem>
                <SelectItem value="api">API Keys</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </div>
      </div>

      {/* Credentials Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-[300px] rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : error ? (
        <div className="bg-white dark:bg-card rounded-lg shadow p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="text-lg font-medium mb-2">Error Loading Credentials</h3>
          <p className="text-muted-foreground">There was a problem fetching the credentials.</p>
        </div>
      ) : filteredCredentials && filteredCredentials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCredentials.map((credential) => (
            <CredentialCard 
              key={credential.id}
              credential={credential}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-card rounded-lg shadow p-8 text-center">
          <Key className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No Credentials Found</h3>
          <p className="text-muted-foreground">No credentials match your current filters.</p>
          <Button className="mt-4" onClick={() => {
            setSearchTerm('');
            setTypeFilter('all');
          }}>
            Clear Filters
          </Button>
        </div>
      )}

      {/* Credential Vault Overview */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-semibold">Credential Vault Overview</h3>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-primary">
                {isLoading ? "..." : credentials?.length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Total Credentials</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-500">
                {isLoading ? "..." : credentials?.filter(c => c.type === 'network').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Network Devices</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-amber-500">
                {isLoading ? "..." : credentials?.filter(c => c.expirationDate && new Date(c.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Expiring Soon</div>
            </div>
            <div className="bg-muted rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-destructive">
                {isLoading ? "..." : credentials?.filter(c => c.expirationDate && new Date(c.expirationDate) < new Date()).length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Need Rotation</div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddCredentialModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
