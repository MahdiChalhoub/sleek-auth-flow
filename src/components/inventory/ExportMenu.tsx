
import React from "react";
import { Download, FileText, Printer, FileSpreadsheet, Share2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { toast } from "sonner";

interface ExportMenuProps {
  fullWidth?: boolean;
}

const ExportMenu: React.FC<ExportMenuProps> = ({ fullWidth = false }) => {
  const handleExport = (type: string) => {
    toast(`Exporting as ${type}...`);
    // Simulate export process
    setTimeout(() => {
      toast.success(`Successfully exported as ${type}`);
    }, 1500);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`gap-2 ${fullWidth ? 'w-full justify-start' : ''}`}
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("PDF")} className="cursor-pointer">
          <FileText className="h-4 w-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("Excel")} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("CSV")} className="cursor-pointer">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("Print")} className="cursor-pointer">
          <Printer className="h-4 w-4 mr-2" />
          Print Inventory
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("Email")} className="cursor-pointer">
          <Share2 className="h-4 w-4 mr-2" />
          Share via Email
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportMenu;
