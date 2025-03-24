
import React, { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { DateRange } from "react-day-picker";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { DashboardTabs } from "@/components/dashboard/DashboardTabs";
import { OverviewTab } from "@/components/dashboard/tabs/OverviewTab";
import { StaffTab } from "@/components/dashboard/tabs/StaffTab";
import { FinanceTab } from "@/components/dashboard/tabs/FinanceTab";
import { LoyaltyTab } from "@/components/dashboard/tabs/LoyaltyTab";

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(),
    to: new Date(),
  });
  const [cashier, setCashier] = useState<string>("");
  const [register, setRegister] = useState<string>("");
  const [product, setProduct] = useState<string>("");
  const [category, setCategory] = useState<string>("");

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
