
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { FinancialManagementSection } from "@/components/dashboard/FinancialManagementSection";

export const FinanceTab: React.FC = () => {
  return (
    <TabsContent value="finance" className="m-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Financial Management</CardTitle>
          <CardDescription>Track financial performance and manage expenses</CardDescription>
        </CardHeader>
        <CardContent>
          <FinancialManagementSection />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
