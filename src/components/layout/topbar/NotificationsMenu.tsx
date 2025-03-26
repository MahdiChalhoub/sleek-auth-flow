
import React, { useRef, useCallback, useState, useEffect } from "react";
import { Bell, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NotificationsPanel from "../../notifications/NotificationsPanel";
import { useToast } from "@/hooks/use-toast";

interface NotificationsMenuProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock unread notifications count for demonstration
const mockUnreadCount = 3;

// Mock new notification that will appear after some time
const mockNewNotification = {
  id: "new-notification",
  type: "inventory",
  message: "Nouvel arrivage de produits disponible",
  timestamp: new Date().toISOString(),
};

const NotificationsMenu: React.FC<NotificationsMenuProps> = ({ 
  isOpen, 
  onOpenChange 
}) => {
  const { toast } = useToast();
  const [unreadCount, setUnreadCount] = useState(mockUnreadCount);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  // Use a ref to prevent auto-closing behavior
  const triggerRef = useRef<HTMLButtonElement>(null);
  
  // Handler to toggle menu state
  const handleButtonClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent event propagation to avoid auto-closing
    e.stopPropagation();
    // Toggle the menu state manually, but don't allow it to close immediately
    onOpenChange(!isOpen);
    // Reset animation and new notification flag when opening
    if (!isOpen) {
      setIsAnimating(false);
      setHasNewNotification(false);
    }
  }, [isOpen, onOpenChange]);

  // Simulate receiving new notifications
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!isOpen) {
        setHasNewNotification(true);
        setIsAnimating(true);
        
        // Show toast for new notification
        toast({
          title: "Nouvelle notification",
          description: mockNewNotification.message,
        });
        
        // Increase unread count
        setUnreadCount(prev => prev + 1);
        
        // Stop animation after a while
        const animationTimer = setTimeout(() => {
          setIsAnimating(false);
        }, 3000);
        
        return () => clearTimeout(animationTimer);
      }
    }, 15000); // Show new notification after 15 seconds
    
    return () => clearTimeout(timer);
  }, [isOpen, toast]);
  
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className={`relative ${hasNewNotification ? 'animate-pulse' : ''}`}
          ref={triggerRef}
          onClick={handleButtonClick}
          aria-expanded={isOpen}
          aria-label="Notifications"
        >
          <Bell className={`h-5 w-5 ${isAnimating ? 'animate-ping' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 w-80 max-h-[450px] overflow-auto" 
        align="end"
        onClick={(e) => e.stopPropagation()}
        onPointerDownOutside={(e) => {
          // Don't close when clicking the trigger button
          if (triggerRef.current?.contains(e.target as Node)) {
            e.preventDefault();
          }
        }}
        avoidCollisions={true}
        side="bottom"
        sideOffset={10}
      >
        <NotificationsPanel 
          onMarkAllAsRead={() => setUnreadCount(0)}
          onNotificationRead={() => {
            if (unreadCount > 0) {
              setUnreadCount(prev => prev - 1);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};

export default NotificationsMenu;
