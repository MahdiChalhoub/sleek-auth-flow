
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/formatters';
import { User, UserStatus } from '@/types/auth';

interface UserViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onEdit?: () => void;
  onDelete?: () => void;
  onChangeRole?: () => void;
  onActivate?: () => void;
  onDeactivate?: () => void;
}

export function UserViewDialog({
  open,
  onOpenChange,
  user,
  onEdit = () => {},
  onDelete = () => {},
  onChangeRole = () => {},
  onActivate = () => {},
  onDeactivate = () => {},
}: UserViewDialogProps) {
  if (!user) return null;

  const getStatusBadge = (status: UserStatus) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="outline" className="text-amber-600 border-amber-600">Pending</Badge>;
      case 'inactive':
        return <Badge variant="outline" className="text-slate-600 border-slate-600">Inactive</Badge>;
      case 'denied':
        return <Badge variant="destructive">Denied</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View detailed information about this user
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.fullName || user.email}
                className="h-16 w-16 rounded-full object-cover"
              />
            ) : (
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl font-medium text-muted-foreground">
                  {(user.fullName || user.email).charAt(0).toUpperCase()}
                </span>
              </div>
            )}
            <div>
              <h3 className="text-lg font-medium">{user.fullName || 'N/A'}</h3>
              <p className="text-muted-foreground">{user.email}</p>
              <div className="mt-1">{getStatusBadge(user.status)}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
              <p>{user.role || 'N/A'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Last Login</h4>
              <p>{user.lastLogin ? formatDate(user.lastLogin) : 'Never'}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Account Created</h4>
              <p>{formatDate(user.createdAt)}</p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mt-2">
            <Button size="sm" onClick={onEdit}>
              Edit User
            </Button>
            <Button size="sm" variant="outline" onClick={onChangeRole}>
              Change Role
            </Button>
            {user.status === 'active' ? (
              <Button size="sm" variant="outline" onClick={onDeactivate}>
                Deactivate
              </Button>
            ) : (
              <Button size="sm" variant="outline" onClick={onActivate}>
                Activate
              </Button>
            )}
            <Button size="sm" variant="destructive" onClick={onDelete}>
              Delete User
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
