
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";

type NotificationType = "inventory" | "shift" | "approval" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  link?: string;
  read: boolean;
}

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isUnreadTab?: boolean;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  isUnreadTab = false
}) => {
  return (
    <ScrollArea className="h-[400px]">
      {notifications.length > 0 ? (
        notifications.map((notification, index) => (
          <NotificationItem 
            key={notification.id} 
            notification={notification} 
            onMarkAsRead={onMarkAsRead}
            index={index}
            totalCount={notifications.length}
          />
        ))
      ) : (
        <NotificationEmptyState isUnreadTab={isUnreadTab} />
      )}
    </ScrollArea>
  );
};

export default NotificationList;
