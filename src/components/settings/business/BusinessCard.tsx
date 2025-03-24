
import React from "react";
import { Building, Globe, Check, X, ChevronDown, ChevronUp, Edit, Trash2 } from "lucide-react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Business } from "@/models/interfaces/businessInterfaces";

interface BusinessCardProps {
  business: Business;
  isExpanded: boolean;
  onToggleExpand: (businessId: string) => void;
  onDeleteBusiness: (id: string) => void;
  onToggleBusinessStatus: (id: string) => void;
  children?: React.ReactNode;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  isExpanded,
  onToggleExpand,
  onDeleteBusiness,
  onToggleBusinessStatus,
  children,
}) => {
  return (
    <React.Fragment>
      <TableRow className="hover:bg-muted/40">
        <TableCell className="font-medium flex items-center gap-2">
          {business.logoUrl ? (
            <img 
              src={business.logoUrl} 
              alt={business.name} 
              className="w-8 h-8 rounded-full" 
            />
          ) : (
            <Building className="w-6 h-6 text-muted-foreground" />
          )}
          {business.name}
        </TableCell>
        <TableCell>{business.type || "N/A"}</TableCell>
        <TableCell>
          <div className="flex items-center gap-1">
            <Globe className="h-4 w-4 text-muted-foreground" />
            {business.country || "N/A"} / {business.currency || "N/A"}
          </div>
        </TableCell>
        <TableCell>
          <Badge 
            variant={business.active ? "success" : "destructive"}
            className={`gap-1 ${business.active ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' : 'bg-red-500/20 text-red-600 hover:bg-red-500/30'}`}
          >
            {business.active ? (
              <>
                <Check className="h-3 w-3" /> Active
              </>
            ) : (
              <>
                <X className="h-3 w-3" /> Inactive
              </>
            )}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => onToggleBusinessStatus(business.id)}>
              {business.active ? "Deactivate" : "Activate"}
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => onDeleteBusiness(business.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8"
              onClick={() => onToggleExpand(business.id)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </TableCell>
      </TableRow>
      {isExpanded && (
        <TableRow>
          <TableCell colSpan={5} className="p-0 border-b-0">
            <div className="border-t border-dashed p-4 bg-muted/20">
              {children}
            </div>
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  );
};
