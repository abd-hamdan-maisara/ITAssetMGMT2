import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { Redirect, Route, useLocation } from "wouter";

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
  requiredRoles?: string[];
}

export function ProtectedRoute({
  path,
  component: Component,
  requiredRoles = []
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  // Check if user has required role (if specified)
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <Route path={path}>
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <h1 className="text-2xl font-bold text-destructive mb-2">Access Denied</h1>
          <p className="text-muted-foreground text-center mb-4">
            You don't have permission to access this page. This area requires {requiredRoles.join(' or ')} privileges.
          </p>
          <button 
            className="text-primary hover:underline"
            onClick={() => setLocation('/')}
          >
            Return to Dashboard
          </button>
        </div>
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}