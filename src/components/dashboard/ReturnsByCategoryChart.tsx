
import React from "react";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

export const ReturnsByCategoryChart: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const data = [
    { name: "Electronics", value: 12 },
    { name: "Clothing", value: 8 },
    { name: "Appliances", value: 5 },
    { name: "Furniture", value: 3 },
    { name: "Other", value: 2 }
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
        <PieChart margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
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
                        <span>Returns:</span>
                        <span className="font-bold">{payload[0].value}</span>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
