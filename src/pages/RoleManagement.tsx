import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import RoleCard from "@/components/RoleCard";
import PermissionGroup from "@/components/PermissionGroup";
import UserRoleTable from "@/components/UserRoleTable";
import CreateRoleDialog from "@/components/CreateRoleDialog";
import { Role, UserPermission } from "@/types/auth";
import { getAllRoles, getAllPermissions, updateRole, deleteRole, createRole } from '@/services/roleService';
import { getAllUsers, updateUser } from '@/services/userService';
import { Alert, AlertDescription } from "@/components/ui/alert";

const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [permissionCategories, setPermissionCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const selectedRole = selectedRoleId ? roles.find(role => role.id === selectedRoleId) : null;

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const rolesData = await getAllRoles();
        setRoles(rolesData);
        
        const usersData = await getAllUsers();
        setUsers(usersData);
        
        if (rolesData.length > 0) {
          const categories = rolesData[0].permissions
            .map(p => p.category || 'Other')
            .filter((v, i, a) => a.indexOf(v) === i);
          setPermissionCategories(categories);
        } else {
          const permissions = await getAllPermissions();
          const categories = permissions
            .map(p => p.category || 'Other')
            .filter((v, i, a) => a.indexOf(v) === i);
          setPermissionCategories(categories);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load roles and permissions");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleTogglePermission = (roleId: string, permissionId: string, enabled: boolean) => {
    if (!isEditing) return;
    
    setRoles(roles.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.map(permission => {
            if (permission.id === permissionId) {
              return { ...permission, enabled };
            }
            return permission;
          }),
        };
      }
      return role;
    }));
  };

  const handleCreateRole = async (newRole: { name: string, description: string, permissions: UserPermission[] }) => {
    try {
      const permissionsForApi = newRole.permissions.map(p => ({
        id: p.id,
        enabled: p.enabled
      }));
      
      const success = await createRole(newRole.name, newRole.description, permissionsForApi);
      
      if (success) {
        const updatedRoles = await getAllRoles();
        setRoles(updatedRoles);
        
        toast.success("Role created", {
          description: `New role '${newRole.name}' has been created successfully`,
        });
      }
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error("Failed to create role");
    }
  };

  const handleSaveRoleChanges = async () => {
    if (!selectedRole) return;
    
    setIsSaving(true);
    
    try {
      const permissionsForApi = selectedRole.permissions.map(p => ({
        id: p.id,
        enabled: p.enabled
      }));
      
      const success = await updateRole(selectedRole.id, {
        permissions: permissionsForApi
      });
      
      if (success) {
        setIsEditing(false);
        toast.success("Role updated", {
          description: `Role '${selectedRole.name}' has been updated successfully`,
        });
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to save role changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    const hasUsers = users.some(user => {
      const role = roles.find(r => r.id === roleId);
      return role && user.role === role.name;
    });
    
    if (hasUsers) {
      toast.error("Cannot delete role", {
        description: "There are users assigned to this role. Reassign them first.",
      });
      return;
    }
    
    try {
      const success = await deleteRole(roleId);
      
      if (success) {
        if (selectedRoleId === roleId) {
          setSelectedRoleId(null);
          setIsEditing(false);
        }
        
        const updatedRoles = await getAllRoles();
        setRoles(updatedRoles);
      }
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error("Failed to delete role");
    }
  };

  const updateUserRole = async (userId: string, roleId: string) => {
    try {
      const result = await updateUser(userId, { 
        role: roleId as any
      });
      
      if (result) {
        toast.success('User role updated successfully');
        setUsers(prevUsers => 
          prevUsers.map(user => 
            user.id === userId ? { ...user, role: roleId as any } : user
          )
        );
      } else {
        toast.error('Failed to update user role');
      }
    } catch (error) {
      console.error('Error updating user role:', error);
      toast.error('An error occurred while updating user role');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/home">
                <ChevronLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">User Roles & Permissions</h1>
          </div>
          
          {selectedRoleId && (
            <div className="flex gap-2">
              {isEditing ? (
                <Button onClick={handleSaveRoleChanges} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={() => {
                    setIsEditing(true);
                  }}>
                    Edit Permissions
                  </Button>
                  <Button variant="outline" onClick={() => {
                    setSelectedRoleId(null);
                    setIsEditing(false);
                  }}>
                    Back to Roles
                  </Button>
                </>
              )}
            </div>
          )}
        </div>

        {!selectedRoleId ? (
          <Tabs defaultValue="roles">
            <TabsList className="mb-6">
              <TabsTrigger value="roles">Roles</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
            
            <TabsContent value="roles">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {roles.map(role => (
                  <RoleCard
                    key={role.id}
                    role={role}
                    onView={(id) => {
                      setSelectedRoleId(id);
                      setIsEditing(false);
                    }}
                    onEdit={(id) => {
                      setSelectedRoleId(id);
                      setIsEditing(true);
                    }}
                    onDelete={handleDeleteRole}
                  />
                ))}
              </div>
              
              <CreateRoleDialog 
                onCreateRole={handleCreateRole} 
                existingPermissions={roles.length > 0 ? roles[0].permissions : []}
              />
            </TabsContent>
            
            <TabsContent value="users">
              <UserRoleTable 
                users={users.map(u => ({
                  id: u.id,
                  name: u.fullName || u.email,
                  email: u.email,
                  roleId: roles.find(r => r.name === u.role)?.id || ''
                }))} 
                roles={roles} 
                onRoleChange={updateUserRole} 
              />
            </TabsContent>
          </Tabs>
        ) : (
          <div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-1">
                {selectedRole?.name} Role
              </h2>
              <p className="text-muted-foreground">
                {selectedRole?.description}
              </p>
              
              {selectedRole?.name === 'admin' && !isEditing && (
                <Alert className="mt-4">
                  <AlertDescription>
                    The Admin role has all permissions by default. Changes to specific permissions won't affect admin access.
                  </AlertDescription>
                </Alert>
              )}
            </div>

            <Accordion type="multiple" className="space-y-4">
              {permissionCategories.map(category => {
                const categoryPermissions = selectedRole?.permissions.filter(p => p.category === category) || [];
                
                return (
                  <AccordionItem key={category} value={category} className="border rounded-lg overflow-hidden">
                    <AccordionTrigger className="px-4">
                      <div className="flex items-center justify-between w-full">
                        <span>{category}</span>
                        <span className="text-sm text-muted-foreground">
                          {categoryPermissions.filter(p => p.enabled).length} of {categoryPermissions.length} enabled
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2 px-4">
                      <PermissionGroup
                        category={category}
                        permissions={categoryPermissions}
                        onTogglePermission={(permissionId, enabled) => 
                          handleTogglePermission(selectedRoleId, permissionId, enabled)
                        }
                        readOnly={!isEditing}
                      />
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleManagement;
