
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";

export const TopSellingProductsChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { name: "iPhone 14", quantity: 32 },
    { name: "Samsung S23", quantity: 28 },
    { name: "AirPods Pro", quantity: 24 },
    { name: "iPad Air", quantity: 19 },
    { name: "MacBook Pro", quantity: 15 }
  ];
  
  const config: ChartConfig = {
    quantity: { color: "#8B5CF6" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-quantity]" />
                        <span className="font-medium">{payload[0].payload.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Quantity Sold:</span>
                        <span className="font-bold">{payload[0].value}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="quantity" fill="var(--color-quantity)" barSize={30} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ChartContainer>
    </div>
  );
};
