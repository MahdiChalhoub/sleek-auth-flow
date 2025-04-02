
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Role } from "@/types/auth";
import { Loader2 } from "lucide-react";

interface UserWithRole {
  id: string;
  name: string;
  email: string;
  roleId: string;
}

interface UserRoleTableProps {
  users: UserWithRole[];
  roles: Role[];
  onRoleChange: (userId: string, roleId: string) => void;
}

const UserRoleTable: React.FC<UserRoleTableProps> = ({ users, roles, onRoleChange }) => {
  const [changingRoleForUser, setChangingRoleForUser] = useState<string | null>(null);
  
  const handleRoleChange = (userId: string, roleId: string) => {
    setChangingRoleForUser(userId);
    
    // Process the role change
    onRoleChange(userId, roleId);
    
    // Clear loading state after a short delay
    setTimeout(() => {
      setChangingRoleForUser(null);
    }, 500);
  };
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center h-24 text-muted-foreground">
                No users found
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {changingRoleForUser === user.id ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    <Select
                      defaultValue={user.roleId || "no-role"}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a role">
                          {roles.find(role => role.id === user.roleId)?.name || "No Role Assigned"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {roles.map((role) => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
                          </SelectItem>
                        ))}
                        {/* Add a fallback option if needed */}
                        {!roles.some(role => role.id === "no-role") && (
                          <SelectItem value="no-role">No Role Assigned</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserRoleTable;
