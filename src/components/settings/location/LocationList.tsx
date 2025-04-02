
import React from 'react';
import { Branch } from '@/types/location';
import { LocationActions } from './LocationActions';
import { LocationStatusBadge } from './LocationStatusBadge';
import { LocationTypeIcon } from './LocationTypeIcon';
import { Separator } from '@/components/ui/separator';

interface LocationListProps {
  locations: Branch[];
  onDeleteLocation: (id: string) => void;
  onToggleLocationStatus: (id: string, isActive: boolean) => void;
}

export const LocationList: React.FC<LocationListProps> = ({
  locations,
  onDeleteLocation,
  onToggleLocationStatus
}) => {
  if (locations.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        No locations found. Add a location to get started.
      </div>
    );
  }

  return (
    <div className="divide-y">
      {locations.map((location) => (
        <div key={location.id} className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LocationTypeIcon type={location.type} />
              <div>
                <h3 className="font-medium">{location.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {location.address || 'No address provided'}
                </p>
              </div>
              {location.isDefault && (
                <span className="ml-2 rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Default
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <LocationStatusBadge status={location.status} />
              <LocationActions 
                location={location}
                onDelete={() => onDeleteLocation(location.id)}
                onToggleStatus={(isActive) => onToggleLocationStatus(location.id, isActive)}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
