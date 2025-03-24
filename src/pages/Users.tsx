
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import UserRoleTable from '@/components/UserRoleTable';
import { User, Role } from '@/models/role';

// Sample data for demonstration
const sampleUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', roleId: '1' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', roleId: '2' },
  { id: '3', name: 'Michael Johnson', email: 'michael@example.com', roleId: '3' },
];

const sampleRoles: Role[] = [
  { id: '1', name: 'Admin', description: 'Full access to all features', permissions: [] },
  { id: '2', name: 'Manager', description: 'Access to most features', permissions: [] },
  { id: '3', name: 'Cashier', description: 'Limited access to sales features', permissions: [] },
];

const Users: React.FC = () => {
  const handleRoleChange = (userId: string, roleId: string) => {
    console.log(`Changed role for user ${userId} to role ${roleId}`);
    // In a real application, you would update the user's role in the database
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Management</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage user roles and permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <UserRoleTable 
            users={sampleUsers} 
            roles={sampleRoles} 
            onRoleChange={handleRoleChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
