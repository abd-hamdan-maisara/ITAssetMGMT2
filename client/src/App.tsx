import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Categories from "@/pages/categories";
import Orders from "@/pages/orders";
import Suppliers from "@/pages/suppliers";
import Reports from "@/pages/reports";
import Settings from "@/pages/settings";
import { Sidebar } from "@/components/ui/sidebar";
import Header from "@/components/ui/header";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard}/>
      <Route path="/products" component={Products}/>
      <Route path="/categories" component={Categories}/>
      <Route path="/orders" component={Orders}/>
      <Route path="/suppliers" component={Suppliers}/>
      <Route path="/reports" component={Reports}/>
      <Route path="/settings" component={Settings}/>
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);

  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
