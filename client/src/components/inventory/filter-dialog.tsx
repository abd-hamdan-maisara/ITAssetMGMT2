import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import { useState } from "react";

interface FilterDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FilterDialog({ open, onOpenChange }: FilterDialogProps) {
  const [filterOptions, setFilterOptions] = useState({
    categories: [] as number[],
    priceMin: "",
    priceMax: "",
    stockStatus: {
      inStock: false,
      lowStock: false,
      outOfStock: false
    },
    sortBy: "newest"
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const handleCategoryChange = (categoryId: number, checked: boolean) => {
    setFilterOptions(prev => {
      const updatedCategories = checked
        ? [...prev.categories, categoryId]
        : prev.categories.filter(id => id !== categoryId);
      
      return {
        ...prev,
        categories: updatedCategories
      };
    });
  };

  const handleStockStatusChange = (status: keyof typeof filterOptions.stockStatus, checked: boolean) => {
    setFilterOptions(prev => ({
      ...prev,
      stockStatus: {
        ...prev.stockStatus,
        [status]: checked
      }
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSortChange = (value: string) => {
    setFilterOptions(prev => ({
      ...prev,
      sortBy: value
    }));
  };

  const handleApplyFilters = () => {
    // Apply filters
    onOpenChange(false);
  };

  const handleResetFilters = () => {
    setFilterOptions({
      categories: [],
      priceMin: "",
      priceMax: "",
      stockStatus: {
        inStock: false,
        lowStock: false,
        outOfStock: false
      },
      sortBy: "newest"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle id="filter-modal-title">Filter Products</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="block text-sm font-medium">Categories</Label>
            <div className="mt-2 space-y-2">
              {categories.map((category) => (
                <div key={category.id} className="flex items-center">
                  <Checkbox 
                    id={`cat-${category.id}`} 
                    checked={filterOptions.categories.includes(category.id)}
                    onCheckedChange={(checked) => 
                      handleCategoryChange(category.id, checked === true)
                    }
                  />
                  <Label 
                    htmlFor={`cat-${category.id}`} 
                    className="ml-2 text-sm text-gray-700"
                  >
                    {category.name}
                  </Label>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium">Price Range</Label>
            <div className="grid grid-cols-2 gap-4 mt-2">
              <div>
                <Label htmlFor="priceMin" className="block text-xs text-gray-500">Min ($)</Label>
                <Input 
                  type="number" 
                  id="priceMin" 
                  name="priceMin"
                  min="0"
                  value={filterOptions.priceMin}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="priceMax" className="block text-xs text-gray-500">Max ($)</Label>
                <Input 
                  type="number" 
                  id="priceMax" 
                  name="priceMax"
                  min="0"
                  value={filterOptions.priceMax}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium">Stock Status</Label>
            <div className="mt-2 space-y-2">
              <div className="flex items-center">
                <Checkbox 
                  id="stock-in" 
                  checked={filterOptions.stockStatus.inStock}
                  onCheckedChange={(checked) => 
                    handleStockStatusChange("inStock", checked === true)
                  }
                />
                <Label htmlFor="stock-in" className="ml-2 text-sm text-gray-700">In Stock</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stock-low" 
                  checked={filterOptions.stockStatus.lowStock}
                  onCheckedChange={(checked) => 
                    handleStockStatusChange("lowStock", checked === true)
                  }
                />
                <Label htmlFor="stock-low" className="ml-2 text-sm text-gray-700">Low Stock</Label>
              </div>
              <div className="flex items-center">
                <Checkbox 
                  id="stock-out" 
                  checked={filterOptions.stockStatus.outOfStock}
                  onCheckedChange={(checked) => 
                    handleStockStatusChange("outOfStock", checked === true)
                  }
                />
                <Label htmlFor="stock-out" className="ml-2 text-sm text-gray-700">Out of Stock</Label>
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium">Sort By</Label>
            <Select
              value={filterOptions.sortBy}
              onValueChange={handleSortChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sorting method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name-asc">Name: A to Z</SelectItem>
                <SelectItem value="name-desc">Name: Z to A</SelectItem>
                <SelectItem value="stock-low">Stock: Low to High</SelectItem>
                <SelectItem value="stock-high">Stock: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter className="sm:flex sm:flex-row-reverse">
          <Button 
            type="button" 
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
          <Button 
            type="button" 
            variant="outline"
            onClick={handleResetFilters}
            className="mt-3 sm:mt-0 sm:ml-3"
          >
            Reset
          </Button>
          <Button 
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="mt-3 sm:mt-0"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
