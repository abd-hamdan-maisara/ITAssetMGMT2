import { Button } from "@/components/ui/button";
import { Product } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { AlertTriangle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface LowStockTableProps {
  products: Product[];
}

export function LowStockTable({ products }: LowStockTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [reorderingProduct, setReorderingProduct] = useState<number | null>(null);

  const reorderMutation = useMutation({
    mutationFn: async (productId: number) => {
      // Simulating reorder API call
      return new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      toast({
        title: "Reorder placed",
        description: "A reorder has been placed for this product.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/products'] });
      setReorderingProduct(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to place reorder. Please try again.",
        variant: "destructive",
      });
      setReorderingProduct(null);
    }
  });

  const handleReorder = (productId: number) => {
    setReorderingProduct(productId);
    reorderMutation.mutate(productId);
  };

  const getStockStatusBadge = (product: Product) => {
    if (product.stock === 0) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Out of Stock
        </span>
      );
    } else if (product.stock <= product.minStockLevel / 2) {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
          Critical
        </span>
      );
    } else {
      return (
        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-amber-100 text-amber-800">
          Low
        </span>
      );
    }
  };

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Low Stock Items</h3>
        <p className="text-gray-500 text-center">
          All products are currently above their minimum stock levels.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[300px]">Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Reorder</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 rounded bg-gray-200">
                      {product.imageUrl ? (
                        <AvatarImage src={product.imageUrl} alt={product.name} className="object-cover" />
                      ) : (
                        <AvatarFallback>{product.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      )}
                    </Avatar>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        SKU: {product.sku}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">
                    {product.categoryId ? `Category ${product.categoryId}` : "Uncategorized"}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{product.stock} units</div>
                </TableCell>
                <TableCell>
                  {getStockStatusBadge(product)}
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-500">
                    Min: {product.minStockLevel} units
                  </div>
                </TableCell>
                <TableCell>
                  <Button 
                    variant="link" 
                    className="text-primary hover:text-primary-dark"
                    onClick={() => handleReorder(product.id)}
                    disabled={reorderingProduct === product.id}
                  >
                    {reorderingProduct === product.id ? "Processing..." : "Reorder"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
