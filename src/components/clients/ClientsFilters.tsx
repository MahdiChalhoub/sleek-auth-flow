
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ClientsFiltersProps {
  currentFilters: {
    clientType: string;
  };
  onApplyFilters: (filters: { clientType: string }) => void;
}

export const ClientsFilters: React.FC<ClientsFiltersProps> = ({
  currentFilters,
  onApplyFilters
}) => {
  const [localFilters, setLocalFilters] = useState(currentFilters);

  const handleTypeChange = (value: string) => {
    setLocalFilters({
      ...localFilters,
      clientType: value
    });
  };

  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
  };

  const handleResetFilters = () => {
    const resetFilters = {
      clientType: 'all'
    };
    setLocalFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  return (
    <Card className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Client Type</label>
          <Select value={localFilters.clientType} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select client type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="vip">VIP</SelectItem>
              <SelectItem value="credit">Credit</SelectItem>
              <SelectItem value="wholesale">Wholesale</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={handleResetFilters}>
          Reset
        </Button>
        <Button onClick={handleApplyFilters}>
          Apply Filters
        </Button>
      </div>
    </Card>
  );
};
