
import React from 'react';
import { BusinessCard } from '@/components/settings/business/BusinessCard';
import { Business } from '@/models/interfaces/businessInterfaces';
import { Skeleton } from '@/components/ui/skeleton';

interface BusinessListProps {
  businesses: Business[];
  isLoading: boolean;
  expandedBusinessId: string | null;
  onToggleExpand: (businessId: string) => void;
  onDeleteBusiness: (businessId: string) => Promise<void>;
  onToggleBusinessStatus: (businessId: string, isActive: boolean) => Promise<void>;
}

export const BusinessList: React.FC<BusinessListProps> = ({
  businesses,
  isLoading,
  expandedBusinessId,
  onToggleExpand,
  onDeleteBusiness,
  onToggleBusinessStatus
}) => {
  if (isLoading) {
    return (
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    );
  }

  if (businesses.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No businesses found. Add your first business to get started.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {businesses.map((business) => (
        <BusinessCard
          key={business.id}
          business={business}
          isExpanded={expandedBusinessId === business.id}
          onToggleExpand={() => onToggleExpand(business.id)}
          onToggleStatus={isActive => onToggleBusinessStatus(business.id, isActive)}
          onDeleteBusiness={() => onDeleteBusiness(business.id)}
        />
      ))}
    </div>
  );
};
