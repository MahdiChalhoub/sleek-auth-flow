
import { v4 as uuidv4 } from 'uuid';

export type LoyaltyTier = "bronze" | "silver" | "gold" | "platinum";

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  isVip?: boolean;
  creditLimit?: number;
  outstandingBalance?: number;
  lastVisit?: string;
  notes?: string;
  loyaltyPoints?: number;
  pointsExpiry?: string;
  loyaltyTier?: LoyaltyTier;
  createdAt: string;
  updatedAt: string;
}

export interface ClientStats {
  totalSpent: number;
  visitCount: number;
  averageBasketSize: number;
  lastPurchaseDate?: string;
  favoriteProducts: {productId: string, productName: string, purchaseCount: number}[];
}

export interface ClientsFilterParams {
  search?: string;
  loyaltyTier?: LoyaltyTier;
  isVip?: boolean;
  minLoyaltyPoints?: number;
  lastVisitAfter?: string;
  lastVisitBefore?: string;
}

export function calculateLoyaltyTier(points: number): LoyaltyTier {
  if (points >= 2000) return "platinum";
  if (points >= 1000) return "gold";
  if (points >= 500) return "silver";
  return "bronze";
}

export function createClient(data: Partial<Client>): Client {
  const now = new Date().toISOString();
  const loyaltyPoints = data.loyaltyPoints || 0;
  
  return {
    id: data.id || uuidv4(),
    name: data.name || "",
    email: data.email,
    phone: data.phone,
    address: data.address,
    isVip: data.isVip || false,
    creditLimit: data.creditLimit,
    outstandingBalance: data.outstandingBalance || 0,
    lastVisit: data.lastVisit,
    notes: data.notes,
    loyaltyPoints,
    pointsExpiry: data.pointsExpiry || new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
    loyaltyTier: data.loyaltyTier || calculateLoyaltyTier(loyaltyPoints),
    createdAt: data.createdAt || now,
    updatedAt: data.updatedAt || now
  };
}
