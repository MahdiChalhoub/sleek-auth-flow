
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import CategoryManagement from "@/components/inventory/CategoryManagement";

const Categories: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Category Management</h1>
      <Card>
        <CardContent className="pt-6">
          <CategoryManagement />
        </CardContent>
      </Card>
    </div>
  );
};

export default Categories;
