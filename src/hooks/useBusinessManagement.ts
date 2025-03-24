
import { useState } from "react";
import { Business, mockBusinesses } from "@/models/interfaces/businessInterfaces";

export const useBusinessManagement = () => {
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  
  const toggleExpand = (businessId: string) => {
    if (expandedBusinessId === businessId) {
      setExpandedBusinessId(null);
    } else {
      setExpandedBusinessId(businessId);
    }
  };
  
  const handleAddBusiness = (newBusiness: Business) => {
    setBusinesses((prev) => [...prev, newBusiness]);
    setIsAddBusinessModalOpen(false);
  };
  
  const handleDeleteBusiness = (id: string) => {
    if (window.confirm("Are you sure you want to delete this business? This action cannot be undone.")) {
      setBusinesses((prev) => prev.filter((business) => business.id !== id));
    }
  };
  
  const handleToggleBusinessStatus = (id: string) => {
    setBusinesses((prev) =>
      prev.map((business) =>
        business.id === id
          ? { ...business, active: !business.active }
          : business
      )
    );
  };
  
  return {
    businesses,
    expandedBusinessId,
    isAddBusinessModalOpen,
    setIsAddBusinessModalOpen,
    toggleExpand,
    handleAddBusiness,
    handleDeleteBusiness,
    handleToggleBusinessStatus,
  };
};
