
import React from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Business } from "@/models/interfaces/businessInterfaces";
import { LocationManagement } from "../LocationManagement";
import { BusinessCard } from "./BusinessCard";

interface BusinessListProps {
  businesses: Business[];
  expandedBusinessId: string | null;
  toggleExpand: (businessId: string) => void;
  handleDeleteBusiness: (id: string) => void;
  handleToggleBusinessStatus: (id: string) => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  expandedBusinessId,
  toggleExpand,
  handleDeleteBusiness,
  handleToggleBusinessStatus,
}) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[250px]">Business Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Country / Currency</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {businesses.map((business) => (
            <BusinessCard
              key={business.id}
              business={business}
              isExpanded={expandedBusinessId === business.id}
              onToggleExpand={toggleExpand}
              onDeleteBusiness={handleDeleteBusiness}
              onToggleBusinessStatus={handleToggleBusinessStatus}
            >
              <LocationManagement businessId={business.id} />
            </BusinessCard>
          ))}
          {businesses.length === 0 && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                No businesses found. Click "Add Business" to create one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
