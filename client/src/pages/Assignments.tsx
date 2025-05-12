import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Search, 
  Filter, 
  Download,
  Plus,
  UserPlus,
  ArrowLeft,
  ArrowRight,
  Calendar,
  CalendarX,
  AlertCircle
} from 'lucide-react';
import { Assignment, Hardware, NetworkDevice, GeneralInventoryItem } from '@shared/schema';
import { AddAssignmentModal } from '@/components/modals/AddAssignmentModal';
import { format, formatDistanceToNow, isAfter } from 'date-fns';

export default function AssignmentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const { data: assignments, isLoading: isLoadingAssignments } = useQuery<Assignment[]>({
    queryKey: ['/api/assignments'],
  });

  const { data: hardware } = useQuery<Hardware[]>({
    queryKey: ['/api/hardware'],
  });

  const { data: networkDevices } = useQuery<NetworkDevice[]>({
    queryKey: ['/api/network-devices'],
  });

  const { data: generalInventory } = useQuery<GeneralInventoryItem[]>({
    queryKey: ['/api/general-inventory'],
  });

  const getItemName = (assignment: Assignment): string => {
    if (assignment.hardwareId && hardware) {
      const item = hardware.find(h => h.id === assignment.hardwareId);
      return item ? item.name : `Hardware #${assignment.hardwareId}`;
    } else if (assignment.networkDeviceId && networkDevices) {
      const item = networkDevices.find(n => n.id === assignment.networkDeviceId);
      return item ? item.name : `Network Device #${assignment.networkDeviceId}`;
    } else if (assignment.generalInventoryId && generalInventory) {
      const item = generalInventory.find(g => g.id === assignment.generalInventoryId);
      return item ? item.name : `Inventory Item #${assignment.generalInventoryId}`;
    }
    return 'Unknown Item';
  };

  const getItemType = (assignment: Assignment): string => {
    if (assignment.hardwareId) {
      return 'Hardware';
    } else if (assignment.networkDeviceId) {
      return 'Network Device';
    } else if (assignment.generalInventoryId) {
      return 'General Inventory';
    }
    return 'Unknown';
  };

  const filteredAssignments = assignments?.filter(assignment => {
    const itemName = getItemName(assignment);
    const matchesSearch = 
      itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (assignment.department && assignment.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || assignment.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Group assignments by status for statistics
  const activeAssignments = assignments?.filter(a => a.status === 'active')?.length || 0;
  const pendingAssignments = assignments?.filter(a => a.status === 'pending')?.length || 0;
  const returnedAssignments = assignments?.filter(a => a.status === 'returned')?.length || 0;
  const overdueAssignments = assignments?.filter(a => 
    a.status === 'active' && 
    a.returnDate && 
    isAfter(new Date(), new Date(a.returnDate))
  )?.length || 0;

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { color: string, label: string }> = {
      active: { color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400", label: "Active" },
      pending: { color: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400", label: "Pending" },
      returned: { color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400", label: "Returned" }
    };
    
    const statusInfo = statusMap[status] || { color: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400", label: status };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold">Hardware Assignments</h1>
          <p className="text-muted-foreground">Track and manage hardware assignments to users</p>
        </div>
        <Button onClick={() => setAddModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Assignment
        </Button>
      </div>

      {/* Assignment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Active Assignments</p>
                <h3 className="text-2xl font-bold text-primary">{activeAssignments}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <UserPlus className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ 
                    width: assignments?.length ? `${Math.round((activeAssignments / assignments.length) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {assignments?.length ? `${Math.round((activeAssignments / assignments.length) * 100)}%` : '0%'} of total
                </span>
                <span className="text-xs text-muted-foreground">
                  {activeAssignments}/{assignments?.length || 0} items
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Pending Returns</p>
                <h3 className="text-2xl font-bold text-amber-500">{pendingAssignments}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-amber-500 h-2.5 rounded-full" 
                  style={{ 
                    width: activeAssignments ? `${Math.round((pendingAssignments / activeAssignments) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {activeAssignments ? `${Math.round((pendingAssignments / activeAssignments) * 100)}%` : '0%'} of active
                </span>
                <span className="text-xs text-muted-foreground">
                  {pendingAssignments}/{activeAssignments} items
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Overdue Returns</p>
                <h3 className="text-2xl font-bold text-destructive">{overdueAssignments}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
                <CalendarX className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-destructive h-2.5 rounded-full" 
                  style={{ 
                    width: activeAssignments ? `${Math.round((overdueAssignments / activeAssignments) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {activeAssignments ? `${Math.round((overdueAssignments / activeAssignments) * 100)}%` : '0%'} of active
                </span>
                <span className="text-xs text-muted-foreground">
                  {overdueAssignments}/{activeAssignments} items
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex justify-between">
              <div>
                <p className="text-muted-foreground text-sm">Returned Items</p>
                <h3 className="text-2xl font-bold text-blue-500">{returnedAssignments}</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ArrowLeft className="h-6 w-6" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full bg-muted rounded-full h-2.5">
                <div 
                  className="bg-blue-500 h-2.5 rounded-full" 
                  style={{ 
                    width: assignments?.length ? `${Math.round((returnedAssignments / assignments.length) * 100)}%` : '0%' 
                  }}
                ></div>
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {assignments?.length ? `${Math.round((returnedAssignments / assignments.length) * 100)}%` : '0%'} of total
                </span>
                <span className="text-xs text-muted-foreground">
                  {returnedAssignments}/{assignments?.length || 0} items
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-card rounded-lg shadow border border-border p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by item name, assigned to, or department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-4">
            <Select 
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
            
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Assignments Table */}
      <Card className="overflow-hidden">
        <div className="border-b border-border p-4 flex justify-between">
          <h3 className="font-semibold">Current Assignments</h3>
        </div>
        
        {isLoadingAssignments ? (
          <div className="p-4 space-y-3">
            <div className="h-8 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
            <div className="h-12 bg-muted animate-pulse rounded w-full" />
          </div>
        ) : filteredAssignments && filteredAssignments.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Item</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned To</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assigned Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Return Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredAssignments.map((assignment) => {
                  const isOverdue = assignment.returnDate && 
                    assignment.status === 'active' && 
                    isAfter(new Date(), new Date(assignment.returnDate));
                    
                  return (
                    <tr key={assignment.id} className="hover:bg-muted/50 transition">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <div className="font-medium">{getItemName(assignment)}</div>
                            <div className="text-sm text-muted-foreground">{getItemType(assignment)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{assignment.assignedTo}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.department || '—'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.assignmentDate && format(new Date(assignment.assignmentDate), 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {assignment.returnDate ? (
                          <div className={isOverdue ? 'text-destructive' : ''}>
                            {format(new Date(assignment.returnDate), 'MMM d, yyyy')}
                            {isOverdue && (
                              <div className="text-xs font-medium text-destructive">
                                Overdue
                              </div>
                            )}
                          </div>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(assignment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <Button variant="ghost" size="sm">
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Return
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center p-8">
            <UserPlus className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Assignments Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? "No assignments match your current filters." 
                : "Start by creating assignments for your hardware."}
            </p>
            {(searchTerm || statusFilter !== 'all') && (
              <Button className="mt-2" onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}>
                Clear Filters
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {filteredAssignments && filteredAssignments.length > 0 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button variant="outline" size="sm">Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">{filteredAssignments.length}</span> of <span className="font-medium">{filteredAssignments.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button variant="outline" size="icon" className="rounded-l-md">
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="bg-primary-50 border-primary">
                    1
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-r-md">
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Modals */}
      <AddAssignmentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
      />
    </div>
  );
}
