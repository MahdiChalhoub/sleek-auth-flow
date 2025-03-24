
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Permission } from "@/models/role";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

interface PermissionGroupProps {
  category: string;
  permissions: Permission[];
  onTogglePermission: (permissionId: string, enabled: boolean) => void;
  readOnly?: boolean;
}

const PermissionGroup: React.FC<PermissionGroupProps> = ({
  category,
  permissions,
  onTogglePermission,
  readOnly = false,
}) => {
  if (permissions.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{category}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {permissions.map((permission) => (
            <div key={permission.id} className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="font-medium">{permission.name}</div>
                <div className="text-sm text-muted-foreground">
                  {permission.description}
                </div>
              </div>
              <Switch
                checked={permission.enabled}
                onCheckedChange={(checked) => onTogglePermission(permission.id, checked)}
                disabled={readOnly}
                className={cn(
                  permission.enabled ? "bg-primary" : "bg-input",
                  readOnly && "opacity-60 cursor-not-allowed"
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default PermissionGroup;
