
import React, { useState } from "react";
import {
  Bell,
  CheckCircle,
  Settings,
  X
} from "lucide-react";
import {
  Dialog,
  DialogContent
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import NotificationsPanel from "@/components/notifications/NotificationsPanel";
import { Notification, mockNotifications } from "@/models/notification";

const NotificationsMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const { toast } = useToast();

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Toutes les notifications marquées comme lues",
      description: `${unreadCount} notifications ont été marquées comme lues`,
    });
  };

  const handleNotificationRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon"
        className="relative"
        onClick={() => setOpen(true)}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <Badge 
            variant="destructive" 
            className="absolute -top-2 -right-1 h-5 w-5 flex items-center justify-center rounded-full p-0"
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-md p-0 sm:rounded-xl overflow-hidden max-h-[90vh] flex flex-col"
          closeIcon={<X className="h-4 w-4" />}
        >
          <div className="flex-1 overflow-auto">
            <NotificationsPanel 
              onMarkAllAsRead={handleMarkAllAsRead}
              onNotificationRead={handleNotificationRead}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NotificationsMenu;
