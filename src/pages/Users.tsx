import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Spinner } from '@/components/ui/spinner';
import { Plus, Search, Trash, Edit, Eye, MoreHorizontal, UserPlus, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { User, UserStatus, Role } from '@/types/auth';
import { getAllUsers, updateUser, deleteUser } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';
import { UserFormDialog } from '@/components/users/UserFormDialog';
import { UserViewDialog } from '@/components/users/UserViewDialog';
import { UserDeleteDialog } from '@/components/users/UserDeleteDialog';
import { UserRoleDialog } from '@/components/users/UserRoleDialog';
import { formatDate } from '@/utils/formatters';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/lib/supabase';
import { useNavigate } from 'react-router-dom';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<UserStatus | 'all'>('all');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRoleDialog, setShowRoleDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loadingRoles, setLoadingRoles] = useState(false);
  
  const { user: currentUser, hasPermission } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const usersData = await getAllUsers();
        setUsers(usersData as any);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast.error('Failed to load users');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  useEffect(() => {
    const fetchRoles = async () => {
      setLoadingRoles(true);
      try {
        const { data, error } = await supabase
          .from('roles')
          .select('*')
          .order('name');
        
        if (error) throw error;
        
        setRoles(data || []);
      } catch (error) {
        console.error('Error fetching roles:', error);
      } finally {
        setLoadingRoles(false);
      }
    };
    
    fetchRoles();
  }, []);
  
  useEffect(() => {
    let filtered = [...users];
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.fullName && user.fullName.toLowerCase().includes(term)) ||
        (user.email && user.email.toLowerCase().includes(term))
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, statusFilter]);
  
  const handleAddUser = async (userData: Partial<User>) => {
    try {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email || '',
        fullName: userData.fullName || '',
        status: userData.status || 'pending',
        role: userData.role || 'cashier',
        createdAt: new Date().toISOString(),
        isGlobalAdmin: false
      };
      
      setUsers(prev => [...prev, newUser]);
      toast.success('User added successfully');
      return true;
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
      return false;
    }
  };
  
  const handleUpdateUser = async (id: string, userData: Partial<User>) => {
    try {
      const updatedUser = await updateUser(id, userData);
      
      if (!updatedUser) {
        throw new Error('Failed to update user');
      }
      
      setUsers(prev => prev.map(user => user.id === id ? { ...user, ...userData } : user));
      toast.success('User updated successfully');
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
      return false;
    }
  };
  
  const handleDeleteUser = async (id: string) => {
    try {
      const success = await deleteUser(id);
      
      if (!success) {
        throw new Error('Failed to delete user');
      }
      
      setUsers(prev => prev.filter(user => user.id !== id));
      toast.success('User deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
      return false;
    }
  };
  
  const updateUserRole = async (userId: string, selectedRoleId: string) => {
    try {
      await updateUser(userId, { 
        role: selectedRoleId as any
      });
      
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, role: selectedRoleId as any } : user
        )
      );
      
      toast.success('User role updated successfully');
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('Failed to update user role');
    }
  };
  
  const updateUserStatus = async (userId: string, status: UserStatus) => {
    try {
      const result = await updateUser(userId, { status });
      
      if (result) {
        setUsers(prev => prev.map(user => 
          user.id === userId ? { ...user, status } : user
        ));
        toast.success(`User status updated to ${status}`);
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('An error occurred while updating user status');
    }
  };
  
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setShowViewDialog(true);
  };
  
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditDialog(true);
  };
  
  const handleDeleteConfirm = (user: User) => {
    setSelectedUser(user);
    setShowDeleteDialog(true);
  };
  
  const handleRoleChange = (user: User) => {
    setSelectedUser(user);
    setShowRoleDialog(true);
  };
  
  const handleInviteUser = () => {
    navigate('/invite');
  };
  
  const canManageUsers = hasPermission('manage_users');
  
  const renderStatusBadge = (status: UserStatus) => {
    const statusConfig: Record<UserStatus, { label: string, variant: 'default' | 'outline' | 'secondary' | 'destructive' | 'success' }> = {
      active: { label: 'Active', variant: 'success' },
      pending: { label: 'Pending', variant: 'secondary' },
      inactive: { label: 'Inactive', variant: 'outline' },
      denied: { label: 'Denied', variant: 'destructive' }
    };
    
    const config = statusConfig[status] || { label: status, variant: 'outline' };
    
    return (
      <Badge variant={config.variant}>{config.label}</Badge>
    );
  };
  
  const getInitials = (name: string) => {
    if (!name) return '??';
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
        
        <div className="flex gap-2">
          {canManageUsers && (
            <>
              <Button onClick={handleInviteUser} variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Invite User
              </Button>
              <Button onClick={() => setShowAddDialog(true)}>
                <UserPlus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </>
          )}
        </div>
      </div>
      
      <Tabs defaultValue="all-users">
        <TabsList>
          <TabsTrigger value="all-users">All Users</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all-users">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Users</CardTitle>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-8 w-[250px]"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as UserStatus | 'all')}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="denied">Denied</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="lg" />
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {searchTerm || statusFilter !== 'all' ? 'No users match your search criteria' : 'No users found'}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Last Login</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{getInitials(user.fullName || user.name || '')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName || user.name || 'Unnamed User'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.role || 'No role'}
                          </TableCell>
                          <TableCell>
                            {renderStatusBadge(user.status)}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                          </TableCell>
                          <TableCell>
                            {formatDate(user.createdAt)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuItem onClick={() => handleViewUser(user)}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                
                                {canManageUsers && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleEditUser(user)}>
                                      <Edit className="mr-2 h-4 w-4" />
                                      Edit User
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem onClick={() => handleRoleChange(user)}>
                                      <UserPlus className="mr-2 h-4 w-4" />
                                      Change Role
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                      onClick={() => updateUserStatus(user.id, 'active')}
                                      disabled={user.status === 'active'}
                                    >
                                      Set as Active
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuItem 
                                      onClick={() => updateUserStatus(user.id, 'inactive')}
                                      disabled={user.status === 'inactive'}
                                    >
                                      Set as Inactive
                                    </DropdownMenuItem>
                                    
                                    <DropdownMenuSeparator />
                                    
                                    <DropdownMenuItem 
                                      onClick={() => handleDeleteConfirm(user)}
                                      className="text-destructive focus:text-destructive"
                                    >
                                      <Trash className="mr-2 h-4 w-4" />
                                      Delete User
                                    </DropdownMenuItem>
                                  </>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="active">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => user.status === 'active')
                      .map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{getInitials(user.fullName || user.name || '')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName || user.name || 'Unnamed User'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            {user.role || 'No role'}
                          </TableCell>
                          <TableCell>
                            {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" onClick={() => handleViewUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {canManageUsers && (
                              <>
                                <Button variant="ghost" size="icon" onClick={() => handleEditUser(user)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDeleteConfirm(user)}>
                                  <Trash className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pending">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => user.status === 'pending')
                      .map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{user.fullName || user.name || 'Unnamed User'}</div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{formatDate(user.createdAt)}</TableCell>
                          <TableCell className="text-right">
                            {canManageUsers && (
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateUserStatus(user.id, 'active')}
                                >
                                  Approve
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => updateUserStatus(user.id, 'denied')}
                                >
                                  Deny
                                </Button>
                              </div>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inactive">
          <Card>
            <CardContent className="pt-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users
                      .filter(user => user.status === 'inactive' || user.status === 'denied')
                      .map(user => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatarUrl} />
                                <AvatarFallback>{getInitials(user.fullName || user.name || '')}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">{user.fullName || user.name || 'Unnamed User'}</div>
                                <div className="text-sm text-muted-foreground">{user.email}</div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</TableCell>
                          <TableCell className="text-right">
                            {canManageUsers && (
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => updateUserStatus(user.id, 'active')}
                              >
                                Reactivate
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {showAddDialog && (
        <UserFormDialog
          open={showAddDialog}
          onOpenChange={setShowAddDialog}
          onSubmit={handleAddUser}
          roles={roles}
        />
      )}
      
      {selectedUser && showEditDialog && (
        <UserFormDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          onSubmit={(data) => handleUpdateUser(selectedUser.id, data)}
          user={selectedUser}
          roles={roles}
        />
      )}
      
      {selectedUser && showViewDialog && (
        <UserViewDialog
          open={showViewDialog}
          onOpenChange={setShowViewDialog}
          user={selectedUser}
        />
      )}
      
      {selectedUser && showDeleteDialog && (
        <UserDeleteDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={() => handleDeleteUser(selectedUser.id)}
          user={selectedUser}
        />
      )}
      
      {selectedUser && showRoleDialog && (
        <UserRoleDialog
          open={showRoleDialog}
          onOpenChange={setShowRoleDialog}
          onSubmit={(roleId) => updateUserRole(selectedUser.id, roleId)}
          user={selectedUser}
          roles={roles}
        />
      )}
    </div>
  );
};

export default Users;
