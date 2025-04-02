
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { UserRole, User } from '@/types/auth';
import { Role } from '@/models/role';

interface UserRoleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  roles: Role[];
  onSubmit: (roleId: string) => Promise<void | boolean>;
  isSubmitting?: boolean;
}

export function UserRoleDialog({
  open,
  onOpenChange,
  user,
  roles,
  onSubmit,
  isSubmitting = false,
}: UserRoleDialogProps) {
  const [selectedRoleId, setSelectedRoleId] = React.useState<string>('');
  const [submitting, setSubmitting] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      // Find the role ID matching the current role name
      const roleId = roles.find(r => r.name.toLowerCase() === user.role)?.id || '';
      setSelectedRoleId(roleId);
    }
  }, [open, user.role, roles]);

  const handleSubmit = async () => {
    if (!selectedRoleId) return;
    
    setSubmitting(true);
    try {
      await onSubmit(selectedRoleId);
      onOpenChange(false);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change User Role</DialogTitle>
          <DialogDescription>
            Select a new role for {user.email}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedRoleId} onValueChange={setSelectedRoleId}>
            {roles.map(role => (
              <div key={role.id} className="flex items-start space-x-2 mb-3">
                <RadioGroupItem value={role.id} id={`role-${role.id}`} />
                <div className="grid gap-1.5">
                  <Label htmlFor={`role-${role.id}`} className="font-medium">
                    {role.name}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting || submitting}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || submitting || !selectedRoleId}
          >
            {isSubmitting || submitting ? "Updating..." : "Change Role"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
