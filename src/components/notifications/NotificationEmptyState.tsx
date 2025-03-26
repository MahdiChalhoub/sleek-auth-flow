
import React from "react";
import { BellOff, Bell } from "lucide-react";

interface NotificationEmptyStateProps {
  isUnreadTab: boolean;
}

const NotificationEmptyState: React.FC<NotificationEmptyStateProps> = ({ isUnreadTab }) => {
  return (
    <div className="p-6 text-center text-muted-foreground">
      {isUnreadTab ? (
        <>
          <Bell className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
          <p>Aucune notification non lue</p>
        </>
      ) : (
        <>
          <BellOff className="mx-auto h-8 w-8 mb-2 text-muted-foreground/50" />
          <p>Aucune notification trouvée</p>
        </>
      )}
    </div>
  );
};

export default NotificationEmptyState;
