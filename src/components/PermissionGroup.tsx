
import React from "react";
import { UserPermission } from "@/types/auth";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface PermissionGroupProps {
  category: string;
  permissions: UserPermission[];
  onTogglePermission: (id: string, enabled: boolean) => void;
  readOnly?: boolean;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({
  category,
  permissions,
  onTogglePermission,
  readOnly = false
}) => {
  return (
    <div className="space-y-4">
      {permissions.map((permission) => (
        <div key={permission.id} className="flex items-center justify-between space-x-2">
          <div className="space-y-0.5">
            <Label htmlFor={permission.id} className="text-base">
              {permission.name}
            </Label>
            {permission.description && (
              <p className="text-sm text-muted-foreground">
                {permission.description}
              </p>
            )}
          </div>
          <Switch
            id={permission.id}
            checked={permission.enabled}
            onCheckedChange={(checked) => onTogglePermission(permission.id, checked)}
            disabled={readOnly}
          />
        </div>
      ))}
    </div>
  );
};

export default PermissionGroup;
