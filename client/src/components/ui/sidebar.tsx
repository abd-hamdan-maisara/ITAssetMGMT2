import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Truck, 
  BarChart, 
  Settings, 
  ChevronDown, 
  ChevronUp, 
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { InventoryIcon } from "@/lib/inventory-icons";

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
        "bg-white transition-all duration-300 transform flex flex-col flex-shrink-0 w-64 fixed inset-y-0 z-30 lg:static lg:translate-x-0 shadow-md",
        open ? "translate-x-0" : "-translate-x-full"
      )}
      aria-label="Main Navigation"
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center space-x-2" aria-label="Inventory Management System">
          <InventoryIcon className="text-primary h-8 w-8" />
          <span className="font-bold text-xl">InvenTrack</span>
        </div>
        <button 
          onClick={() => setOpen(false)} 
          className="p-1 rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary lg:hidden"
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
            isActive("/") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )} aria-current={isActive("/") ? "page" : undefined}>
            <LayoutDashboard className="mr-3 h-5 w-5" />
            <span>Dashboard</span>
          </div>
        </Link>
        
        {/* Products */}
        <div>
          <button 
            onClick={() => setProductsSubmenuOpen(!productsSubmenuOpen)} 
            className={cn(
              "flex items-center justify-between px-4 py-2 w-full text-left rounded-md transition-colors",
              isProductsActive() ? "bg-primary-light text-white" : "text-gray-700 hover:bg-gray-100"
            )}
            aria-expanded={productsSubmenuOpen}
            aria-controls="products-submenu"
          >
            <div className="flex items-center">
              <Package className="mr-3 h-5 w-5" />
              <span>Products</span>
            </div>
            {productsSubmenuOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          
          <div 
            id="products-submenu" 
            className={cn(
              "pl-10 space-y-1 mt-1",
              productsSubmenuOpen ? "block" : "hidden"
            )}
          >
            <Link href="/products">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors",
                isActive("/products") ? "bg-primary-dark text-white" : "text-gray-700 hover:bg-gray-100"
              )}>
                <span>All Products</span>
              </div>
            </Link>
            <Link href="/categories">
              <div className={cn(
                "flex items-center px-4 py-2 rounded-md transition-colors",
                isActive("/categories") ? "bg-primary-dark text-white" : "text-gray-700 hover:bg-gray-100"
              )}>
                <span>Categories</span>
              </div>
            </Link>
          </div>
        </div>
        
        {/* Orders */}
        <Link href="/orders">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/orders") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
            <ShoppingCart className="mr-3 h-5 w-5" />
            <span>Orders</span>
          </div>
        </Link>
        
        {/* Suppliers */}
        <Link href="/suppliers">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/suppliers") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
            <Truck className="mr-3 h-5 w-5" />
            <span>Suppliers</span>
          </div>
        </Link>
        
        {/* Reports */}
        <Link href="/reports">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/reports") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
            <BarChart className="mr-3 h-5 w-5" />
            <span>Reports</span>
          </div>
        </Link>
        
        {/* Settings */}
        <Link href="/settings">
          <div className={cn(
            "flex items-center px-4 py-2 rounded-md transition-colors",
            isActive("/settings") ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"
          )}>
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </div>
        </Link>
      </nav>
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="User profile" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="text-sm font-medium">John Doe</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
