
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { format, addDays, isAfter, isBefore } from 'date-fns';
import { ProductBatch } from '@/models/product';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import BatchStatusBadge from './BatchStatusBadge';

interface ExpiryDashboardProps {
  refresh?: boolean;
}

const ExpiryDashboard: React.FC<ExpiryDashboardProps> = ({ refresh }) => {
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [activeTab, setActiveTab] = useState<string>("all");
  
  useEffect(() => {
    // In a real app, this would fetch from an API
    const mockBatches: ProductBatch[] = [
      {
        id: '1',
        productId: '1',
        batchNumber: 'BT-001-2023',
        quantity: 20,
        expiryDate: '2023-12-31',
        createdAt: '2023-06-15T10:00:00Z',
      },
      {
        id: '2',
        productId: '1',
        batchNumber: 'BT-002-2023',
        quantity: 15,
        expiryDate: format(addDays(new Date(), 20), 'yyyy-MM-dd'),
        createdAt: '2023-06-20T10:00:00Z',
      },
      {
        id: '3',
        productId: '2',
        batchNumber: 'BT-003-2023',
        quantity: 8,
        expiryDate: format(addDays(new Date(), -5), 'yyyy-MM-dd'),
        createdAt: '2023-07-01T10:00:00Z',
      },
      {
        id: '4',
        productId: '3',
        batchNumber: 'BT-004-2023',
        quantity: 12,
        expiryDate: format(addDays(new Date(), 5), 'yyyy-MM-dd'),
        createdAt: '2023-07-10T10:00:00Z',
      },
    ];
    
    setBatches(mockBatches);
  }, [refresh]);
  
  // Classification functions
  const isExpired = (expiryDate: string) => {
    return isBefore(new Date(expiryDate), new Date());
  };
  
  const isExpiringSoon = (expiryDate: string) => {
    const today = new Date();
    const thirtyDaysFromNow = addDays(today, 30);
    const expiry = new Date(expiryDate);
    
    return !isBefore(expiry, today) && !isAfter(expiry, thirtyDaysFromNow);
  };
  
  // Filter batches based on tab
  const filteredBatches = batches.filter(batch => {
    switch (activeTab) {
      case "expired":
        return isExpired(batch.expiryDate);
      case "expiring":
        return isExpiringSoon(batch.expiryDate);
      case "valid":
        return !isExpired(batch.expiryDate) && !isExpiringSoon(batch.expiryDate);
      default:
        return true;
    }
  });
  
  // Counts
  const expiredCount = batches.filter(batch => isExpired(batch.expiryDate)).length;
  const expiringSoonCount = batches.filter(batch => isExpiringSoon(batch.expiryDate)).length;
  const validCount = batches.filter(batch => !isExpired(batch.expiryDate) && !isExpiringSoon(batch.expiryDate)).length;
  
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produits expirés</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expiredCount}</div>
              <Badge variant="destructive" className="ml-auto">{expiredCount > 0 ? "Action requise" : "Aucun"}</Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expirant bientôt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{expiringSoonCount}</div>
              <Badge 
                variant={expiringSoonCount > 0 ? "outline" : "default"}
                className={expiringSoonCount > 0 ? "ml-auto text-amber-500 border-amber-500" : "ml-auto"}
              >
                {expiringSoonCount > 0 ? "Attention" : "Aucun"}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Produits valides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{validCount}</div>
              <Badge variant="default" className="ml-auto bg-green-500 hover:bg-green-600">{validCount > 0 ? "En stock" : "Aucun"}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">Tous</TabsTrigger>
          <TabsTrigger value="expired">Expirés</TabsTrigger>
          <TabsTrigger value="expiring">Bientôt expirés</TabsTrigger>
          <TabsTrigger value="valid">Valides</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          {batches.length === 0 ? (
            <Card>
              <CardContent className="py-6">
                <div className="text-center text-muted-foreground">
                  Aucun lot trouvé
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredBatches.map(batch => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expired" className="space-y-4">
          {filteredBatches.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Aucun produit expiré</AlertTitle>
              <AlertDescription>
                Tous vos produits sont à jour. Aucune action n'est requise.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Action requise</AlertTitle>
                <AlertDescription>
                  {filteredBatches.length} produit(s) expiré(s). Veuillez les retirer de la vente immédiatement.
                </AlertDescription>
              </Alert>
              {filteredBatches.map(batch => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="expiring" className="space-y-4">
          {filteredBatches.length === 0 ? (
            <Alert>
              <CheckCircle2 className="h-4 w-4" />
              <AlertTitle>Aucun produit expirant bientôt</AlertTitle>
              <AlertDescription>
                Aucun produit n'expirera dans les 30 prochains jours.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              <Alert>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  {filteredBatches.length} produit(s) expirera(ont) dans les 30 prochains jours.
                </AlertDescription>
              </Alert>
              {filteredBatches.map(batch => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="valid" className="space-y-4">
          {filteredBatches.length === 0 ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Aucun produit valide</AlertTitle>
              <AlertDescription>
                Tous vos produits sont expirés ou expirent bientôt.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-4">
              {filteredBatches.map(batch => (
                <BatchCard key={batch.id} batch={batch} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BatchCardProps {
  batch: ProductBatch;
}

const BatchCard: React.FC<BatchCardProps> = ({ batch }) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{batch.batchNumber}</h3>
            <p className="text-sm text-muted-foreground">
              Quantité: {batch.quantity}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm">Expire le: {format(new Date(batch.expiryDate), 'dd/MM/yyyy')}</p>
            <BatchStatusBadge expiryDate={batch.expiryDate} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpiryDashboard;
