
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

type NotificationType = "inventory" | "shift" | "approval" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  link?: string;
  read: boolean;
}

interface NotificationsPanelProps {
  onMarkAllAsRead?: () => void;
  onNotificationRead?: (id: string) => void;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "inventory",
    message: "Alerte stock bas: iPhone 15 Pro (5 restants)",
    timestamp: "2023-12-20T09:30:00",
    link: "/inventory",
    read: false
  },
  {
    id: "n2",
    type: "shift",
    message: "Session #45 démarrée par le caissier John Doe",
    timestamp: "2023-12-20T08:00:00",
    link: "/register-sessions",
    read: false
  },
  {
    id: "n3",
    type: "approval",
    message: "Approbation de changement de prix en attente pour MacBook Air M3",
    timestamp: "2023-12-19T16:45:00",
    link: "/inventory",
    read: false
  },
  {
    id: "n4",
    type: "system",
    message: "Mise à jour du système prévue pour minuit",
    timestamp: "2023-12-19T14:20:00",
    link: "/settings",
    read: true
  },
  {
    id: "n5",
    type: "inventory",
    message: "Transfert de stock #ST-001 terminé",
    timestamp: "2023-12-18T11:15:00",
    link: "/stock-transfers",
    read: true
  },
  {
    id: "n6",
    type: "shift",
    message: "Session #44 terminée avec 212,50 $ d'écart",
    timestamp: "2023-12-18T10:00:00",
    link: "/register-sessions",
    read: true
  },
  {
    id: "n7",
    type: "system",
    message: "Synchronisation hors ligne terminée - 124 enregistrements mis à jour",
    timestamp: "2023-12-17T09:30:00",
    read: true
  }
];

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ 
  onMarkAllAsRead, 
  onNotificationRead 
}) => {
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  const [notificationSettings, setNotificationSettings] = useState({
    inventory: true,
    shift: true,
    approval: true,
    system: true,
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
          <NotificationFilters filter={filter} setFilter={setFilter} />
          
          <CardContent className="p-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={handleMarkAsRead} 
            />
          </CardContent>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <CardContent className="p-0">
            <NotificationList 
              notifications={getFilteredNotifications()} 
              onMarkAsRead={handleMarkAsRead}
              isUnreadTab
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
