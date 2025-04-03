
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CircleCheck, CircleX, CircleDashed, CircleSlash } from 'lucide-react';

interface LocationStatusBadgeProps {
  status: 'active' | 'inactive' | 'pending' | 'closed';
}

export const LocationStatusBadge: React.FC<LocationStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'active':
      return (
        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
          <CircleCheck className="h-3 w-3" />
          Active
        </Badge>
      );
    case 'inactive':
      return (
        <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex items-center gap-1">
          <CircleX className="h-3 w-3" />
          Inactive
        </Badge>
      );
    case 'pending':
      return (
        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
          <CircleDashed className="h-3 w-3" />
          Pending
        </Badge>
      );
    case 'closed':
      return (
        <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200 flex items-center gap-1">
          <CircleSlash className="h-3 w-3" />
          Closed
        </Badge>
      );
    default:
      return null;
  }
};
