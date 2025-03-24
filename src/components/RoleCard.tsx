
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Role } from "@/models/role";
import { cn } from "@/lib/utils";

interface RoleCardProps {
  role: Role;
  onEdit: (roleId: string) => void;
  onView: (roleId: string) => void;
  onDelete: (roleId: string) => void;
  active?: boolean;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  onEdit, 
  onView, 
  onDelete, 
  active = false 
}) => {
  // Count enabled permissions
  const enabledPermissions = role.permissions.filter(p => p.enabled).length;
  const totalPermissions = role.permissions.length;
  const permissionPercentage = Math.round((enabledPermissions / totalPermissions) * 100);

  return (
    <Card className={cn(
      "transition-all duration-200 hover:shadow-md", 
      active ? "ring-2 ring-primary ring-offset-2" : ""
    )}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{role.name}</CardTitle>
            <CardDescription>{role.description}</CardDescription>
          </div>
          <div className="flex space-x-1">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onEdit(role.id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Role</span>
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              onClick={() => onDelete(role.id)}
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Role</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="px-2 py-0.5">
              {enabledPermissions} of {totalPermissions} permissions ({permissionPercentage}%)
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs font-normal px-2 h-7"
              onClick={() => onView(role.id)}
            >
              View Details
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
          
          <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
            <div 
              className="bg-primary h-full rounded-full" 
              style={{ width: `${permissionPercentage}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
