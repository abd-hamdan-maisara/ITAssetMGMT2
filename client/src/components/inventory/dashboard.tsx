import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { InventoryCard } from "./inventory-card";
import { LowStockTable } from "./low-stock-table";
import { ActivityList } from "./activity-list";
import { Package, AlertTriangle, ShoppingCart, Truck } from "lucide-react";
import { DashboardStats, Product, Activity } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";

export function Dashboard() {
  const [isChartLoading, setIsChartLoading] = useState(true);

  // Fetch dashboard stats
  const { data: stats, isLoading: isStatsLoading } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Fetch low stock products
  const { data: lowStockProducts, isLoading: isLowStockLoading } = useQuery<Product[]>({
    queryKey: ['/api/products/low-stock'],
  });

  // Fetch recent activities
  const { data: activities, isLoading: isActivitiesLoading } = useQuery<Activity[]>({
    queryKey: ['/api/activities'],
    queryFn: async () => {
      const response = await apiRequest('GET', '/api/activities?limit=4');
      return response.json();
    },
  });

  // Simulate chart loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChartLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const isLoading = isStatsLoading || isLowStockLoading || isActivitiesLoading || isChartLoading;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading dashboard data...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Inventory Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Summary Cards */}
          <InventoryCard
            title="Total Products"
            value={stats?.totalProducts || 0}
            change={5}
            isPositive={true}
            icon={<Package className="h-5 w-5" />}
            color="primary"
          />
          
          <InventoryCard
            title="Low Stock Items"
            value={stats?.lowStockItems || 0}
            change={12}
            isPositive={false}
            icon={<AlertTriangle className="h-5 w-5" />}
            color="secondary"
          />
          
          <InventoryCard
            title="Active Orders"
            value={stats?.activeOrders || 0}
            change={3}
            isPositive={true}
            icon={<ShoppingCart className="h-5 w-5" />}
            color="success"
          />
          
          <InventoryCard
            title="Suppliers"
            value={stats?.totalSuppliers || 0}
            change={0}
            isPositive={true}
            icon={<Truck className="h-5 w-5" />}
            color="warning"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Inventory Status */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-medium">Inventory Status</h3>
            <div>
              <button className="text-sm text-primary hover:text-primary-dark">View All</button>
            </div>
          </div>
          <div className="p-4">
            {/* Placeholder for chart */}
            <div className="h-64 bg-gray-100 rounded-md flex items-center justify-center">
              <svg
                width="100%"
                height="100%"
                viewBox="0 0 800 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="800" height="400" fill="#f9fafb" />
                <text
                  x="50%"
                  y="50%"
                  fontFamily="Arial"
                  fontSize="16"
                  fill="#6b7280"
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  Inventory Status Chart
                </text>
                {/* Simple bar chart */}
                <g transform="translate(100, 50)">
                  <rect x="0" y="250" width="80" height="50" fill="#1976d2" opacity="0.8" />
                  <rect x="120" y="200" width="80" height="100" fill="#1976d2" opacity="0.8" />
                  <rect x="240" y="150" width="80" height="150" fill="#1976d2" opacity="0.8" />
                  <rect x="360" y="100" width="80" height="200" fill="#1976d2" opacity="0.8" />
                  <rect x="480" y="180" width="80" height="120" fill="#1976d2" opacity="0.8" />
                  
                  <text x="40" y="270" fontFamily="Arial" fontSize="12" fill="#fff" textAnchor="middle">Electronics</text>
                  <text x="160" y="220" fontFamily="Arial" fontSize="12" fill="#fff" textAnchor="middle">Accessories</text>
                  <text x="280" y="170" fontFamily="Arial" fontSize="12" fill="#fff" textAnchor="middle">Audio</text>
                  <text x="400" y="120" fontFamily="Arial" fontSize="12" fill="#fff" textAnchor="middle">Wearables</text>
                  <text x="520" y="200" fontFamily="Arial" fontSize="12" fill="#fff" textAnchor="middle">Other</text>
                  
                  <line x1="0" y1="300" x2="600" y2="300" stroke="#d1d5db" strokeWidth="1" />
                  <text x="300" y="330" fontFamily="Arial" fontSize="14" fill="#4b5563" textAnchor="middle">Product Categories</text>
                  
                  <text x="-40" y="300" fontFamily="Arial" fontSize="14" fill="#4b5563" textAnchor="middle" transform="rotate(-90, -40, 150)">Inventory Count</text>
                </g>
              </svg>
            </div>
          </div>
        </div>
        
        {/* Recent Activities */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-4 py-3 border-b border-gray-200">
            <h3 className="font-medium">Recent Activities</h3>
          </div>
          <ActivityList activities={activities || []} />
        </div>
      </div>
      
      {/* Low Stock Items */}
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Low Stock Items</h2>
          <button className="text-sm text-white bg-primary hover:bg-primary-dark px-4 py-2 rounded-md flex items-center">
            <span className="mr-1">+</span>
            Create Order
          </button>
        </div>
        
        <LowStockTable products={lowStockProducts || []} />
      </div>
    </div>
  );
}
