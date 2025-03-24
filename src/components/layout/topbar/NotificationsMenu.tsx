
import React, { useRef } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationsPanel from "../../notifications/NotificationsPanel";

interface NotificationsMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  // Use a ref to prevent auto-closing behavior
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          ref={triggerRef}
          onClick={(e) => {
            // Prevent event propagation to avoid auto-closing
            e.stopPropagation();
          }}
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-auto" 
        align="end"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => {
          // Don't close when clicking the trigger button
          if (triggerRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
      >
        <NotificationsPanel />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
