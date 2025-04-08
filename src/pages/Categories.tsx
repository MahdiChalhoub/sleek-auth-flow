
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import CategoryManagement from "@/components/inventory/CategoryManagement";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useResponsiveLayout } from "@/hooks/useResponsiveLayout";

const Categories: React.FC = () => {
  const { mainContentPadding } = useResponsiveLayout();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={`${mainContentPadding} max-w-full mx-auto space-y-6`}>
      <h1 className="text-3xl font-bold">Gestion des catégories</h1>
      
      {/* Search and add category actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative w-full sm:w-auto sm:min-w-[300px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button className="flex items-center gap-1">
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>
      
      {/* Category management with bordered container */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <CategoryManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
