
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BatchTable from './BatchTable';
import BatchForm from './BatchForm';
import ExpiryDashboard from './ExpiryDashboard';
import ExpiryAlertSettings from './ExpiryAlertSettings';

interface ExpirationManagementProps {
  productId?: string;
}

const ExpirationManagement: React.FC<ExpirationManagementProps> = ({ productId }) => {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [refresh, setRefresh] = useState<boolean>(false);

  const handleBatchAdded = () => {
    setRefresh(!refresh);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gestion des dates d'expiration</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="batches">Lots et expiration</TabsTrigger>
            <TabsTrigger value="add">Ajouter un lot</TabsTrigger>
            <TabsTrigger value="settings">Paramètres d'alerte</TabsTrigger>
          </TabsList>
          
          <TabsContent value="dashboard">
            <ExpiryDashboard refresh={refresh} />
          </TabsContent>
          
          <TabsContent value="batches">
            <BatchTable refresh={refresh} />
          </TabsContent>
          
          <TabsContent value="add">
            <BatchForm onBatchAdded={handleBatchAdded} productId={productId} />
          </TabsContent>
          
          <TabsContent value="settings">
            <ExpiryAlertSettings />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpirationManagement;
