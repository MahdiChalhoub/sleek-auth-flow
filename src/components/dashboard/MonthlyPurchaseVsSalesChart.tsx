
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const MonthlyPurchaseVsSalesChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { month: "Jan", purchases: 2800, sales: 4000 },
    { month: "Feb", purchases: 2200, sales: 3000 },
    { month: "Mar", purchases: 3500, sales: 5000 },
    { month: "Apr", purchases: 3100, sales: 4500 },
    { month: "May", purchases: 4200, sales: 6000 },
    { month: "Jun", purchases: 4800, sales: 7000 }
  ];
  
  const config: ChartConfig = {
    purchases: { color: "#F43F5E" },
    sales: { color: "#10B981" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `$${value/1000}k`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <ChartTooltipContent>
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{payload[0].payload.month}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[--color-purchases]" />
                          <span>Purchases:</span>
                          <span className="font-bold">{formatCurrency(Number(payload[0].value))}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-2 rounded-full bg-[--color-sales]" />
                          <span>Sales:</span>
                          <span className="font-bold">{formatCurrency(Number(payload[1].value))}</span>
                        </div>
                        <div className="flex items-center gap-2 pt-1 border-t border-border">
                          <span>Margin:</span>
                          <span className="font-bold">{formatCurrency(Number(payload[1].value) - Number(payload[0].value))}</span>
                        </div>
                      </div>
                    </ChartTooltipContent>
                  );
                }
                return null;
              }}
            />
            <Legend />
            <Bar 
              dataKey="purchases" 
              name="Purchases" 
              fill="var(--color-purchases)" 
              barSize={30} 
              radius={[4, 4, 0, 0]}
              animationDuration={1000}
            />
            <Bar 
              dataKey="sales" 
              name="Sales" 
              fill="var(--color-sales)" 
              barSize={30} 
              radius={[4, 4, 0, 0]} 
              animationDuration={1000}
              animationBegin={300}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  );
};
