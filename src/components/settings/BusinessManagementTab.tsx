
import React, { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardHeader, 
  CardContent, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Eye, Building, Globe, Check, X, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Business, mockBusinesses } from "@/models/interfaces/businessInterfaces";
import { AddBusinessModal } from "./AddBusinessModal";
import { LocationManagement } from "./LocationManagement";

export const BusinessManagementTab: React.FC = () => {
  const { user } = useAuth();
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [isAddBusinessModalOpen, setIsAddBusinessModalOpen] = useState(false);
  const [expandedBusinessId, setExpandedBusinessId] = useState<string | null>(null);
  
  // Check if user is a super admin - only they can manage businesses
  const isSuperAdmin = user?.isGlobalAdmin;
  
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
                <React.Fragment key={business.id}>
                  <TableRow className="hover:bg-muted/40">
                    <TableCell className="font-medium flex items-center gap-2">
                      {business.logoUrl ? (
                        <img 
                          src={business.logoUrl} 
                          alt={business.name} 
                          className="w-8 h-8 rounded-full" 
                        />
                      ) : (
                        <Building className="w-6 h-6 text-muted-foreground" />
                      )}
                      {business.name}
                    </TableCell>
                    <TableCell>{business.type || "N/A"}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        {business.country || "N/A"} / {business.currency || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant={business.active ? "success" : "destructive"}
                        className={`gap-1 ${business.active ? 'bg-green-500/20 text-green-600 hover:bg-green-500/30' : 'bg-red-500/20 text-red-600 hover:bg-red-500/30'}`}
                      >
                        {business.active ? (
                          <>
                            <Check className="h-3 w-3" /> Active
                          </>
                        ) : (
                          <>
                            <X className="h-3 w-3" /> Inactive
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleToggleBusinessStatus(business.id)}>
                          {business.active ? "Deactivate" : "Activate"}
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDeleteBusiness(business.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={() => toggleExpand(business.id)}
                        >
                          {expandedBusinessId === business.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedBusinessId === business.id && (
                    <TableRow>
                      <TableCell colSpan={5} className="p-0 border-b-0">
                        <div className="border-t border-dashed p-4 bg-muted/20">
                          <LocationManagement businessId={business.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
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
      </CardContent>
      
      <AddBusinessModal 
        isOpen={isAddBusinessModalOpen} 
        onClose={() => setIsAddBusinessModalOpen(false)}
        onSave={handleAddBusiness}
      />
    </Card>
  );
};
