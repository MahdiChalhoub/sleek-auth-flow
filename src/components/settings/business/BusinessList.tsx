
import React from 'react';
import { Business } from '@/models/interfaces/businessInterfaces';
import { BusinessCard } from './BusinessCard';

interface BusinessListProps {
  businesses: Business[];
  expandedBusinessId: string | null;
  toggleExpand: (id: string) => void;
  handleDeleteBusiness: (id: string) => void;
  handleToggleBusinessStatus: (id: string, isActive: boolean) => void;
}

export const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  expandedBusinessId,
  toggleExpand,
  handleDeleteBusiness,
  handleToggleBusinessStatus
}) => {
  if (businesses.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No businesses found. Click "Add Business" to create one.
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          isExpanded={expandedBusinessId === business.id}
          onToggleExpand={() => toggleExpand(business.id)}
          onDelete={() => handleDeleteBusiness(business.id)}
          onToggleStatus={(isActive) => handleToggleBusinessStatus(business.id, isActive)}
        />
      ))}
    </div>
  );
};
