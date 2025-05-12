import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { MainLayout } from "@/components/layout/MainLayout";
import Dashboard from "@/pages/Dashboard";
import Hardware from "@/pages/Hardware";
import Credentials from "@/pages/Credentials";
import Networking from "@/pages/Networking";
import GeneralInventory from "@/pages/GeneralInventory";
import Assignments from "@/pages/Assignments";
import Reports from "@/pages/Reports";
import Users from "@/pages/Users";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <MainLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/hardware" component={Hardware} />
        <Route path="/credentials" component={Credentials} />
        <Route path="/networking" component={Networking} />
        <Route path="/general" component={GeneralInventory} />
        <Route path="/assignments" component={Assignments} />
        <Route path="/reports" component={Reports} />
        <Route component={NotFound} />
      </Switch>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
