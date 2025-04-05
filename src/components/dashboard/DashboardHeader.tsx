
import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { User } from "@/types/auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface DashboardHeaderProps {
  user: User | null;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  const getWelcomeMessage = () => {
    const hours = new Date().getHours();
    let greeting = "Good evening";
    
    if (hours < 12) {
      greeting = "Good morning";
    } else if (hours < 18) {
      greeting = "Good afternoon";
    }
    
    const userName = user?.fullName || user?.name || user?.email?.split('@')?.[0] || 'User';
    
    const roleSpecificMessage: Record<string, string> = {
      admin: "Here's an overview of your business performance.",
      manager: "Here's how your team is performing today.",
      cashier: "Here's your performance summary."
    };
    
    const role = user?.role || "user";
    const message = roleSpecificMessage[role] || "Welcome to your dashboard.";
    
    return `${greeting}, ${userName}! ${message}`;
  };

  // Get current date in nice format
  const getCurrentDate = () => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date().toLocaleDateString('en-US', options);
  };

  const handleExport = (format: "csv" | "excel" | "pdf") => {
    toast.success(`Exporting data as ${format.toUpperCase()}`);
    // Implementation for actual export would go here
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-2 mt-1">
          <p className="text-muted-foreground">{getWelcomeMessage()}</p>
          {user?.role && (
            <Badge variant="outline" className="ml-2">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{getCurrentDate()}</p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <FileText className="mr-2 h-4 w-4" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport("csv")}>
              <Download className="mr-2 h-4 w-4" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("excel")}>
              <Download className="mr-2 h-4 w-4" />
              Export as Excel
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport("pdf")}>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="default">
          Quick Actions
        </Button>
      </div>
    </div>
  );
};
