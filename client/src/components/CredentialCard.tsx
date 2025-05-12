import { useState } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Credential } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { Copy, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied',
      description: `${field} copied to clipboard`,
    });
  };

  const getCredentialIcon = (type: string) => {
    switch (type) {
      case 'network':
        return (
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M2 11h2"></path>
              <path d="M10 11h2"></path>
              <path d="M18 11h2"></path>
              <path d="M14 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M8 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M18 11a1 1 0 1 0 2 0 1 1 0 0 0-2 0z"></path>
              <path d="M6 11v-3a6 6 0 0 1 12 0v3"></path>
            </svg>
          </div>
        );
      case 'server':
        return (
          <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="8" x="2" y="2" rx="2" ry="2"></rect>
              <rect width="20" height="8" x="2" y="14" rx="2" ry="2"></rect>
              <line x1="6" x2="6" y1="6" y2="6"></line>
              <line x1="6" x2="6" y1="18" y2="18"></line>
            </svg>
          </div>
        );
      case 'api':
        return (
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
          </div>
        );
      case 'database':
        return (
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
            </svg>
          </div>
        );
      default:
        return (
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path>
            </svg>
          </div>
        );
    }
  };

  const isExpiringSoon = credential.expirationDate && new Date(credential.expirationDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const isExpired = credential.expirationDate && new Date(credential.expirationDate) < new Date();

  return (
    <Card className="overflow-hidden">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <div className="flex items-center space-x-3">
          {getCredentialIcon(credential.type)}
          <div>
            <h3 className="font-medium">{credential.name}</h3>
            <p className="text-xs text-muted-foreground capitalize">{credential.type}</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4 text-primary" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">Username</label>
            <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
              <span className="font-mono text-sm">{credential.username}</span>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => copyToClipboard(credential.username, 'Username')}
              >
                <Copy className="h-4 w-4 text-primary" />
              </Button>
            </div>
          </div>
          
          <div>
            <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">Password</label>
            <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
              <span className="font-mono text-sm">
                {showPassword ? credential.password : '••••••••••••'}
              </span>
              <div className="flex">
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4 text-primary" /> : <Eye className="h-4 w-4 text-primary" />}
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(credential.password, 'Password')}
                >
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>
          
          {credential.ipAddress && (
            <div>
              <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">IP Address</label>
              <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
                <span className="font-mono text-sm">{credential.ipAddress}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(credential.ipAddress || '', 'IP Address')}
                >
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          )}
          
          {credential.url && (
            <div>
              <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">URL</label>
              <div className="flex items-center justify-between bg-muted rounded px-3 py-2">
                <span className="font-mono text-sm truncate">{credential.url}</span>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => copyToClipboard(credential.url || '', 'URL')}
                >
                  <Copy className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          )}
          
          {credential.notes && (
            <div>
              <label className="block text-xs uppercase text-muted-foreground font-medium mb-1">Notes</label>
              <p className="text-sm">{credential.notes}</p>
            </div>
          )}

          {isExpired && (
            <div className="mt-3 p-2 bg-destructive/10 text-destructive text-sm rounded">
              This credential has expired and should be updated immediately.
            </div>
          )}
          
          {!isExpired && isExpiringSoon && credential.expirationDate && (
            <div className="mt-3 p-2 bg-amber-500/10 text-amber-500 text-sm rounded">
              Expires in {formatDistanceToNow(new Date(credential.expirationDate))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 border-t border-border flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {credential.lastUpdated && formatDistanceToNow(new Date(credential.lastUpdated), { addSuffix: true })}
        </span>
        <Button variant="outline" size="sm">Test Connection</Button>
      </CardFooter>
    </Card>
  );
}
