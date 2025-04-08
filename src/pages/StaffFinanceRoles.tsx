
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import RoleCard from "@/components/RoleCard";
import { Role } from "@/models/role";
import { getAllRoles } from '@/services/roleService';
import { StaffFinancePermission } from '@/models/interfaces/permissionInterfaces';
import { useAuth } from "@/providers/AuthProvider";
import { adaptRoles } from '@/utils/roleAdapter';

const StaffFinanceRoles: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeRoleId, setActiveRoleId] = useState<string | null>(null);
  const { hasPermission } = useAuth();
  
  useEffect(() => {
    const fetchRoles = async () => {
      setLoading(true);
      try {
        const rolesData = await getAllRoles();
        // Need to adapt the roles from type/auth.Role to models/role.Role
        const adaptedRolesData = adaptRoles(rolesData);
        setRoles(adaptedRolesData);
        if (adaptedRolesData.length > 0) {
          setActiveRoleId(adaptedRolesData[0].id);
        }
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast.error('Failed to load role information');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoles();
  }, []);

  const handleViewRole = (roleId: string) => {
    setActiveRoleId(roleId);
  };

  const handleEditRole = (roleId: string) => {
    // Redirect to role management page for editing
    window.location.href = `/role-management?role=${roleId}`;
  };

  const handleDeleteRole = (roleId: string) => {
    // For now, just show a toast - actual deletion would require confirmation
    toast.info('Role deletion requires confirmation in Role Management');
  };

  // Filter roles that have staff finance permissions
  const staffRoles = roles.filter(role => 
    role.permissions.some(p => 
      p.name.includes('payroll') || 
      p.name.includes('expense') || 
      p.name.includes('finance') || 
      p.name.includes('staff')
    )
  );
  
  // No need to adapt staffRoles again as they're already adapted
  const canManageRoles = hasPermission('manage_roles');

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link to="/staff-finance">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Staff Finance Roles</h1>
        </div>
        
        {canManageRoles && (
          <Button variant="default" asChild>
            <Link to="/role-management">
              Manage All Roles
            </Link>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Finance Roles</CardTitle>
          <CardDescription>
            These roles define what finance-related actions users can perform in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="roles">
            <TabsList>
              <TabsTrigger value="roles">Role Cards</TabsTrigger>
              <TabsTrigger value="permissions">Permission Matrix</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles" className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {staffRoles.length > 0 ? (
                  staffRoles.map(role => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onView={handleViewRole}
                      onEdit={canManageRoles ? handleEditRole : handleDeleteRole}
                      onDelete={canManageRoles ? handleDeleteRole : () => {}}
                      active={role.id === activeRoleId}
                    />
                  ))
                ) : (
                  <p className="col-span-full text-center p-6 text-muted-foreground">
                    No finance roles found. Finance roles can be created in Role Management.
                  </p>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="permissions" className="pt-6">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-2 border-b">Permission</th>
                      {staffRoles.map(role => (
                        <th key={role.id} className="text-center p-2 border-b">{role.name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {['View Payroll', 'Process Payroll', 'View Expenses', 'Approve Expenses', 'Manage Benefits'].map((permission, idx) => (
                      <tr key={idx} className="hover:bg-muted/50">
                        <td className="p-2 border-b">{permission}</td>
                        {staffRoles.map(role => {
                          const permName = permission.toLowerCase().replace(/\s/g, '_');
                          const hasPermission = role.permissions.some(
                            p => p.name === `can_${permName}` && p.enabled
                          );
                          
                          return (
                            <td key={role.id} className="text-center p-2 border-b">
                              {hasPermission ? (
                                <span className="inline-block w-6 h-6 bg-green-100 text-green-800 rounded-full flex items-center justify-center">
                                  ✓
                                </span>
                              ) : (
                                <span className="inline-block w-6 h-6 bg-red-100 text-red-800 rounded-full flex items-center justify-center">
                                  ✕
                                </span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StaffFinanceRoles;
