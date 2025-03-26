
// Notification types for the system

export type NotificationPriority = "low" | "medium" | "high";
export type NotificationStatus = "unread" | "read" | "archived";

export interface Notification {
  id: string;
  type: "inventory" | "shift" | "approval" | "system" | "client" | "supplier" | "transaction"; 
  title: string;
  message: string;
  timestamp: string;
  link?: string;
  read: boolean;
  priority?: NotificationPriority;
  status?: NotificationStatus;
  relatedId?: string;
  relatedType?: string;
}

// Helper function to create a new notification
export function createNotification(
  type: Notification["type"],
  title: string,
  message: string,
  priority: NotificationPriority = "medium",
  link?: string,
  relatedId?: string,
  relatedType?: string
): Notification {
  return {
    id: `not-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    type,
    title,
    message,
    timestamp: new Date().toISOString(),
    link,
    read: false,
    priority,
    status: "unread",
    relatedId,
    relatedType
  };
}

// Mock notifications for development
export const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "inventory",
    title: "Stock bas",
    message: "Le niveau de stock pour 'iPhone 13' est sous le seuil minimum (5 restants).",
    timestamp: "2025-03-10T09:30:00Z",
    link: "/inventory",
    read: false,
    priority: "high"
  },
  {
    id: "2",
    type: "shift",
    title: "Session de caisse terminée",
    message: "La session de caisse du matin a été clôturée avec succès.",
    timestamp: "2025-03-10T14:45:00Z",
    read: true,
    priority: "low"
  },
  {
    id: "3",
    type: "approval",
    title: "Approbation requise",
    message: "Une remise de 30% requiert votre approbation pour la transaction #TR-2023.",
    timestamp: "2025-03-10T11:20:00Z",
    link: "/transactions",
    read: false,
    priority: "medium"
  },
  {
    id: "4",
    type: "system",
    title: "Mise à jour système",
    message: "Le système sera mis à jour ce soir à 23h00. Veuillez sauvegarder vos données.",
    timestamp: "2025-03-09T16:00:00Z",
    read: false,
    priority: "high"
  },
  {
    id: "5",
    type: "client",
    title: "Nouveau client VIP",
    message: "Jean Dupont a atteint le statut VIP avec 2000 points de fidélité.",
    timestamp: "2025-03-08T10:15:00Z",
    link: "/clients",
    read: true,
    priority: "medium",
    relatedId: "1",
    relatedType: "client"
  },
  {
    id: "6",
    type: "supplier",
    title: "Livraison en retard",
    message: "La livraison de Apple Inc. prévue pour aujourd'hui est retardée.",
    timestamp: "2025-03-10T08:30:00Z",
    link: "/suppliers",
    read: false,
    priority: "high",
    relatedId: "SUP-001",
    relatedType: "supplier"
  },
  {
    id: "7",
    type: "transaction",
    title: "Écart de caisse détecté",
    message: "Un écart de 50€ a été détecté dans la caisse. Vérification requise.",
    timestamp: "2025-03-09T17:45:00Z",
    link: "/register-sessions",
    read: false,
    priority: "high"
  }
];
