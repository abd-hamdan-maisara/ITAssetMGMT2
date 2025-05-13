import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProductCard } from "./product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Plus } from "lucide-react";
import { Product } from "@shared/schema";
import { AddProductDialog } from "./add-product-dialog";
import { FilterDialog } from "./filter-dialog";

export function ProductList() {
  const [search, setSearch] = useState("");
  const [showAddProductDialog, setShowAddProductDialog] = useState(false);
  const [showFilterDialog, setShowFilterDialog] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;

  // Fetch products
  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  // Filter products based on search
  const filteredProducts = products.filter((product) => 
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.sku.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  // Page change handler
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold">Products</h2>
        <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search products..." 
              className="w-full sm:w-64 pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search products"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          </div>
          <Button 
            variant="outline" 
            onClick={() => setShowFilterDialog(true)}
            className="flex items-center"
          >
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </Button>
          <Button 
            onClick={() => setShowAddProductDialog(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Product
          </Button>
        </div>
      </div>
      
      {/* Products Grid */}
      {paginatedProducts.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
          <Button onClick={() => setShowAddProductDialog(true)}>Add Product</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {paginatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
      
      {/* Pagination */}
      {filteredProducts.length > productsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * productsPerPage + 1}-{Math.min(currentPage * productsPerPage, filteredProducts.length)} of {filteredProducts.length} products
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-2"
            >
              Previous
            </Button>
            
            {[...Array(Math.min(totalPages, 5))].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className="px-3 py-2"
                >
                  {pageNum}
                </Button>
              );
            })}
            
            {totalPages > 5 && (
              <>
                {currentPage > 4 && (
                  <span className="px-3 py-2 text-gray-500">...</span>
                )}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <span className="px-3 py-2 text-gray-500">...</span>
                )}
                {currentPage < totalPages - 2 && (
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(totalPages)}
                    className="px-3 py-2"
                  >
                    {totalPages}
                  </Button>
                )}
              </>
            )}
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-3 py-2"
            >
              Next
            </Button>
          </div>
        </div>
      )}
      
      {/* Add Product Dialog */}
      <AddProductDialog 
        open={showAddProductDialog} 
        onOpenChange={setShowAddProductDialog} 
      />
      
      {/* Filter Dialog */}
      <FilterDialog 
        open={showFilterDialog} 
        onOpenChange={setShowFilterDialog} 
      />
    </div>
  );
}
