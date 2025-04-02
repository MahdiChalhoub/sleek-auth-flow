
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { User, UserPermission, UserStatus } from '@/types/auth';
import { formatDate } from '@/utils/formatters';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
}

const statusColors: Record<UserStatus, string> = {
  active: 'bg-green-100 text-green-800',
  pending: 'bg-yellow-100 text-yellow-800',
  inactive: 'bg-gray-100 text-gray-800',
  denied: 'bg-red-100 text-red-800',
};

const roleColors: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-800',
  manager: 'bg-blue-100 text-blue-800',
  cashier: 'bg-teal-100 text-teal-800',
};

const UserViewDialog: React.FC<UserViewDialogProps> = ({
  open,
  onOpenChange,
  user,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={user.avatarUrl} alt={user.fullName || user.name || 'User'} />
              <AvatarFallback>
                {getInitials(user.fullName || user.name || user.email)}
              </AvatarFallback>
            </Avatar>
            
            <div>
              <h3 className="font-medium">{user.fullName || user.name || user.email}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-1">Status</h4>
              <Badge variant="outline" className={statusColors[user.status]}>
                {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Role</h4>
              <Badge variant="outline" className={roleColors[user.role] || 'bg-gray-100'}>
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </Badge>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Last Login</h4>
              <p className="text-sm">{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
            </div>
            
            <div>
              <h4 className="text-sm font-medium mb-1">Created</h4>
              <p className="text-sm">{user.createdAt ? formatDate(user.createdAt) : 'Unknown'}</p>
            </div>
          </div>
          
          {user.permissions && user.permissions.length > 0 && (
            <div>
              <h4 className="text-sm font-medium mb-2">Permissions</h4>
              <div className="flex flex-wrap gap-2">
                {user.permissions.map((permission: UserPermission) => (
                  <Badge key={permission.id} variant="secondary" className="text-xs">
                    {permission.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserViewDialog;
