
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, Tooltip, Legend } from "recharts";

export const TopSellingProductsChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { name: "iPhone 14", quantity: 32, revenue: 42560 },
    { name: "Samsung S23", quantity: 28, revenue: 30800 },
    { name: "AirPods Pro", quantity: 24, revenue: 5760 },
    { name: "iPad Air", quantity: 19, revenue: 11400 },
    { name: "MacBook Pro", quantity: 15, revenue: 30000 }
  ];
  
  const config: ChartConfig = {
    quantity: { color: "#8B5CF6" },
    revenue: { color: "#10B981" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis yAxisId="left" orientation="left" stroke="var(--color-quantity)" />
          <YAxis yAxisId="right" orientation="right" stroke="var(--color-revenue)" />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{payload[0].payload.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-quantity]" />
                        <span>Quantity Sold:</span>
                        <span className="font-bold">{payload[0].value}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-revenue]" />
                        <span>Revenue:</span>
                        <span className="font-bold">${payload[1].value}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Bar yAxisId="left" dataKey="quantity" name="Quantity" fill="var(--color-quantity)" barSize={30} radius={[4, 4, 0, 0]} />
          <Bar yAxisId="right" dataKey="revenue" name="Revenue ($)" fill="var(--color-revenue)" barSize={30} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
