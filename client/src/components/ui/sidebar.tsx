import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  BarChart, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { 
  HardwareIcon, 
  NetworkIcon, 
  CredentialIcon, 
  AssignmentIcon, 
  UsersIcon 
} from "@/lib/inventory-icons";

interface SidebarProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function Sidebar({ open, setOpen }: SidebarProps) {
  const [location] = useLocation();
  const [productsSubmenuOpen, setProductsSubmenuOpen] = useState(
    location === "/products" || location === "/categories"
  );

  const isActive = (path: string) => location === path;
  const isProductsActive = () => location === "/products" || location === "/categories";

  return (
    <aside 
      className={cn(
        "bg-card border-r border-border transition-all duration-300 transform flex flex-col flex-shrink-0 w-64 fixed inset-y-0 z-30 lg:static lg:translate-x-0 shadow-md",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-border">
        <div className="flex items-center space-x-2" aria-label="IT Management System">
          <HardwareIcon className="text-primary h-8 w-8" />
          <span className="font-bold text-xl">ITManager</span>
        </div>
        <button 
          onClick={() => setOpen(false)} 
          className="p-1 rounded-md text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {/* Dashboard */}
        <Link href="/">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )} aria-current={isActive("/") ? "page" : undefined}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </div>
        </Link>
        
        {/* Hardware */}
        <Link href="/hardware">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/hardware") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <HardwareIcon className="mr-3 h-5 w-5" />
            <span>Hardware</span>
          </div>
        </Link>
        
        {/* Networking */}
        <div>
          <button 
            onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)} 
            className={cn(
              "flex items-center justify-between px-4 py-2 w-full text-left rounded-md transition-colors",
              (isActive("/networking") || isActive("/vlans")) ? "bg-primary/90 text-primary-foreground" : "text-foreground hover:bg-muted"
            )}
            aria-expanded={productsSubmenuOpen}
            aria-controls="networking-submenu"
          >
            <div className="flex items-center">
              <NetworkIcon className="mr-3 h-5 w-5" />
              <span>Networking</span>
            </div>
            {productsSubmenuOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          <div 
            id="networking-submenu" 
            className={cn(
              "pl-10 space-y-1 mt-1",
              productsSubmenuOpen ? "block" : "hidden"
            )}
          >
            <Link href="/networking">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors",
                isActive("/networking") ? "bg-primary/80 text-primary-foreground" : "text-foreground hover:bg-muted"
              )}>
                <span>Devices</span>
              </div>
            </Link>
            <Link href="/vlans">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors",
                isActive("/vlans") ? "bg-primary/80 text-primary-foreground" : "text-foreground hover:bg-muted"
              )}>
                <span>VLANs</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Credentials */}
        <Link href="/credentials">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/credentials") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <CredentialIcon className="mr-3 h-5 w-5" />
            <span>Credentials</span>
          </div>
        </Link>
        
        {/* Assignments */}
        <Link href="/assignments">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/assignments") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <AssignmentIcon className="mr-3 h-5 w-5" />
            <span>Assignments</span>
          </div>
        </Link>
        
        {/* Users */}
        <Link href="/users">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/users") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <UsersIcon className="mr-3 h-5 w-5" />
            <span>Users</span>
          </div>
        </Link>
        
        {/* Reports */}
        <Link href="/reports">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/reports") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <BarChart className="mr-3 h-5 w-5" />
            <span>Reports</span>
          </div>
        </Link>
        
        {/* Settings */}
        <Link href="/settings">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/settings") ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted"
          )}>
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </div>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User profile" />
            <AvatarFallback>SA</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">System Administrator</p>
            <p className="text-xs text-muted-foreground">IT Department</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
