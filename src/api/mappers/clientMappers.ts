
import { Client } from '@/models/client';
import { Client as ClientModel, createClient as createClientModel } from '@/models/clientModel';

// Map database client to ClientModel for POS and other components that need loyalty data
export const mapDbClientToModel = (dbClient: Client): ClientModel => {
  return createClientModel({
    id: dbClient.id,
    name: dbClient.name,
    email: dbClient.email,
    phone: dbClient.phone,
    address: dbClient.address,
    isVip: dbClient.type === 'vip',
    creditLimit: dbClient.type === 'credit' ? 3000 : undefined, // Default credit limit
    outstandingBalance: dbClient.financialAccount?.totalDue || 0,
    lastVisit: dbClient.updatedAt,
    loyaltyPoints: dbClient.financialAccount?.availableCredit || 0,
    createdAt: dbClient.createdAt,
    updatedAt: dbClient.updatedAt
  });
};
