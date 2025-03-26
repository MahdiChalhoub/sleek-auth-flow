
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import CategoryTree from "@/components/inventory/CategoryTree";
import { useCategoryTree } from "@/hooks/useCategoryTree";
import { Skeleton } from "@/components/ui/skeleton";

const CategoryManagementPanel = () => {
  const { 
    categoryTree, 
    isLoading, 
    error, 
    selectedCategoryId, 
    selectCategory 
  } = useCategoryTree();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-8 text-destructive">
            Error loading categories: {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>Category Management</CardTitle>
          <CardDescription>Organize your products with categories</CardDescription>
        </div>
        <Button size="sm" onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-1" />
          Add Category
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
          </div>
        ) : categoryTree.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            <p>No categories found.</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create your first category
            </Button>
          </div>
        ) : (
          <CategoryTree 
            categories={categoryTree} 
            selectedCategoryId={selectedCategoryId || undefined}
            onSelectCategory={selectCategory}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryManagementPanel;
