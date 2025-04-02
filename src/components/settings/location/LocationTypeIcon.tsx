
import React from 'react';
import { Store, Warehouse, Building2, Building } from 'lucide-react';

interface LocationTypeIconProps {
  type: 'retail' | 'warehouse' | 'office' | 'other';
}

export const LocationTypeIcon: React.FC<LocationTypeIconProps> = ({ type }) => {
  switch (type) {
    case 'retail':
      return <Store className="h-5 w-5 text-primary" />;
    case 'warehouse':
      return <Warehouse className="h-5 w-5 text-amber-500" />;
    case 'office':
      return <Building2 className="h-5 w-5 text-blue-500" />;
    case 'other':
      return <Building className="h-5 w-5 text-gray-500" />;
    default:
      return <Store className="h-5 w-5 text-primary" />;
  }
};
