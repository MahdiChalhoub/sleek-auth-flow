
import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, Package, AlertCircle, Filter, BellOff, Bell } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

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
  
  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "inventory":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shift":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "approval":
        return <CheckCircle className="h-5 w-5 text-amber-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
    }
  };
  
  const getNotificationTypeBadge = (type: NotificationType) => {
    switch (type) {
      case "inventory":
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Inventaire</Badge>;
      case "shift":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Session</Badge>;
      case "approval":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Approbation</Badge>;
      case "system":
        return <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">Système</Badge>;
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const handleToggleNotificationType = (type: 'inventory' | 'shift' | 'approval' | 'system') => {
    setNotificationSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
    
    toast({
      title: prev => prev[type] ? "Notifications désactivées" : "Notifications activées",
      description: `Les notifications de type ${type} ont été ${prev[type] ? "désactivées" : "activées"}`,
    });
  };

  const handleToggleNotificationChannel = (channel: 'email' | 'push' | 'desktop') => {
    setNotificationSettings(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
    
    toast({
      title: prev => prev[channel] ? "Canal désactivé" : "Canal activé",
      description: `Les notifications par ${channel} ont été ${prev[channel] ? "désactivées" : "activées"}`,
    });
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
          <div className="px-6 pb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filtrer par:</span>
            </div>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant={filter === "all" ? "default" : "outline"} 
                className="h-7 px-2 text-xs"
                onClick={() => setFilter("all")}
              >
                Toutes
              </Button>
              <Button 
                size="sm" 
                variant={filter === "inventory" ? "default" : "outline"} 
                className="h-7 px-2 text-xs"
                onClick={() => setFilter("inventory")}
              >
                Inventaire
              </Button>
              <Button 
                size="sm" 
                variant={filter === "shift" ? "default" : "outline"} 
                className="h-7 px-2 text-xs"
                onClick={() => setFilter("shift")}
              >
                Sessions
              </Button>
              <Button 
                size="sm" 
                variant={filter === "approval" ? "default" : "outline"} 
                className="h-7 px-2 text-xs"
                onClick={() => setFilter("approval")}
              >
                Approbations
              </Button>
              <Button 
                size="sm" 
                variant={filter === "system" ? "default" : "outline"} 
                className="h-7 px-2 text-xs"
                onClick={() => setFilter("system")}
              >
                Système
              </Button>
            </div>
          </div>
          
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className={`px-6 py-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/10' : ''}`}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              {getNotificationTypeBadge(notification.type)}
                              {!notification.read && (
                                <Badge className="ml-2 bg-blue-500" variant="default">Nouveau</Badge>
                              )}
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          {notification.link && (
                            <a 
                              href={notification.link} 
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              Voir les détails
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < getFilteredNotifications().length - 1 && <Separator />}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <BellOff className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                  <p>Aucune notification trouvée</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="unread" className="mt-0">
          <CardContent className="p-0">
            <ScrollArea className="h-[400px]">
              {getFilteredNotifications().length > 0 ? (
                getFilteredNotifications().map((notification, index) => (
                  <div key={notification.id}>
                    <div 
                      className="px-6 py-4 bg-blue-50 dark:bg-blue-950/10"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-1">
                            <div>
                              {getNotificationTypeBadge(notification.type)}
                              <Badge className="ml-2 bg-blue-500" variant="default">Nouveau</Badge>
                            </div>
                            <span className="text-xs text-muted-foreground flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {formatDate(notification.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{notification.message}</p>
                          {notification.link && (
                            <a 
                              href={notification.link} 
                              className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                            >
                              Voir les détails
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                    {index < getFilteredNotifications().length - 1 && <Separator />}
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-muted-foreground">
                  <Bell className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
                  <p>Aucune notification non lue</p>
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </TabsContent>
        
        <TabsContent value="settings" className="mt-0">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Types de notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-blue-500" />
                      <span>Inventaire</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.inventory} 
                      onCheckedChange={() => handleToggleNotificationType('inventory')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Sessions</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.shift} 
                      onCheckedChange={() => handleToggleNotificationType('shift')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-amber-500" />
                      <span>Approbations</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.approval} 
                      onCheckedChange={() => handleToggleNotificationType('approval')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-purple-500" />
                      <span>Système</span>
                    </div>
                    <Switch 
                      checked={notificationSettings.system} 
                      onCheckedChange={() => handleToggleNotificationType('system')}
                    />
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Canaux de notifications</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span>Notifications par email</span>
                      <p className="text-xs text-muted-foreground">Recevez des notifications par email</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.email} 
                      onCheckedChange={() => handleToggleNotificationChannel('email')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span>Notifications push</span>
                      <p className="text-xs text-muted-foreground">Recevez des notifications push sur mobile</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.push} 
                      onCheckedChange={() => handleToggleNotificationChannel('push')}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <span>Notifications desktop</span>
                      <p className="text-xs text-muted-foreground">Recevez des notifications sur votre navigateur</p>
                    </div>
                    <Switch 
                      checked={notificationSettings.desktop} 
                      onCheckedChange={() => handleToggleNotificationChannel('desktop')}
                    />
                  </div>
                </div>
              </div>
              
              <div className="pt-2">
                <Button className="w-full">Enregistrer les préférences</Button>
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Card>
    </Tabs>
  );
};

export default NotificationsPanel;
