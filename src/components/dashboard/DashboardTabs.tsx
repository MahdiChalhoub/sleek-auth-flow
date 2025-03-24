
import React from "react";
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, Users, DollarSign, Gift } from "lucide-react";

export const DashboardTabs: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <TabsList className="w-full sm:w-auto">
        <TabsTrigger value="overview" className="flex items-center">
          <BarChart3 className="mr-1.5 h-4 w-4" />
          Overview
        </TabsTrigger>
        <TabsTrigger value="staff" className="flex items-center">
          <Users className="mr-1.5 h-4 w-4" />
          Staff
        </TabsTrigger>
        <TabsTrigger value="finance" className="flex items-center">
          <DollarSign className="mr-1.5 h-4 w-4" />
          Finance
        </TabsTrigger>
        <TabsTrigger value="loyalty" className="flex items-center">
          <Gift className="mr-1.5 h-4 w-4" />
          Loyalty
        </TabsTrigger>
      </TabsList>
    </div>
  );
};
