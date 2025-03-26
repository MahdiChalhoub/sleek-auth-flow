
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Package, Clock, CheckCircle, AlertCircle, Users, Truck, CreditCard } from "lucide-react";
import { Notification } from "@/models/notification";

interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  index: number;
  totalCount: number;
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  notification,
  onMarkAsRead,
  index,
  totalCount
}) => {
  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "inventory":
        return <Package className="h-5 w-5 text-blue-500" />;
      case "shift":
        return <Clock className="h-5 w-5 text-green-500" />;
      case "approval":
        return <CheckCircle className="h-5 w-5 text-amber-500" />;
      case "system":
        return <AlertCircle className="h-5 w-5 text-purple-500" />;
      case "client":
        return <Users className="h-5 w-5 text-indigo-500" />;
      case "supplier":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "transaction":
        return <CreditCard className="h-5 w-5 text-emerald-500" />;
    }
  };
  
  const getNotificationTypeBadge = (type: Notification["type"]) => {
    switch (type) {
      case "inventory":
        return <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Inventaire</Badge>;
      case "shift":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Session</Badge>;
      case "approval":
        return <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Approbation</Badge>;
      case "system":
        return <Badge className="bg-purple-500/20 text-purple-600 hover:bg-purple-500/30">Système</Badge>;
      case "client":
        return <Badge className="bg-indigo-500/20 text-indigo-600 hover:bg-indigo-500/30">Client</Badge>;
      case "supplier":
        return <Badge className="bg-orange-500/20 text-orange-600 hover:bg-orange-500/30">Fournisseur</Badge>;
      case "transaction":
        return <Badge className="bg-emerald-500/20 text-emerald-600 hover:bg-emerald-500/30">Transaction</Badge>;
    }
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <div key={notification.id}>
      <div 
        className={`px-6 py-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-950/10' : ''}`}
        onClick={() => onMarkAsRead(notification.id)}
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
            <p className="font-medium text-sm">{notification.title}</p>
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
      {index < totalCount - 1 && <Separator />}
    </div>
  );
};

export default NotificationItem;
