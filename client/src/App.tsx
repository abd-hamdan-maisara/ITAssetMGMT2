import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Hardware from "@/pages/Hardware";
import Networking from "@/pages/Networking";
import Credentials from "@/pages/Credentials";
import Assignments from "@/pages/Assignments";
import Reports from "@/pages/reports";
import Users from "@/pages/Users";
import AuthPage from "@/pages/auth-page";
import { Sidebar } from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { useState } from "react";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={Dashboard} />
      <ProtectedRoute path="/hardware" component={Hardware} />
      <ProtectedRoute path="/networking" component={Networking} />
      <ProtectedRoute path="/credentials" component={Credentials} />
      <ProtectedRoute path="/assignments" component={Assignments} />
      <ProtectedRoute path="/reports" component={Reports} />
      <ProtectedRoute path="/users" component={Users} />
      <Route path="/auth" component={AuthPage} />
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="flex h-screen overflow-hidden">
            <Sidebar 
              open={sidebarOpen} 
              setOpen={setSidebarOpen} 
            />
            <div className="flex-1 flex flex-col overflow-hidden">
              <Header 
                sidebarOpen={sidebarOpen} 
                setSidebarOpen={setSidebarOpen} 
              />
              <main className="flex-1 overflow-y-auto p-4 bg-gray-50" aria-label="Main content">
                <Router />
              </main>
            </div>
          </div>
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
