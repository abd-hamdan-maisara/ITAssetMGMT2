import { useState } from "react";
import { Helmet } from "react-helmet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { useInventory } from "@/hooks/use-inventory";
import { CalendarIcon, Download, BarChart, PieChart, LineChart, Filter, RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Product, Category } from "@shared/schema";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export default function Reports() {
  const [reportType, setReportType] = useState("inventory");
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined,
  });
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  const { useProducts, useCategories, useLowStockProducts } = useInventory();
  
  const { data: products = [], isLoading: isProductsLoading } = useProducts();
  const { data: categories = [], isLoading: isCategoriesLoading } = useCategories();
  const { data: lowStockProducts = [], isLoading: isLowStockLoading } = useLowStockProducts();
  
  const isLoading = isProductsLoading || isCategoriesLoading || isLowStockLoading;

  // Filter products by category if needed
  const filteredProducts = categoryFilter === "all" 
    ? products 
    : products.filter(product => product.categoryId === parseInt(categoryFilter));
  
  // Get products by category for chart data
  const productsByCategory = categories.map(category => {
    const count = products.filter(product => product.categoryId === category.id).length;
    return { name: category.name, count };
  });
  
  // Calculate total product value
  const totalInventoryValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
  
  // Get low stock percentage
  const lowStockPercentage = products.length > 0 ? Math.round((lowStockProducts.length / products.length) * 100) : 0;

  return (
    <>
      <Helmet>
        <title>Reports | InvenTrack</title>
        <meta name="description" content="View inventory reports, analytics, and insights" />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold">Reports</h2>
        <div className="mt-3 md:mt-0 flex flex-wrap gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-2" />
                {dateRange.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Select date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                selected={dateRange}
                onSelect={setDateRange as any}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
          
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="inventory" onValueChange={setReportType} className="mb-6">
        <TabsList>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="sales">Orders</TabsTrigger>
          <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="inventory" className="space-y-6 mt-6">
          {isLoading ? (
            <div className="flex items-center justify-center min-h-[30vh]">
              <div className="flex items-center space-x-2">
                <RefreshCw className="h-5 w-5 text-primary animate-spin" />
                <span>Loading report data...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{products.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {products.length > 0 ? "+0.5% from last month" : "No change"}
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Value</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      ${totalInventoryValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      +2.1% from last month
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-primary"
                    >
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{lowStockProducts.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {lowStockPercentage}% of total inventory
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Categories</CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      className="h-4 w-4 text-primary"
                    >
                      <rect width="20" height="14" x="2" y="5" rx="2" />
                      <path d="M2 10h20" />
                    </svg>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{categories.length}</div>
                    <p className="text-xs text-muted-foreground">
                      {categories.length > 0 ? "Across all product types" : "No categories"}
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle>Inventory Value by Category</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <svg 
                        viewBox="0 0 500 300" 
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Simplified bar chart */}
                        <g transform="translate(40, 20)">
                          <line x1="0" y1="240" x2="440" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                          
                          {productsByCategory.map((category, index) => {
                            const barWidth = 40;
                            const spacing = 25;
                            const x = index * (barWidth + spacing);
                            const height = Math.min(category.count * 30, 200);
                            const y = 240 - height;
                            
                            return (
                              <g key={index}>
                                <rect 
                                  x={x} 
                                  y={y} 
                                  width={barWidth} 
                                  height={height} 
                                  fill="#1976d2" 
                                  opacity="0.8" 
                                />
                                <text 
                                  x={x + barWidth/2} 
                                  y={240 + 15} 
                                  fontSize="10" 
                                  textAnchor="middle" 
                                  fill="#374151"
                                >
                                  {category.name}
                                </text>
                                <text 
                                  x={x + barWidth/2} 
                                  y={y - 5} 
                                  fontSize="10" 
                                  textAnchor="middle" 
                                  fill="#374151"
                                >
                                  {category.count}
                                </text>
                              </g>
                            );
                          })}
                          
                          {/* Y-axis */}
                          <line x1="0" y1="0" x2="0" y2="240" stroke="#e5e7eb" strokeWidth="1" />
                        </g>
                      </svg>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Stock Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px] flex items-center justify-center">
                      <svg 
                        viewBox="0 0 200 200" 
                        className="w-full h-full"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        {/* Simplified pie chart */}
                        <g transform="translate(100, 100)">
                          {/* In Stock */}
                          <path 
                            d="M 0 0 L 0 -80 A 80 80 0 0 1 80 0 Z" 
                            fill="#4CAF50" 
                          />
                          <text 
                            x="30" 
                            y="-30" 
                            fontSize="10" 
                            fill="white"
                          >
                            In Stock
                          </text>
                          
                          {/* Low Stock */}
                          <path 
                            d="M 0 0 L 80 0 A 80 80 0 0 1 0 80 Z" 
                            fill="#FFC107" 
                          />
                          <text 
                            x="30" 
                            y="30" 
                            fontSize="10" 
                            fill="white"
                          >
                            Low Stock
                          </text>
                          
                          {/* Out of Stock */}
                          <path 
                            d="M 0 0 L 0 80 A 80 80 0 0 1 -80 0 Z" 
                            fill="#F44336" 
                          />
                          <text 
                            x="-30" 
                            y="30" 
                            fontSize="10" 
                            fill="white"
                          >
                            Out of Stock
                          </text>
                          
                          {/* On Order */}
                          <path 
                            d="M 0 0 L -80 0 A 80 80 0 0 1 0 -80 Z" 
                            fill="#2196F3" 
                          />
                          <text 
                            x="-30" 
                            y="-30" 
                            fontSize="10" 
                            fill="white"
                          >
                            On Order
                          </text>
                        </g>
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Top Products by Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products
                        .sort((a, b) => (b.price * b.stock) - (a.price * a.stock))
                        .slice(0, 5)
                        .map((product) => {
                          const category = categories.find(c => c.id === product.categoryId);
                          const totalValue = product.price * product.stock;
                          
                          return (
                            <TableRow key={product.id}>
                              <TableCell className="font-medium">{product.name}</TableCell>
                              <TableCell>{category?.name || "Uncategorized"}</TableCell>
                              <TableCell>{product.stock} units</TableCell>
                              <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                              <TableCell className="text-right">${totalValue.toFixed(2)}</TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
        
        <TabsContent value="sales" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Orders Report</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Track your orders, view order history, and analyze purchasing patterns over time.
                </p>
                <Button>Generate Orders Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Truck className="h-10 w-10 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Suppliers Report</h3>
                <p className="text-gray-500 max-w-md mb-6">
                  Analyze supplier performance, order history, and track key supplier metrics.
                </p>
                <Button>Generate Suppliers Report</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  );
}
