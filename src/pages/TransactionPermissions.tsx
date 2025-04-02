
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Save, Settings, ShieldAlert } from 'lucide-react';
import { TransactionPermission } from '@/types/transaction';
import { mockRoles } from '@/models/role';
import { toast } from 'sonner';

const TransactionPermissions: React.FC = () => {
  // Create permissions with all required fields
  const [permissions, setPermissions] = useState<TransactionPermission[]>(
    [
      { 
        id: 'create_transaction', 
        name: 'Create Transactions', 
        description: 'Create new transactions',
        defaultRoles: ['admin', 'manager'],
        roleId: '',
        canCreate: true,
        canEdit: false,
        canLock: false,
        canDelete: false,
        canApprove: false,
        canReject: false,
        canView: true,
        canReport: false
      },
      { 
        id: 'edit_transaction', 
        name: 'Edit Transactions', 
        description: 'Edit existing transactions',
        defaultRoles: ['admin', 'manager'],
        roleId: '',
        canCreate: false,
        canEdit: true,
        canLock: false,
        canDelete: false,
        canApprove: false,
        canReject: false,
        canView: true,
        canReport: false
      },
      { 
        id: 'lock_transaction', 
        name: 'Lock Transactions', 
        description: 'Lock transactions to prevent edits',
        defaultRoles: ['admin'],
        roleId: '',
        canCreate: false,
        canEdit: false,
        canLock: true,
        canDelete: false,
        canApprove: false,
        canReject: false,
        canView: true,
        canReport: false
      },
      { 
        id: 'delete_transaction', 
        name: 'Delete Transactions', 
        description: 'Delete existing transactions',
        defaultRoles: ['admin'],
        roleId: '',
        canCreate: false,
        canEdit: false,
        canLock: false,
        canDelete: true,
        canApprove: false,
        canReject: false,
        canView: true,
        canReport: false
      }
    ]
  );

  const handlePermissionToggle = (permissionId: string, field: keyof TransactionPermission, value: boolean) => {
    setPermissions(prev =>
      prev.map(p =>
        p.id === permissionId ? { ...p, [field]: value } : p
      )
    );
  };

  const handleSavePermissions = () => {
    // This would save to the backend in a real implementation
    console.log('Saving permissions:', permissions);
    toast.success('Permissions saved successfully');
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Transaction Permissions</h1>
          <p className="text-muted-foreground">
            Configure transaction permissions for different roles
          </p>
        </div>
        <Button onClick={handleSavePermissions}>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="permissions">
        <TabsList className="mb-4">
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="permissions">
          <div className="grid gap-6 md:grid-cols-2">
            {mockRoles.map(role => (
              <Card key={role.id}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShieldAlert className="mr-2 h-5 w-5 text-primary" />
                    {role.name}
                  </CardTitle>
                  <CardDescription>{role.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {permissions.map(permission => (
                      <div key={permission.id} className="flex justify-between items-center">
                        <div>
                          <Label className="text-base font-medium">{permission.name}</Label>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                        <Switch
                          checked={permission.defaultRoles.includes(role.id)}
                          onCheckedChange={(checked) => {
                            // This would update the permission's role assignments
                            console.log(`${checked ? 'Adding' : 'Removing'} ${permission.name} from ${role.name}`);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Settings</CardTitle>
              <CardDescription>Configure global transaction settings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base font-medium">Require approval for transactions over $1000</Label>
                    <p className="text-sm text-muted-foreground">
                      Transactions over this amount will require manager approval
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base font-medium">Auto-lock transactions after 24 hours</Label>
                    <p className="text-sm text-muted-foreground">
                      Transactions will be automatically locked after this period
                    </p>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex justify-between items-center">
                  <div>
                    <Label className="text-base font-medium">Allow backdated transactions</Label>
                    <p className="text-sm text-muted-foreground">
                      Users can create transactions with dates in the past
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TransactionPermissions;
