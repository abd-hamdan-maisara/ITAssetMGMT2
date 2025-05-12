import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import { AuthProvider } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/lib/protected-route";
import Dashboard from "@/pages/Dashboard";
import Hardware from "@/pages/Hardware";
import Credentials from "@/pages/Credentials";
import Networking from "@/pages/Networking";
import GeneralInventory from "@/pages/GeneralInventory";
import Assignments from "@/pages/Assignments";
import Reports from "@/pages/Reports";
import Users from "@/pages/Users";
import AuthPage from "@/pages/auth-page";
import NotFound from "@/pages/not-found";

// Role definitions for access control
const ADMIN_ROLES = ["admin"];
const MANAGER_ROLES = ["admin", "manager"];
const TECH_ROLES = ["admin", "manager", "technician"];
const ALL_ROLES = ["admin", "manager", "technician", "readonly"];

function Router() {
  return (
    <Switch>
      <Route path="/auth" component={AuthPage} />
      
      {/* Protected Routes with Layout */}
      <ProtectedRoute 
        path="/" 
        component={() => (
          <MainLayout>
            <Dashboard />
          </MainLayout>
        )} 
        requiredRoles={ALL_ROLES}
      />
      <ProtectedRoute 
        path="/hardware" 
        component={() => (
          <MainLayout>
            <Hardware />
          </MainLayout>
        )} 
        requiredRoles={TECH_ROLES}
      />
      <ProtectedRoute 
        path="/credentials" 
        component={() => (
          <MainLayout>
            <Credentials />
          </MainLayout>
        )} 
        requiredRoles={MANAGER_ROLES}
      />
      <ProtectedRoute 
        path="/networking" 
        component={() => (
          <MainLayout>
            <Networking />
          </MainLayout>
        )} 
        requiredRoles={TECH_ROLES}
      />
      <ProtectedRoute 
        path="/general" 
        component={() => (
          <MainLayout>
            <GeneralInventory />
          </MainLayout>
        )} 
        requiredRoles={TECH_ROLES}
      />
      <ProtectedRoute 
        path="/assignments" 
        component={() => (
          <MainLayout>
            <Assignments />
          </MainLayout>
        )} 
        requiredRoles={TECH_ROLES}
      />
      <ProtectedRoute 
        path="/reports" 
        component={() => (
          <MainLayout>
            <Reports />
          </MainLayout>
        )} 
        requiredRoles={MANAGER_ROLES}
      />
      <ProtectedRoute 
        path="/users" 
        component={() => (
          <MainLayout>
            <Users />
          </MainLayout>
        )} 
        requiredRoles={ADMIN_ROLES}
      />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
