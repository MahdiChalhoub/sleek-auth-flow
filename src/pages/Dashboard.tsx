
import React, { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/providers/AuthProvider"; // Updated import path
import { DateRange } from "react-day-picker";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { StaffTab } from "@/components/dashboard/tabs/StaffTab";
import { FinanceTab } from "@/components/dashboard/tabs/FinanceTab";
import { LoyaltyTab } from "@/components/dashboard/tabs/LoyaltyTab";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const Dashboard: React.FC = () => {
  const { user, currentBusiness } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [cashier, setCashier] = useState<string>("");
  const [register, setRegister] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!currentBusiness) {
    return (
      <div className="container mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>No Business Selected</CardTitle>
            <CardDescription>
              Please select or create a business to continue.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 h-[50vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-6">
      <DashboardHeader user={user} />

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <DashboardTabs />
        
        {/* Filter Card */}
        <DashboardFilters 
          dateRange={dateRange}
          setDateRange={setDateRange}
          cashier={cashier}
          setCashier={setCashier}
          register={register}
          setRegister={setRegister}
          product={product}
          setProduct={setProduct}
        />
        
        {/* Tab Contents */}
        <OverviewTab />
        <StaffTab />
        <FinanceTab />
        <LoyaltyTab />
      </Tabs>
    </div>
  );
};

export default Dashboard;
