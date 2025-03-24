
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const ProfitLossChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { month: "Jan", profit: 1200, loss: -400 },
    { month: "Feb", profit: 1100, loss: -500 },
    { month: "Mar", profit: 1500, loss: -300 },
    { month: "Apr", profit: 900, loss: -600 },
    { month: "May", profit: 1700, loss: -400 },
    { month: "Jun", profit: 1400, loss: -200 }
  ];
  
  const config: ChartConfig = {
    profit: { color: "#10B981" },
    loss: { color: "#F43F5E" }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis
            tickFormatter={(value) => `$${Math.abs(value)}`}
          />
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{payload[0].payload.month}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-profit]" />
                        <span>Profit:</span>
                        <span className="font-bold">{formatCurrency(Number(payload[0].value))}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-[--color-loss]" />
                        <span>Loss:</span>
                        <span className="font-bold">{formatCurrency(Math.abs(Number(payload[1].value)))}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Area
            type="monotone"
            dataKey="profit"
            stroke="var(--color-profit)"
            fill="var(--color-profit)"
            fillOpacity={0.2}
          />
          <Area
            type="monotone"
            dataKey="loss"
            stroke="var(--color-loss)"
            fill="var(--color-loss)"
            fillOpacity={0.2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
