import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  Product, 
  Category, 
  Supplier, 
  Order, 
  Activity, 
  DashboardStats,
  InsertProduct,
  InsertCategory,
  InsertSupplier,
  InsertOrder
} from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useInventory() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Dashboard
  const useStats = () => useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
  });

  // Products
  const useProducts = () => useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const useLowStockProducts = () => useQuery<Product[]>({
    queryKey: ['/api/products/low-stock'],
  });

  const useProductsByCategoryId = (categoryId: number) => useQuery<Product[]>({
    queryKey: ['/api/products', { categoryId }],
    queryFn: async () => {
      const response = await apiRequest('GET', `/api/products?categoryId=${categoryId}`);
      return response.json();
    },
    enabled: !!categoryId,
  });

  const useAddProduct = () => {
    return useMutation({
      mutationFn: async (product: InsertProduct) => {
        return apiRequest('POST', '/api/products', product);
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Product added successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add product",
          variant: "destructive",
        });
        console.error("Failed to add product:", error);
      },
    });
  };

  const useUpdateProduct = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: number; data: Partial<Product> }) => {
        return apiRequest('PATCH', `/api/products/${id}`, data);
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        queryClient.invalidateQueries({ queryKey: ['/api/products/low-stock'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
        console.error("Failed to update product:", error);
      },
    });
  };

  const useUpdateProductStock = () => {
    return useMutation({
      mutationFn: async ({ id, stock }: { id: number; stock: number }) => {
        return apiRequest('PATCH', `/api/products/${id}/stock`, { stock });
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Stock updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/products'] });
        queryClient.invalidateQueries({ queryKey: ['/api/products/low-stock'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update stock",
          variant: "destructive",
        });
        console.error("Failed to update stock:", error);
      },
    });
  };

  // Categories
  const useCategories = () => useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const useAddCategory = () => {
    return useMutation({
      mutationFn: async (category: InsertCategory) => {
        return apiRequest('POST', '/api/categories', category);
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Category added successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add category",
          variant: "destructive",
        });
        console.error("Failed to add category:", error);
      },
    });
  };

  // Suppliers
  const useSuppliers = () => useQuery<Supplier[]>({
    queryKey: ['/api/suppliers'],
  });

  const useAddSupplier = () => {
    return useMutation({
      mutationFn: async (supplier: InsertSupplier) => {
        return apiRequest('POST', '/api/suppliers', supplier);
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Supplier added successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/suppliers'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to add supplier",
          variant: "destructive",
        });
        console.error("Failed to add supplier:", error);
      },
    });
  };

  // Orders
  const useOrders = () => useQuery<Order[]>({
    queryKey: ['/api/orders'],
  });

  const useActiveOrders = () => useQuery<Order[]>({
    queryKey: ['/api/orders/active'],
  });

  const useAddOrder = () => {
    return useMutation({
      mutationFn: async ({ order, items }: { order: InsertOrder; items: any[] }) => {
        return apiRequest('POST', '/api/orders', { order, items });
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Order created successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        queryClient.invalidateQueries({ queryKey: ['/api/orders/active'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to create order",
          variant: "destructive",
        });
        console.error("Failed to create order:", error);
      },
    });
  };

  const useUpdateOrderStatus = () => {
    return useMutation({
      mutationFn: async ({ id, status }: { id: number; status: string }) => {
        return apiRequest('PATCH', `/api/orders/${id}/status`, { status });
      },
      onSuccess: () => {
        toast({
          title: "Success",
          description: "Order status updated successfully",
        });
        queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
        queryClient.invalidateQueries({ queryKey: ['/api/orders/active'] });
        queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
      },
      onError: (error) => {
        toast({
          title: "Error",
          description: "Failed to update order status",
          variant: "destructive",
        });
        console.error("Failed to update order status:", error);
      },
    });
  };

  // Activities
  const useActivities = (limit?: number) => useQuery<Activity[]>({
    queryKey: ['/api/activities', { limit }],
    queryFn: async () => {
      const response = await apiRequest('GET', limit ? `/api/activities?limit=${limit}` : '/api/activities');
      return response.json();
    },
  });

  return {
    useStats,
    useProducts,
    useLowStockProducts,
    useProductsByCategoryId,
    useAddProduct,
    useUpdateProduct,
    useUpdateProductStock,
    useCategories,
    useAddCategory,
    useSuppliers,
    useAddSupplier,
    useOrders,
    useActiveOrders,
    useAddOrder,
    useUpdateOrderStatus,
    useActivities,
  };
}
