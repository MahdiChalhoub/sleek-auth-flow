
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { Notification } from "@/models/notification";

type NotificationType = Notification["type"];

interface NotificationFiltersProps {
  filter: NotificationType | "all";
  setFilter: React.Dispatch<React.SetStateAction<NotificationType | "all">>;
}

const NotificationFilters: React.FC<NotificationFiltersProps> = ({
  filter,
  setFilter
}) => {
  return (
    <div className="px-6 pb-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Filtrer par:</span>
      </div>
      <div className="flex gap-1 flex-wrap">
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
        <Button 
          size="sm" 
          variant={filter === "client" ? "default" : "outline"} 
          className="h-7 px-2 text-xs"
          onClick={() => setFilter("client")}
        >
          Clients
        </Button>
        <Button 
          size="sm" 
          variant={filter === "supplier" ? "default" : "outline"} 
          className="h-7 px-2 text-xs"
          onClick={() => setFilter("supplier")}
        >
          Fournisseurs
        </Button>
        <Button 
          size="sm" 
          variant={filter === "transaction" ? "default" : "outline"} 
          className="h-7 px-2 text-xs"
          onClick={() => setFilter("transaction")}
        >
          Transactions
        </Button>
      </div>
    </div>
  );
};

export default NotificationFilters;
