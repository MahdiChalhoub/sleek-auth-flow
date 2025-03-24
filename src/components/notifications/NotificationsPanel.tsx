
import React, { useState } from "react";
import { Calendar, CheckCircle, Clock, Package, AlertCircle, Filter } from "lucide-react";
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
import { toast } from "@/components/ui/use-toast";

type NotificationType = "inventory" | "shift" | "approval" | "system";

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  link?: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  {
    id: "n1",
    type: "inventory",
    message: "Low stock alert: iPhone 15 Pro (5 remaining)",
    timestamp: "2023-12-20T09:30:00",
    link: "/inventory",
    read: false
  },
  {
    id: "n2",
    type: "shift",
    message: "Shift #45 started by Cashier John Doe",
    timestamp: "2023-12-20T08:00:00",
    link: "/register-sessions",
    read: false
  },
  {
    id: "n3",
    type: "approval",
    message: "Price change approval pending for MacBook Air M3",
    timestamp: "2023-12-19T16:45:00",
    link: "/inventory",
    read: false
  },
  {
    id: "n4",
    type: "system",
    message: "System update scheduled for midnight",
    timestamp: "2023-12-19T14:20:00",
    link: "/settings",
    read: true
  },
  {
    id: "n5",
    type: "inventory",
    message: "Stock transfer #ST-001 completed",
    timestamp: "2023-12-18T11:15:00",
    link: "/stock-transfers",
    read: true
  },
  {
    id: "n6",
    type: "shift",
    message: "Shift #44 ended with $212.50 discrepancy",
    timestamp: "2023-12-18T10:00:00",
    link: "/register-sessions",
    read: true
  },
  {
    id: "n7",
    type: "system",
    message: "Offline sync completed - 124 records updated",
    timestamp: "2023-12-17T09:30:00",
    read: true
  }
];

const NotificationsPanel: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [activeTab, setActiveTab] = useState("all");
  const [filter, setFilter] = useState<NotificationType | "all">("all");
  
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    toast({
      title: "Notifications marked as read",
      description: `${unreadCount} notifications marked as read`,
    });
  };
  
  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
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
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Inventory</Badge>;
      case "shift":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Shift</Badge>;
      case "approval":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Approval</Badge>;
      case "system":
        return <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">System</Badge>;
    }
  };
  
  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  
  return (
    <Card className="w-[400px] max-w-[calc(100vw-32px)]">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle>Notifications</CardTitle>
          <Button variant="ghost" size="sm" onClick={handleMarkAllAsRead} disabled={unreadCount === 0}>
            Mark all as read
          </Button>
        </div>
        <CardDescription>You have {unreadCount} unread notifications</CardDescription>
      </CardHeader>
      
      <div className="px-6 pb-2">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread ({unreadCount})</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <div className="px-6 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm text-muted-foreground">Filter by:</span>
        </div>
        <div className="flex gap-1">
          <Button 
            size="sm" 
            variant={filter === "all" ? "default" : "outline"} 
            className="h-7 px-2 text-xs"
            onClick={() => setFilter("all")}
          >
            All
          </Button>
          <Button 
            size="sm" 
            variant={filter === "inventory" ? "default" : "outline"} 
            className="h-7 px-2 text-xs"
            onClick={() => setFilter("inventory")}
          >
            Inventory
          </Button>
          <Button 
            size="sm" 
            variant={filter === "shift" ? "default" : "outline"} 
            className="h-7 px-2 text-xs"
            onClick={() => setFilter("shift")}
          >
            Shift
          </Button>
          <Button 
            size="sm" 
            variant={filter === "approval" ? "default" : "outline"} 
            className="h-7 px-2 text-xs"
            onClick={() => setFilter("approval")}
          >
            Approval
          </Button>
          <Button 
            size="sm" 
            variant={filter === "system" ? "default" : "outline"} 
            className="h-7 px-2 text-xs"
            onClick={() => setFilter("system")}
          >
            System
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
                            <Badge className="ml-2 bg-blue-500" variant="default">New</Badge>
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
                          View details
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
              No notifications found
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default NotificationsPanel;
