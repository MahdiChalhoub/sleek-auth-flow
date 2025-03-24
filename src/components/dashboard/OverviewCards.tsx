
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ArrowUpRight, DollarSign, Package, RefreshCw, TrendingUp } from "lucide-react";

export const OverviewCards: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const todayData = {
    totalSales: 4785.50,
    totalProfit: 1258.75,
    returnsCount: 5,
    expenses: 876.25
  };
  
  const getPercentChange = (value: number) => {
    // Mock percentage changes - would be calculated in a real app
    const percentages = {
      4785.50: 12.5,
      1258.75: 8.2,
      5: -15.5,
      876.25: 4.8
    };
    
    return percentages[value as keyof typeof percentages] || 0;
  };
  
  const cards = [
    {
      title: "Total Sales Today",
      value: todayData.totalSales,
      description: "Total revenue from all sales",
      percentChange: getPercentChange(todayData.totalSales),
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Total Profit Today",
      value: todayData.totalProfit,
      description: "Net profit after expenses",
      percentChange: getPercentChange(todayData.totalProfit),
      icon: TrendingUp,
      trend: "up"
    },
    {
      title: "Returns Count",
      value: todayData.returnsCount,
      description: "Total items returned today",
      percentChange: getPercentChange(todayData.returnsCount),
      icon: RefreshCw,
      trend: "down"
    },
    {
      title: "Expenses Today",
      value: todayData.expenses,
      description: "Total purchases and expenses",
      percentChange: getPercentChange(todayData.expenses),
      icon: Package,
      trend: "up"
    }
  ];
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => (
        <Card key={index} className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className="rounded-full p-2 bg-muted">
              <card.icon className="h-4 w-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {typeof card.value === 'number' && card.value > 100 
                ? formatCurrency(card.value)
                : card.value}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
            <div className="mt-2 flex items-center text-xs">
              <div className={`flex items-center ${card.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                <ArrowUpRight className={`h-3 w-3 ${card.trend === 'down' ? 'rotate-180' : ''}`} />
                <span className="ml-1">
                  {Math.abs(card.percentChange)}% from yesterday
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
