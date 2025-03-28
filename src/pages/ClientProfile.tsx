
import React from 'react';
import { useParams } from 'react-router-dom';
import { ClientProfileView } from '@/components/clients/ClientProfileView';
import { useClientProfile } from '@/hooks/useClientProfile';

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const { 
    client, 
    isLoading, 
    error,
    transactions,
    areTransactionsLoading
  } = useClientProfile(clientId);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col gap-4">
          <div className="h-32 w-full animate-pulse bg-muted rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-64 animate-pulse bg-muted rounded-lg"></div>
            <div className="h-64 animate-pulse bg-muted rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !client) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Client Not Found</h2>
          <p className="text-muted-foreground mb-6">
            {error ? `Error: ${error}` : "The client you're looking for doesn't exist or has been removed."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <ClientProfileView 
      client={client}
      transactions={transactions || []}
      areTransactionsLoading={areTransactionsLoading}
    />
  );
};

export default ClientProfile;
