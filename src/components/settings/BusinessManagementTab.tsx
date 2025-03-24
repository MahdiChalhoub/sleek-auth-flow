
import React from "react";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Building } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { AddBusinessModal } from "./AddBusinessModal";
import { BusinessList } from "./business/BusinessList";
import { useBusinessManagement } from "@/hooks/useBusinessManagement";

export const BusinessManagementTab: React.FC = () => {
  const { user } = useAuth();
  const {
    businesses,
    expandedBusinessId,
    isAddBusinessModalOpen,
    setIsAddBusinessModalOpen,
    toggleExpand,
    handleAddBusiness,
    handleDeleteBusiness,
    handleToggleBusinessStatus,
  } = useBusinessManagement();
  
  // Check if user is a super admin - only they can manage businesses
  const isSuperAdmin = user?.isGlobalAdmin;
  
  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Business Management</CardTitle>
          <CardDescription>
            You don't have permission to manage businesses. Please contact a super admin.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              <Building className="h-5 w-5" />
              Business Management
            </CardTitle>
            <CardDescription>
              Manage your businesses and their settings
            </CardDescription>
          </div>
          <Button onClick={() => setIsAddBusinessModalOpen(true)} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Business
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <BusinessList
          businesses={businesses}
          expandedBusinessId={expandedBusinessId}
          toggleExpand={toggleExpand}
          handleDeleteBusiness={handleDeleteBusiness}
          handleToggleBusinessStatus={handleToggleBusinessStatus}
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
