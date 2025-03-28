
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useClientForm } from '@/hooks/useClientForm';
import { ClientForm } from '@/components/clients/ClientForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const ClientEditForm = () => {
  const { form, onSubmit, isLoading, isEditMode } = useClientForm();
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate('/clients');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" onClick={() => navigate('/clients')} className="mr-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Clients
        </Button>
        <h1 className="text-2xl font-bold">
          {isEditMode ? 'Edit Client' : 'Create New Client'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Edit Client Information' : 'New Client Information'}</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientForm 
            form={form} 
            onSubmit={onSubmit} 
            isLoading={isLoading} 
            onCancel={handleCancel}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientEditForm;
