
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import RoleCard from "@/components/RoleCard";
import PermissionGroup from "@/components/PermissionGroup";
import UserRoleTable from "@/components/UserRoleTable";
import CreateRoleDialog from "@/components/CreateRoleDialog";
import { Role, mockRoles, mockUsers, permissionCategories, mockPermissions } from "@/models/role";

const RoleManagement = () => {
  const [roles, setRoles] = useState(mockRoles);
  const [users, setUsers] = useState(mockUsers);
  const [selectedRoleId, setSelectedRoleId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const selectedRole = selectedRoleId ? roles.find(role => role.id === selectedRoleId) : null;

  const handleTogglePermission = (roleId: string, permissionId: string, enabled: boolean) => {
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
    
    toast.success(`Permission ${enabled ? 'granted' : 'revoked'}`, {
      description: `Permission has been ${enabled ? 'granted' : 'revoked'} for ${roles.find(r => r.id === roleId)?.name}`,
    });
  };

  const handleCreateRole = (newRole: Omit<Role, 'id'>) => {
    const roleId = `r${roles.length + 1}`;
    setRoles([...roles, { ...newRole, id: roleId }]);
    
    toast.success("Role created", {
      description: `New role '${newRole.name}' has been created successfully`,
    });
  };

  const handleDeleteRole = (roleId: string) => {
    // Check if any users have this role
    const hasUsers = users.some(user => user.roleId === roleId);
    
    if (hasUsers) {
      toast.error("Cannot delete role", {
        description: "There are users assigned to this role. Reassign them first.",
      });
      return;
    }
    
    setRoles(roles.filter(role => role.id !== roleId));
    if (selectedRoleId === roleId) {
      setSelectedRoleId(null);
      setIsEditing(false);
    }
    
    toast.success("Role deleted", {
      description: "The role has been deleted successfully",
    });
  };

  const handleChangeUserRole = (userId: string, roleId: string) => {
    setUsers(users.map(user => user.id === userId ? { ...user, roleId } : user));
    
    toast.success("Role assigned", {
      description: `User has been assigned to ${roles.find(r => r.id === roleId)?.name} role`,
    });
  };

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
                <Button onClick={() => setIsEditing(false)}>
                  Done
                </Button>
              ) : (
                <Button variant="outline" onClick={() => {
                  setSelectedRoleId(null);
                }}>
                  Back to Roles
                </Button>
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
              
              <CreateRoleDialog onCreateRole={handleCreateRole} />
            </TabsContent>
            
            <TabsContent value="users">
              <UserRoleTable 
                users={users} 
                roles={roles} 
                onRoleChange={handleChangeUserRole} 
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
