
import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import NotificationItem from "./NotificationItem";
import NotificationEmptyState from "./NotificationEmptyState";
import { Notification } from "@/models/notification";

interface NotificationListProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  isUnreadTab?: boolean;
  filterName?: string;
}

const NotificationList: React.FC<NotificationListProps> = ({ 
  notifications, 
  onMarkAsRead,
  isUnreadTab = false,
  filterName
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
        <NotificationEmptyState isUnreadTab={isUnreadTab} filterName={filterName} />
      )}
    </ScrollArea>
  );
};

export default NotificationList;
