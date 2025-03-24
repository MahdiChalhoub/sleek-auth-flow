
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

export const CategorySalesDistributionChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { name: "Electronics", value: 42560 },
    { name: "Clothing", value: 18750 },
    { name: "Appliances", value: 15200 },
    { name: "Furniture", value: 9800 },
    { name: "Food & Beverages", value: 7500 }
  ];
  
  const COLORS = ["#8B5CF6", "#D946EF", "#F97316", "#0EA5E9", "#10B981"];
  
  const config: ChartConfig = {
    category: { 
      theme: {
        light: "#8B5CF6",
        dark: "#8B5CF6"
      }
    }
  };
  
  return (
    <div className="h-[300px] w-full">
      <ChartContainer config={config}>
        <PieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={100}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const total = data.reduce((sum, item) => sum + item.value, 0);
                const percentage = ((Number(payload[0].value) / total) * 100).toFixed(1);
                
                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-2 w-2 rounded-full" 
                          style={{ backgroundColor: COLORS[data.findIndex(item => item.name === payload[0].name) % COLORS.length] }}
                        />
                        <span className="font-medium">{payload[0].name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Sales:</span>
                        <span className="font-bold">{formatCurrency(Number(payload[0].value))}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Percentage:</span>
                        <span className="font-bold">{percentage}%</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
          <Legend formatter={(value, entry, index) => {
            const item = data[index];
            const total = data.reduce((sum, item) => sum + item.value, 0);
            const percentage = ((item.value / total) * 100).toFixed(1);
            return `${value} (${percentage}%)`;
          }} />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
