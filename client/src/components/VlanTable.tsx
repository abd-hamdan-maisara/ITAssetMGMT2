import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Vlan } from "@shared/schema";
import { Edit, Trash2 } from "lucide-react";

interface VlanTableProps {
  vlans: Vlan[];
  isLoading: boolean;
  searchTerm: string;
}

export function VlanTable({ vlans, isLoading, searchTerm }: VlanTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-8 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
        <div className="h-12 bg-muted animate-pulse rounded w-full" />
      </div>
    );
  }

  if (vlans.length === 0) {
    return (
      <div className="text-center p-8 border border-border rounded-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 mx-auto text-muted-foreground mb-4"
        >
          <line x1="4" y1="21" x2="4" y2="14" />
          <line x1="4" y1="10" x2="4" y2="3" />
          <line x1="12" y1="21" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12" y2="3" />
          <line x1="20" y1="21" x2="20" y2="16" />
          <line x1="20" y1="12" x2="20" y2="3" />
          <line x1="1" y1="14" x2="7" y2="14" />
          <line x1="9" y1="8" x2="15" y2="8" />
          <line x1="17" y1="16" x2="23" y2="16" />
        </svg>
        <h3 className="text-lg font-medium mb-2">
          {searchTerm ? "No matching VLANs found" : "No VLANs found"}
        </h3>
        <p className="text-muted-foreground mb-4">
          {searchTerm 
            ? "Try adjusting your search term." 
            : "Start by adding VLANs to your network."}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>VLAN ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Subnet</TableHead>
            <TableHead>Assigned Devices</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {vlans.map((vlan) => (
            <TableRow key={vlan.id}>
              <TableCell className="font-medium">
                <div className="px-2 py-1 rounded-full bg-primary/10 text-primary inline-block text-xs font-medium">
                  {vlan.vlanId}
                </div>
              </TableCell>
              <TableCell>{vlan.name}</TableCell>
              <TableCell className="font-mono">{vlan.subnet}</TableCell>
              <TableCell>{vlan.assignedDevices || "—"}</TableCell>
              <TableCell className="max-w-xs truncate">{vlan.description || "—"}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
