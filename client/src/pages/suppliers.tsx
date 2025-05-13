import { useState } from "react";
import { Helmet } from "react-helmet";
import { useInventory } from "@/hooks/use-inventory";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mail, Phone, MapPin, Edit, Trash } from "lucide-react";
import { InsertSupplier } from "@shared/schema";

export default function Suppliers() {
  const { useSuppliers, useAddSupplier } = useInventory();
  const { data: suppliers = [], isLoading } = useSuppliers();
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState<InsertSupplier>({
    name: "",
    contactName: "",
    email: "",
    phone: "",
    address: ""
  });

  const addSupplierMutation = useAddSupplier();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplierMutation.mutate(formData, {
      onSuccess: () => {
        setShowAddDialog(false);
        resetForm();
      }
    });
  };

  const resetForm = () => {
    setFormData({
      name: "",
      contactName: "",
      email: "",
      phone: "",
      address: ""
    });
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (supplier.contactName && supplier.contactName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (supplier.email && supplier.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="bg-white p-4 rounded-lg shadow-lg flex items-center space-x-3">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading suppliers...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Suppliers | InvenTrack</title>
        <meta name="description" content="Manage supplier information and contact details" />
      </Helmet>
      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-semibold">Suppliers</h2>
        <div className="mt-3 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search suppliers..." 
              className="w-full sm:w-64 pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search suppliers"
            />
            <svg 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
              />
            </svg>
          </div>
          <Button 
            onClick={() => setShowAddDialog(true)}
            className="flex items-center"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Supplier
          </Button>
        </div>
      </div>
      
      {filteredSuppliers.length === 0 ? (
        <Card className="bg-white">
          <CardContent className="p-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Truck className="h-6 w-6 text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm 
                ? "No suppliers match your search criteria." 
                : "Add suppliers to manage your inventory sources."
              }
            </p>
            <Button onClick={() => setShowAddDialog(true)}>Add Supplier</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSuppliers.map((supplier) => (
            <Card key={supplier.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="font-semibold text-lg">{supplier.name}</h3>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="icon" aria-label="Edit supplier">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" aria-label="Delete supplier">
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {supplier.contactName && (
                  <p className="text-sm text-gray-500 mt-1">Contact: {supplier.contactName}</p>
                )}
                
                <div className="mt-4 space-y-2">
                  {supplier.email && (
                    <div className="flex items-center text-sm">
                      <Mail className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`mailto:${supplier.email}`} className="text-primary hover:underline">
                        {supplier.email}
                      </a>
                    </div>
                  )}
                  
                  {supplier.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      <a href={`tel:${supplier.phone}`} className="hover:underline">
                        {supplier.phone}
                      </a>
                    </div>
                  )}
                  
                  {supplier.address && (
                    <div className="flex items-start text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400 mt-0.5" />
                      <span>{supplier.address}</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Active Orders: 0</span>
                    <Button variant="outline" size="sm">View Orders</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
      
      {/* Add Supplier Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Supplier</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Supplier Name*</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name} 
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="contactName">Contact Person</Label>
                <Input 
                  id="contactName" 
                  name="contactName"
                  value={formData.contactName} 
                  onChange={handleChange}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email"
                    value={formData.email} 
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    name="phone"
                    value={formData.phone} 
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea 
                  id="address" 
                  name="address"
                  value={formData.address} 
                  onChange={handleChange}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={addSupplierMutation.isPending}
              >
                {addSupplierMutation.isPending ? "Adding..." : "Add Supplier"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
