
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PlusCircle, Building } from 'lucide-react';
import { AddBusinessModal } from './AddBusinessModal';
import { BusinessList } from './business/BusinessList';
import { useBusinessManagement } from '@/hooks/useBusinessManagement';

export const BusinessManagementTab: React.FC = () => {
  const {
    businesses,
    isLoading,
    handleAddBusiness,
    handleDeleteBusiness,
    handleToggleBusinessStatus,
    refreshBusinesses
  } = useBusinessManagement();
  
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  
  const toggleExpand = (businessId: string) => {
    setExpandedBusinessId(prev => prev === businessId ? null : businessId);
  };
  
  return (
    <Card className="shadow-sm border-none">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Businesses
            </CardTitle>
            <CardDescription>
              Manage your businesses
            </CardDescription>
          </div>
          <Button 
            onClick={() => setIsAddBusinessModalOpen(true)} 
            className="flex items-center gap-2"
            size="sm"
          >
            <PlusCircle className="h-4 w-4" />
            Add Business
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <BusinessList 
          businesses={businesses}
          isLoading={isLoading}
          expandedBusinessId={expandedBusinessId}
          onToggleExpand={toggleExpand}
          onDeleteBusiness={handleDeleteBusiness}
          onToggleBusinessStatus={handleToggleBusinessStatus}
        />
      </CardContent>
      
      <AddBusinessModal 
        isOpen={isAddBusinessModalOpen}
        onClose={() => setIsAddBusinessModalOpen(false)}
        onSave={handleAddBusiness}
      />
    </Card>
  );
};
