
import React from "react";
import { Role } from "@/models/role";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, ChevronRight } from "lucide-react";

interface RoleCardProps {
  role: Role;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  compact?: boolean;
  active?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  onView, 
  onEdit, 
  onDelete,
  compact = false,
  active = false
}) => {
  // Calculate permissions percentage
  const calculatePermissionPercent = () => {
    if (!role.permissions?.length) return 0;
    // Assuming that all permissions should be enabled for 100%
    const enabledPermissions = role.permissions.filter(p => p.enabled).length;
    const totalPermissions = role.permissions.length;
    return Math.round((enabledPermissions / totalPermissions) * 100);
  };

  const permissionPercent = calculatePermissionPercent();
  const permissionCount = role.permissions?.filter(p => p.enabled).length || 0;
  const totalPermissions = role.permissions?.length || 0;

  if (compact) {
    return (
      <Card className="overflow-hidden hover:bg-accent/5 transition-colors hover:shadow-sm">
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col">
            <h3 className="font-medium">{role.name}</h3>
            <p className="text-xs text-muted-foreground">
              {permissionCount} permissions
            </p>
          </div>
          
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onView(role.id)}
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(role.id)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-destructive" 
              onClick={() => onDelete(role.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card 
      className={`overflow-hidden h-full flex flex-col ${active ? 'ring-2 ring-primary' : ''} 
        hover:shadow-md hover:border-primary/30 transition-all duration-200`}
    >
      <div className="p-4 md:p-5 space-y-3 flex-grow">
        {/* Role name and actions */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold line-clamp-1">{role.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {role.description || "No description provided"}
            </p>
          </div>
          
          <div className="flex items-center gap-1 ml-2 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0" 
              onClick={() => onEdit(role.id)}
              aria-label="Edit role"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 p-0 text-destructive" 
              onClick={() => onDelete(role.id)}
              aria-label="Delete role"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Permissions count and progress bar */}
        <div className="space-y-2 mt-auto">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">
              {permissionCount} of {totalPermissions} permissions 
              <span className="text-xs text-muted-foreground ml-1">
                ({permissionPercent}%)
              </span>
            </p>
          </div>
          
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all duration-300 ease-in-out" 
              style={{ width: `${permissionPercent}%` }}
            ></div>
          </div>
        </div>
        
        {/* View details button */}
        <Button 
          variant="ghost" 
          className="w-full flex items-center justify-between text-sm p-2 h-auto mt-2 hover:bg-primary/10"
          onClick={() => onView(role.id)}
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default RoleCard;
