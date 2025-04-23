
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientProfileView } from '@/components/clients/ClientProfileView';
import { useClientProfile } from '@/hooks/useClientProfile';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { ClientLoadingSkeleton } from '@/components/clients/ClientLoadingSkeleton';

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { 
    client, 
    isLoading, 
    error,
    transactions,
    areTransactionsLoading 
  } = useClientProfile(clientId);

  useEffect(() => {
    if (error) {
      console.error('Error loading client profile:', error);
    }
  }, [error]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux clients
        </Button>
      </div>
      
      {isLoading ? (
        <ClientLoadingSkeleton type="profile" />
      ) : error || !client ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h2 className="text-2xl font-semibold mb-2">Client non trouvé</h2>
          <p className="text-muted-foreground mb-6">
            {error ? `Erreur: ${error}` : "Le client que vous recherchez n'existe pas ou a été supprimé."}
          </p>
          <Button onClick={() => navigate('/clients')}>
            Voir tous les clients
          </Button>
        </div>
      ) : (
        <ClientProfileView 
          client={client}
          transactions={transactions || []}
          areTransactionsLoading={areTransactionsLoading}
        />
      )}
    </div>
  );
};

export default ClientProfile;
