
import React from 'react';
import { Client } from '@/models/client';
import { ClientTransaction } from '@/models/clientTransaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClientInfoCard } from './ClientInfoCard';
import { ClientFinancialCard } from './ClientFinancialCard';
import { ClientTransactionsTable } from './ClientTransactionsTable';

interface ClientProfileViewProps {
  client: Client;
  transactions: ClientTransaction[];
  areTransactionsLoading: boolean;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  transactions,
  areTransactionsLoading
}) => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Client Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <ClientInfoCard client={client} />
        </div>
        <div>
          <ClientFinancialCard client={client} />
        </div>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All financial interactions with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                All invoices issued to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions.filter(t => t.type === 'invoice')} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                All payments received from this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions.filter(t => t.type === 'payment')} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Client-specific notes and remarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                {client.notes ? (
                  <p>{client.notes}</p>
                ) : (
                  <p className="text-muted-foreground">No notes available for this client.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
