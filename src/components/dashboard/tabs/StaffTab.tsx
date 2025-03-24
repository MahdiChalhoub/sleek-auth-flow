
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { StaffManagementTable } from "@/components/dashboard/StaffManagementTable";

export const StaffTab: React.FC = () => {
  return (
    <TabsContent value="staff" className="m-0 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Staff Management</CardTitle>
          <CardDescription>Manage employees, attendance, and payroll</CardDescription>
        </CardHeader>
        <CardContent>
          <StaffManagementTable />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
