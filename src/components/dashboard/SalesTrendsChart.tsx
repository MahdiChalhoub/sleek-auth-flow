
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const SalesTrendsChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { month: "Jan", sales: 4000, profit: 1200 },
    { month: "Feb", sales: 3000, profit: 900 },
    { month: "Mar", sales: 5000, profit: 1500 },
    { month: "Apr", sales: 4500, profit: 1350 },
    { month: "May", sales: 6000, profit: 1800 },
    { month: "Jun", sales: 7000, profit: 2100 }
  ];
  
  const config: ChartConfig = {
    sales: { color: "#8B5CF6" },
    profit: { color: "#10B981" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            yAxisId="left"
            orientation="left"
            tickFormatter={(value) => `$${value}`}
            stroke="var(--color-sales)"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            tickFormatter={(value) => `$${value}`}
            stroke="var(--color-profit)"
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
                        <div className="h-2 w-2 rounded-full bg-[--color-sales]" />
                        <span>Sales:</span>
                        <span className="font-bold">{formatCurrency(Number(payload[0].value))}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-profit]" />
                        <span>Profit:</span>
                        <span className="font-bold">{formatCurrency(Number(payload[1].value))}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Legend />
          <Line
            type="monotone"
            yAxisId="left"
            dataKey="sales"
            name="Sales"
            stroke="var(--color-sales)"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            yAxisId="right"
            dataKey="profit"
            name="Profit"
            stroke="var(--color-profit)"
            activeDot={{ r: 8 }}
            strokeWidth={2}
            dot={{ strokeWidth: 2 }}
          />
        </LineChart>
      </ChartContainer>
    </div>
  );
};
