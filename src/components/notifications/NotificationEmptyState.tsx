import React from "react";
import { BellOff, Bell, AlertCircle } from "lucide-react";

interface NotificationEmptyStateProps {
  isUnreadTab: boolean;
  filterName?: string;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({ 
  isUnreadTab,
  filterName
}) => {
  // If filtering by type, show a specific message
  if (filterName && filterName !== "all") {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <AlertCircle className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
        <p>Aucune notification de type <span className="font-medium">{filterName}</span> trouvée</p>
        <p className="text-sm mt-1">Essayez un autre filtre ou revenez plus tard</p>
      </div>
    );
  }

  // Otherwise, show the default empty state
  return (
    <div className="p-6 text-center text-muted-foreground">
      {isUnreadTab ? (
        <>
          <Bell className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
          <p>Aucune notification non lue</p>
          <p className="text-sm mt-1">Vous êtes à jour !</p>
        </>
      ) : (
        <>
          <BellOff className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
          <p>Aucune notification trouvée</p>
          <p className="text-sm mt-1">Les notifications apparaîtront ici</p>
        </>
      )}
    </div>
  );
};

export default NotificationEmptyState;
