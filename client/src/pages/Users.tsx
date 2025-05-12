import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { User } from '@shared/schema';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import {
  Search,
  UserPlus,
  Edit,
  Trash,
  Filter,
  UserCheck,
  UserX,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';

// Animation variants
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } }
};

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface AddUserFormData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  role: string;
  department: string;
}

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<AddUserFormData>({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: 'readonly',
    department: '',
  });
  const { toast } = useToast();

  const { data: users = [], isLoading } = useQuery<Omit<User, 'password'>[]>({
    queryKey: ['/api/users'],
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({ ...prev, role: value }));
  };

  const resetForm = () => {
    setFormData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      role: 'readonly',
      department: '',
    });
    setSelectedUser(null);
  };

  const handleAddUser = async () => {
    try {
      const response = await apiRequest('POST', '/api/users', formData);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create user');
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User created',
        description: `User ${formData.username} has been created successfully`,
      });
      setIsAddDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleEditUser = async () => {
    if (!selectedUser) return;

    try {
      const { username, email, fullName, role, department } = formData;
      const payload = { 
        username, 
        email, 
        fullName, 
        role, 
        department,
        ...(formData.password ? { password: formData.password } : {})
      };

      const response = await apiRequest('PUT', `/api/users/${selectedUser.id}`, payload);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user');
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User updated',
        description: `User ${formData.username} has been updated successfully`,
      });
      setIsEditDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await apiRequest('DELETE', `/api/users/${selectedUser.id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: 'User deleted',
        description: `User ${selectedUser.username} has been deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const toggleUserStatus = async (user: Omit<User, 'password'>) => {
    try {
      const response = await apiRequest('PUT', `/api/users/${user.id}`, { 
        isActive: !user.isActive 
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user status');
      }
      
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
      toast({
        title: user.isActive ? 'User deactivated' : 'User activated',
        description: `User ${user.username} has been ${user.isActive ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const openEditDialog = (user: Omit<User, 'password'>) => {
    setSelectedUser(user as User);
    setFormData({
      username: user.username,
      password: '', // Don't populate password for security
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: Omit<User, 'password'>) => {
    setSelectedUser(user as User);
    setIsDeleteDialogOpen(true);
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.department && user.department.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'manager':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'technician':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
  };

  return (
    <motion.div 
      className="space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
        <motion.div variants={item}>
          <h1 className="text-2xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their access permissions</p>
        </motion.div>
        <motion.div variants={item}>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user with appropriate role and permissions.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label htmlFor="username">Username</label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="password">Password</label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="email">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="fullName">Full Name</label>
                  <Input
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="department">Department</label>
                  <Input
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="role">Role</label>
                  <Select
                    value={formData.role}
                    onValueChange={handleRoleChange}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="technician">Technician</SelectItem>
                      <SelectItem value="readonly">Read Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddUser}>Create User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      {/* Search and Filters */}
      <motion.div 
        variants={item}
        className="bg-white dark:bg-card rounded-lg shadow border border-border p-4"
      >
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, username, or department..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div>
            <Select 
              value={roleFilter} 
              onValueChange={setRoleFilter}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="technician">Technician</SelectItem>
                <SelectItem value="readonly">Read Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </motion.div>

      {/* Users Table */}
      <motion.div variants={item}>
        <Card>
          <CardHeader>
            <CardTitle>System Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <div className="h-8 bg-muted animate-pulse rounded"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
                <div className="h-20 bg-muted animate-pulse rounded"></div>
              </div>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Username</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                          No users found. Try adjusting your search or filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      <motion.div
                        variants={container}
                        initial="hidden"
                        animate="visible"
                        className="contents"
                      >
                        {filteredUsers.map((user) => (
                          <TableRow key={user.id} as={motion.tr} variants={item}>
                            <TableCell className="font-medium">{user.fullName}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.department || "—"}</TableCell>
                            <TableCell>
                              <Badge className={getRoleBadgeColor(user.role)}>
                                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={user.isActive ? "default" : "outline"} 
                                className={user.isActive ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" : "text-red-800"}
                              >
                                {user.isActive ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              {user.lastLogin ? format(new Date(user.lastLogin), 'MMM d, yyyy') : "Never"}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-2">
                                <Button 
                                  size="icon" 
                                  variant="ghost" 
                                  onClick={() => toggleUserStatus(user)}
                                >
                                  {user.isActive ? 
                                    <UserX className="h-4 w-4 text-red-500" /> : 
                                    <UserCheck className="h-4 w-4 text-green-500" />
                                  }
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openEditDialog(user)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => openDeleteDialog(user)}
                                >
                                  <Trash className="h-4 w-4 text-red-500" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </motion.div>
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information and permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="username">Username</label>
              <Input
                id="username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="password">
                Password <span className="text-xs text-muted-foreground">(Leave blank to keep unchanged)</span>
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="email">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="fullName">Full Name</label>
              <Input
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="department">Department</label>
              <Input
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="role">Role</label>
              <Select
                value={formData.role}
                onValueChange={handleRoleChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="technician">Technician</SelectItem>
                  <SelectItem value="readonly">Read Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditUser}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="py-4">
              <p><strong>Username:</strong> {selectedUser.username}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Full Name:</strong> {selectedUser.fullName}</p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteUser}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}