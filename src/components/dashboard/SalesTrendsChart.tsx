
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const SalesTrendsChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { month: "Jan", sales: 4000 },
    { month: "Feb", sales: 3000 },
    { month: "Mar", sales: 5000 },
    { month: "Apr", sales: 4500 },
    { month: "May", sales: 6000 },
    { month: "Jun", sales: 7000 }
  ];
  
  const config: ChartConfig = {
    sales: { color: "#8B5CF6" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => `$${value}`}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-sales]" />
                        <span className="font-medium">{payload[0].payload.month}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Sales:</span>
                        <span className="font-bold">{formatCurrency(Number(payload[0].value))}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="sales"
            stroke="var(--color-sales)"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
