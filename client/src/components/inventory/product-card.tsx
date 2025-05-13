import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Edit, Eye } from "lucide-react";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation({
    mutationFn: async (updatedProduct: Partial<Product>) => {
      return apiRequest("PATCH", `/api/products/${product.id}`, updatedProduct);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      queryClient.invalidateQueries({ queryKey: ['/api/products/low-stock'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    }
  });

  const getStockStatus = () => {
    if (product.stock <= 0) {
      return { label: "Out of Stock", bgColor: "bg-red-500" };
    } else if (product.stock <= product.minStockLevel) {
      return { label: "Low Stock", bgColor: "bg-amber-500" };
    } else {
      return { label: "In Stock", bgColor: "bg-green-500" };
    }
  };

  const stockStatus = getStockStatus();

  return (
    <Card className="overflow-hidden">
      <div className="h-48 bg-gray-200 relative">
        <div className="h-full w-full bg-gray-200 flex items-center justify-center">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl}
              alt={product.name} 
              className="h-full w-full object-cover"
            />
          ) : (
            <svg className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          )}
        </div>
        <span className={cn(
          "absolute top-2 right-2 px-2 py-1 text-white text-xs rounded-full",
          stockStatus.bgColor
        )}>
          {stockStatus.label}
        </span>
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
        <div className="flex justify-between items-center mt-2">
          <p className="font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-sm">Stock: {product.stock} units</p>
        </div>
        <div className="mt-4 flex space-x-2">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center"
            onClick={() => {
              // Handle edit action
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            disabled={isLoading}
          >
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
          <Button 
            className="flex-1 flex items-center justify-center"
            onClick={() => {
              // Handle view action
              setIsLoading(true);
              setTimeout(() => setIsLoading(false), 500);
            }}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-1" />
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
