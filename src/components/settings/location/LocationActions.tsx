
import React from "react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, MoreHorizontal } from "lucide-react";

interface LocationActionsProps {
  locationId: string;
  status: string;
  onToggleStatus: (id: string) => void;
  onDelete: (id: string) => void;
}

export const LocationActions: React.FC<LocationActionsProps> = ({
  locationId,
  status,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => console.log("Edit", locationId)} className="flex items-center gap-2">
          <Edit className="h-4 w-4" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleStatus(locationId)} className="flex items-center gap-2">
          {status === "active" ? (
            <>Deactivate</>
          ) : (
            <>Activate</>
          )}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => onDelete(locationId)} 
          className="flex items-center gap-2 text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
