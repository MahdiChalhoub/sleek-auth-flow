
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { OverviewCards } from "@/components/dashboard/OverviewCards";
import { SalesTrendsChart } from "@/components/dashboard/SalesTrendsChart";
import { TopSellingProductsChart } from "@/components/dashboard/TopSellingProductsChart";
import { CategorySalesDistributionChart } from "@/components/dashboard/CategorySalesDistributionChart";
import { ReturnsByCategoryChart } from "@/components/dashboard/ReturnsByCategoryChart";
import { MonthlyPurchaseVsSalesChart } from "@/components/dashboard/MonthlyPurchaseVsSalesChart";
import { DailySummaryTable } from "@/components/dashboard/DailySummaryTable";

export const OverviewTab: React.FC = () => {
  return (
    <TabsContent value="overview" className="m-0 space-y-6">
      <OverviewCards />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Sales & Profit Trends</CardTitle>
            <CardDescription>Last 6 months sales and profit performance</CardDescription>
          </CardHeader>
          <CardContent>
            <SalesTrendsChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
            <CardDescription>Best performing products by quantity and revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <TopSellingProductsChart />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Sales Distribution</CardTitle>
            <CardDescription>Distribution of sales across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategorySalesDistributionChart />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Returns by Category</CardTitle>
            <CardDescription>Distribution of returns across categories</CardDescription>
          </CardHeader>
          <CardContent>
            <ReturnsByCategoryChart />
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Purchases vs Sales</CardTitle>
          <CardDescription>Monthly comparison of purchases and sales</CardDescription>
        </CardHeader>
        <CardContent>
          <MonthlyPurchaseVsSalesChart />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Daily Summary</CardTitle>
          <CardDescription>Register activity and sales summary</CardDescription>
        </CardHeader>
        <CardContent>
          <DailySummaryTable />
        </CardContent>
      </Card>
    </TabsContent>
  );
};
