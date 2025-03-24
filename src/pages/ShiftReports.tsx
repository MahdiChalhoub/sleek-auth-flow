
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ShiftReportsList from "@/components/reports/ShiftReportsList";

const ShiftReports: React.FC = () => {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-3xl font-bold">Rapports de quart / Z-Reports</h1>
      <Card>
        <CardContent className="pt-6">
          <ShiftReportsList />
        </CardContent>
      </Card>
    </div>
  );
};

export default ShiftReports;
