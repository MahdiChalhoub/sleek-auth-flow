
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ClientProfileView } from '@/components/clients/ClientProfileView';
import { useClientProfile } from '@/hooks/useClientProfile';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { clientsApi } from '@/api/clientsApi';
import { useToast } from '@/hooks/use-toast';

const ClientProfile = () => {
  const { clientId } = useParams<{ clientId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const { 
    client, 
    isLoading, 
    error,
    transactions,
    areTransactionsLoading,
    creditSales,
    areCreditSalesLoading,
    recordPayment
  } = useClientProfile(clientId);

  const handleDeleteClient = async () => {
    if (!clientId) return;
    
    try {
      await clientsApi.delete(clientId);
      toast({
        title: 'Client deleted',
        description: 'The client has been successfully deleted'
      });
      navigate('/clients');
    } catch (err) {
      console.error('Error deleting client:', err);
      toast({
        title: 'Error',
        description: 'Failed to delete client. Please try again.',
        variant: 'destructive'
      });
    }
  };

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
    <>
      <ClientProfileView 
        client={client}
        transactions={transactions || []}
        creditSales={creditSales || []}
        areTransactionsLoading={areTransactionsLoading}
        areCreditSalesLoading={areCreditSalesLoading}
        onRecordPayment={recordPayment}
        onDeleteClient={handleDeleteClient}
      />
      
      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the client and all associated data.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteClient}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ClientProfile;
