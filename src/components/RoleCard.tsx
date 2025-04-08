
import React from "react";
import { Role } from "@/models/role";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <Card className="overflow-hidden hover:bg-accent/5 transition-colors">
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
    <Card className={`overflow-hidden ${active ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-2">
        <div>
          <CardTitle className="text-xl">{role.name}</CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            {role.description || "No description provided"}
          </p>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">
              {permissionCount} of {totalPermissions} permissions
            </div>
            <div className="text-xs text-muted-foreground">
              ({permissionPercent}%)
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={() => onEdit(role.id)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="p-0 h-8 w-8 text-destructive" onClick={() => onDelete(role.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="mt-3">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${permissionPercent}%` }}
            ></div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button variant="ghost" className="p-1 w-full flex justify-between" onClick={() => onView(role.id)}>
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
