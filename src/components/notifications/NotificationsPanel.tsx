
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import NotificationList from "./NotificationList";
import NotificationFilters from "./NotificationFilters";
import NotificationSettings from "./NotificationSettings";
import { Notification, mockNotifications } from "@/models/notification";

interface NotificationsPanelProps {
  onMarkAllAsRead?: () => void;
  onNotificationRead?: (id: string) => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  onMarkAllAsRead, 
  onNotificationRead 
}) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState<Notification["type"] | "all">("all");
  const [notificationSettings, setNotificationSettings] = useState({
    inventory: true,
    shift: true,
    approval: true,
    system: true,
    client: true,
    supplier: true,
    transaction: true,
    email: false,
    push: true,
    desktop: true
  });
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications marquées comme lues",
      description: `${unreadCount} notifications marquées comme lues`,
    });
    
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
    }
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    
    if (onNotificationRead) {
      onNotificationRead(id);
    }
  };
  
  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    if (activeTab === "unread") {
      filtered = filtered.filter(n => !n.read);
    }
    
    if (filter !== "all") {
      filtered = filtered.filter(n => n.type === filter);
    }
    
    return filtered;
  };
  
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <Card className="border-0 shadow-none">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Notifications</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
              Tout marquer comme lu
            </Button>
          </div>
          <CardDescription>Vous avez {unreadCount} notifications non lues</CardDescription>
        </CardHeader>
        
        <div className="px-6 pb-2">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">Toutes</TabsTrigger>
            <TabsTrigger value="unread">Non lues ({unreadCount})</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="mt-0">
          <NotificationFilters 
            filter={filter} 
            setFilter={setFilter} 
          />
          
          <CardContent className="p-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={handleMarkAsRead}
              filterName={filter !== "all" ? filter : undefined}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <CardContent className="p-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={handleMarkAsRead}
              isUnreadTab
              filterName={filter !== "all" ? filter : undefined}
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <CardContent className="p-6">
            <NotificationSettings 
              notificationSettings={notificationSettings}
              setNotificationSettings={setNotificationSettings}
            />
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default NotificationsPanel;
