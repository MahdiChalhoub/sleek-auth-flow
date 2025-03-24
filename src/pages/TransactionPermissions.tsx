
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Plus, Info } from "lucide-react";
import { toast } from "sonner";
import { mockRoles } from "@/models/role";
import { mockTransactionPermissions, TransactionPermission } from "@/models/transaction";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";

const TransactionPermissions = () => {
  const [roles] = useState(mockRoles);
  const [permissions, setPermissions] = useState<TransactionPermission[]>(mockTransactionPermissions);

  const handleTogglePermission = (roleId: string, permissionKey: keyof Omit<TransactionPermission, 'roleId'>) => {
    setPermissions(permissions.map(permission => {
      if (permission.roleId === roleId) {
        return {
          ...permission,
          [permissionKey]: !permission[permissionKey]
        };
      }
      return permission;
    }));
    
    const role = roles.find(r => r.id === roleId);
    const currentPermission = permissions.find(p => p.roleId === roleId);
    
    toast.success(`Permission updated`, {
      description: `${role?.name} role ${currentPermission?.[permissionKey] ? 'can no longer' : 'can now'} ${permissionKey.replace('can', '').toLowerCase()} transactions`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/home">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Transaction Permissions</h1>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Transaction Lifecycle Permissions</CardTitle>
            <CardDescription>
              Manage which roles can perform different actions in the transaction lifecycle
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="mb-6">
                <TabsTrigger value="table">Table View</TabsTrigger>
                <TabsTrigger value="lifecycle">Lifecycle View</TabsTrigger>
              </TabsList>
              
              <TabsContent value="table">
                <div className="rounded-md border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Role</TableHead>
                        <TableHead>Create</TableHead>
                        <TableHead>Edit</TableHead>
                        <TableHead>Lock</TableHead>
                        <TableHead>Unlock</TableHead>
                        <TableHead>Verify</TableHead>
                        <TableHead>Delete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {permissions.map((permission) => {
                        const role = roles.find(r => r.id === permission.roleId);
                        if (!role) return null;
                        
                        return (
                          <TableRow key={permission.roleId}>
                            <TableCell className="font-medium">{role.name}</TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canCreate}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canCreate')}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canEdit}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canEdit')}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canLock}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canLock')}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canUnlock}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canUnlock')}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canVerify}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canVerify')}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Switch
                                  checked={permission.canDelete}
                                  onCheckedChange={() => handleTogglePermission(permission.roleId, 'canDelete')}
                                />
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              <TabsContent value="lifecycle">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <LifecycleCard
                      title="Create"
                      description="Create new transactions"
                      colorClass="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800"
                      roles={roles}
                      permissions={permissions}
                      permissionKey="canCreate"
                      onToggle={handleTogglePermission}
                    />
                    
                    <LifecycleCard
                      title="Edit"
                      description="Edit open transactions"
                      colorClass="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800"
                      roles={roles}
                      permissions={permissions}
                      permissionKey="canEdit"
                      onToggle={handleTogglePermission}
                    />
                    
                    <LifecycleCard
                      title="Lock/Unlock"
                      description="Lock & unlock transactions"
                      colorClass="bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
                      roles={roles}
                      permissions={permissions}
                      permissionKey="canLock"
                      secondaryKey="canUnlock"
                      onToggle={handleTogglePermission}
                    />
                    
                    <LifecycleCard
                      title="Verify"
                      description="Mark transactions as verified"
                      colorClass="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                      roles={roles}
                      permissions={permissions}
                      permissionKey="canVerify"
                      onToggle={handleTogglePermission}
                    />
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="text-lg font-medium mb-4">Danger Zone</h3>
                    <LifecycleCard
                      title="Delete"
                      description="Permanently delete transactions"
                      colorClass="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                      roles={roles}
                      permissions={permissions}
                      permissionKey="canDelete"
                      onToggle={handleTogglePermission}
                      danger
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

interface LifecycleCardProps {
  title: string;
  description: string;
  colorClass: string;
  roles: any[];
  permissions: TransactionPermission[];
  permissionKey: keyof Omit<TransactionPermission, 'roleId'>;
  secondaryKey?: keyof Omit<TransactionPermission, 'roleId'>;
  onToggle: (roleId: string, key: keyof Omit<TransactionPermission, 'roleId'>) => void;
  danger?: boolean;
}

const LifecycleCard = ({
  title,
  description,
  colorClass,
  roles,
  permissions,
  permissionKey,
  secondaryKey,
  onToggle,
  danger = false
}: LifecycleCardProps) => {
  return (
    <Card className={`${colorClass} border`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          {title}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Info className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>{description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {roles.map(role => {
            const permission = permissions.find(p => p.roleId === role.id);
            if (!permission) return null;
            
            return (
              <div key={role.id} className="flex items-center justify-between">
                <span className="text-sm font-medium">{role.name}</span>
                <div className="space-x-2">
                  <Switch
                    checked={permission[permissionKey]}
                    onCheckedChange={() => onToggle(role.id, permissionKey)}
                    className={danger ? "data-[state=checked]:bg-destructive" : ""}
                  />
                  {secondaryKey && (
                    <Switch
                      checked={permission[secondaryKey]}
                      onCheckedChange={() => onToggle(role.id, secondaryKey)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionPermissions;
