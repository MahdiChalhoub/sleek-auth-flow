
import React from "react";
import { Role } from "@/models/role";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, Trash2, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  if (compact) {
    return (
      <Card className="overflow-hidden hover:bg-accent/5 transition-colors">
        <div className="flex items-center justify-between p-3">
          <div className="flex flex-col">
            <h3 className="font-medium">{role.name}</h3>
            <p className="text-xs text-muted-foreground">
              {role.permissions?.length || 0} permissions
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
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{role.name}</CardTitle>
          </div>
          <Badge variant={role.name.toLowerCase() === 'admin' ? "default" : "outline"}>
            {role.name.toLowerCase() === 'admin' ? "Default" : "Custom"}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground">
          {role.description || "No description provided"}
        </p>
        <div className="mt-2 flex items-center gap-1">
          <span className="text-sm font-medium">
            Permissions:
          </span>
          <span className="text-sm text-muted-foreground">
            {role.permissions?.length || 0}
          </span>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between pt-2">
        <Button variant="outline" size="sm" onClick={() => onView(role.id)}>
          <Eye className="h-4 w-4 mr-1" /> View
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onEdit(role.id)}>
            <Pencil className="h-4 w-4 mr-1" /> Edit
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onDelete(role.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-1" /> Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default RoleCard;
