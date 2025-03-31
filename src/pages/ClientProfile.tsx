
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientProfileView } from '@/components/clients/ClientProfileView';
import { useClientProfile } from '@/hooks/useClientProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { 
    client, 
    isLoading, 
    error,
    transactions,
    areTransactionsLoading,
    refetch 
  } = useClientProfile(clientId);

  // Add a retry mechanism if loading fails
  useEffect(() => {
    let retryCount = 0;
    const retryTimeout = setTimeout(() => {
      if (isLoading && retryCount < 3 && refetch) {
        console.log(`Retrying client profile fetch (${retryCount + 1}/3)...`);
        refetch();
        retryCount++;
      }
    }, 3000);

    return () => clearTimeout(retryTimeout);
  }, [isLoading, refetch]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux clients
          </Button>
          <h1 className="text-2xl font-bold">Profil du client</h1>
        </div>
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
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour aux clients
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Client non trouvé</h2>
          <p className="text-muted-foreground mb-6">
            {error ? `Erreur: ${error}` : "Le client que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          <Button onClick={() => navigate('/clients')}>
            Voir tous les clients
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Button>
      </div>
      <ClientProfileView 
        client={client}
        transactions={transactions || []}
        areTransactionsLoading={areTransactionsLoading}
      />
    </div>
  );
};

export default ClientProfile;
