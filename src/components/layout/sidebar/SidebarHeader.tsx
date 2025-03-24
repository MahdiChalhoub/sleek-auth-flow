
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarHeader as Header, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

const SidebarHeader: React.FC = () => {
  const { state, toggleSidebar } = useSidebar();
  
  return (
    <Header className="p-4">
      <div className="flex items-center justify-between">
        <div className={cn("flex items-center gap-2", state === "collapsed" && "justify-center")}>
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            POS
          </div>
          {state !== "collapsed" && (
            <div className="font-semibold">POS System</div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="hidden md:flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted"
        >
          {state === "collapsed" ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>
    </Header>
  );
};

export default SidebarHeader;
