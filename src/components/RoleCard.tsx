
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Edit, Trash2 } from "lucide-react";
import { Role } from "@/models/role";
import { Progress } from "@/components/ui/progress";

interface RoleCardProps {
  role: Role;
  onEdit: (roleId: string) => void;
  onView: (roleId: string) => void;
  onDelete: (roleId: string) => void;
}

const RoleCard: React.FC<RoleCardProps> = ({ 
  role, 
  onEdit, 
  onView, 
  onDelete 
}) => {
  // Count enabled permissions
  const enabledPermissions = role.permissions.filter(p => p.enabled).length;
  const totalPermissions = role.permissions.length;
  const permissionPercentage = Math.round((enabledPermissions / totalPermissions) * 100);

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-xl">{role.name}</h3>
            <p className="text-muted-foreground text-sm">{role.description}</p>
          </div>
          <div className="flex gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onEdit(role.id)}
              className="h-8 w-8"
            >
              <Edit className="h-4 w-4" />
              <span className="sr-only">Edit Role</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => onDelete(role.id)}
              className="h-8 w-8 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete Role</span>
            </Button>
          </div>
        </div>
        
        <div className="mt-4">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span className="font-medium">
              {enabledPermissions} of {totalPermissions} permissions
            </span>
            <span className="text-muted-foreground">
              ({permissionPercentage}%)
            </span>
          </div>
          
          <Progress value={permissionPercentage} className="h-2 mb-4" />

          <div className="flex justify-end mt-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onView(role.id)}
              className="text-xs gap-1"
            >
              View Details
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleCard;
