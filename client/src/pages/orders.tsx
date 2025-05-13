import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCartIcon, ClipboardCheck, ClipboardX } from "lucide-react";
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Helmet } from "react-helmet";

export default function Orders() {
  return (
    <>
      <Helmet>
        <title>Orders | InvenTrack</title>
        <meta name="description" content="Manage purchase orders and track incoming inventory" />
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Orders</h2>
        <Button>
          <ShoppingCartIcon className="h-4 w-4 mr-1" />
          Create Order
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Pending Orders</p>
              <p className="text-2xl font-semibold">12</p>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <ShoppingCartIcon className="h-5 w-5 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Received Orders</p>
              <p className="text-2xl font-semibold">84</p>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <ClipboardCheck className="h-5 w-5 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="flex items-center justify-between p-4">
            <div>
              <p className="text-sm text-gray-500">Cancelled Orders</p>
              <p className="text-2xl font-semibold">7</p>
            </div>
            <div className="bg-red-100 p-2 rounded-full">
              <ClipboardX className="h-5 w-5 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-medium">Recent Orders</h3>
          <Button variant="link" className="text-sm">View All</Button>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">ORD-2023-8754</TableCell>
                <TableCell>TechSource Inc.</TableCell>
                <TableCell>Today at 10:32 AM</TableCell>
                <TableCell>
                  <Badge variant="secondary">Pending</Badge>
                </TableCell>
                <TableCell>5 items</TableCell>
                <TableCell>$1,245.00</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ORD-2023-8753</TableCell>
                <TableCell>GlobalGadgets</TableCell>
                <TableCell>Yesterday at 2:15 PM</TableCell>
                <TableCell>
                  <Badge variant="default" className="bg-green-500">Received</Badge>
                </TableCell>
                <TableCell>3 items</TableCell>
                <TableCell>$780.50</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">ORD-2023-8752</TableCell>
                <TableCell>TechSource Inc.</TableCell>
                <TableCell>Aug 22, 2023</TableCell>
                <TableCell>
                  <Badge variant="destructive">Cancelled</Badge>
                </TableCell>
                <TableCell>2 items</TableCell>
                <TableCell>$349.99</TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    </>
  );
}
