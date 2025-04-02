
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Role, mockRoles } from '@/models/role';
import { TransactionPermission } from '@/models/interfaces/transactionInterfaces';

const TransactionPermissions = () => {
  // Define default transaction permissions
  const defaultPermissions: TransactionPermission[] = [
    {
      id: 'perm-sales-create',
      name: 'Create Sales',
      description: 'Ability to create new sales transactions',
      roleId: '',
      canCreate: true,
      canEdit: false,
      canLock: false,
      canDelete: false,
      canApprove: false,
      canReconcile: false,
      canViewSensitive: false,
      maxAmount: 1000
    },
    {
      id: 'perm-expenses-create',
      name: 'Create Expenses',
      description: 'Ability to create expense transactions',
      roleId: '',
      canCreate: true,
      canEdit: false,
      canLock: false,
      canDelete: false,
      canApprove: false,
      canReconcile: false,
      canViewSensitive: false,
      maxAmount: 500
    },
    {
      id: 'perm-refunds-process',
      name: 'Process Refunds',
      description: 'Ability to process refund transactions',
      roleId: '',
      canCreate: true,
      canEdit: false,
      canLock: false,
      canDelete: false,
      canApprove: false,
      canReconcile: false,
      canViewSensitive: false,
      maxAmount: 200
    }
  ];

  const [permissions, setPermissions] = useState<TransactionPermission[]>(defaultPermissions);

  const handlePermissionChange = (index: number, field: keyof TransactionPermission, value: any) => {
    const updatedPermissions = [...permissions];
    updatedPermissions[index] = {
      ...updatedPermissions[index],
      [field]: value
    };
    setPermissions(updatedPermissions);
  };

  const handleSave = () => {
    console.log('Saving permissions:', permissions);
    // Here you would send the updated permissions to your API
  };

  return (
    <div className="container mx-auto py-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Transaction Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[250px]">Permission</TableHead>
                    <TableHead>Create</TableHead>
                    <TableHead>Edit</TableHead>
                    <TableHead>Delete</TableHead>
                    <TableHead>Approve</TableHead>
                    <TableHead>Reconcile</TableHead>
                    <TableHead>Max Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {permissions.map((permission, index) => (
                    <TableRow key={permission.id}>
                      <TableCell>
                        <div className="font-medium">{permission.name}</div>
                        <div className="text-sm text-muted-foreground">{permission.description}</div>
                      </TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={permission.canCreate}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canCreate', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={permission.canEdit}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canEdit', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={permission.canDelete}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canDelete', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={permission.canApprove}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canApprove', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox 
                          checked={permission.canReconcile}
                          onCheckedChange={(checked) => 
                            handlePermissionChange(index, 'canReconcile', !!checked)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Input 
                          type="number" 
                          value={permission.maxAmount}
                          onChange={(e) => 
                            handlePermissionChange(index, 'maxAmount', Number(e.target.value))
                          }
                          className="w-[100px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium">Role Assignment</h3>
                <p className="text-sm text-muted-foreground">Specify which roles have these transaction permissions.</p>
              </div>

              <div className="space-y-2">
                {mockRoles.map(role => (
                  <div key={role.id} className="flex items-center justify-between py-2 border-b">
                    <div>
                      <h4 className="font-medium">{role.name}</h4>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </div>
                    <Switch />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline">Cancel</Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionPermissions;
