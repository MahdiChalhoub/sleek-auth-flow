
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';
import { ProductBatch } from '@/models/product';

// Mock data for demo purposes
const mockBatches: ProductBatch[] = [
  {
    id: "1",
    productId: "1",
    batchNumber: "B2023-001",
    quantity: 20,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    productId: "2",
    batchNumber: "B2023-002",
    quantity: 15,
    expiryDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: "3",
    productId: "3",
    batchNumber: "B2023-003",
    quantity: 30,
    expiryDate: new Date(new Date().setDate(new Date().getDate() + 45)).toISOString(),
    createdAt: new Date().toISOString(),
  }
];

interface ExpiryDashboardProps {
  refresh?: boolean;
}

const ExpiryDashboard: React.FC<ExpiryDashboardProps> = ({ refresh }) => {
  const [expiringBatches, setExpiringBatches] = useState<ProductBatch[]>([]);
  const [expiredBatches, setExpiredBatches] = useState<ProductBatch[]>([]);
  const [goodBatches, setGoodBatches] = useState<ProductBatch[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from an API
    const now = new Date();
    
    const expired: ProductBatch[] = [];
    const expiringSoon: ProductBatch[] = [];
    const good: ProductBatch[] = [];
    
    mockBatches.forEach(batch => {
      try {
        const expiryDate = parseISO(batch.expiryDate);
        const daysUntilExpiry = differenceInDays(expiryDate, now);
        
        if (daysUntilExpiry < 0) {
          expired.push(batch);
        } else if (daysUntilExpiry <= 30) {
          expiringSoon.push(batch);
        } else {
          good.push(batch);
        }
      } catch (error) {
        console.error(`Error parsing date for batch ${batch.batchNumber}:`, error);
      }
    });
    
    setExpiredBatches(expired);
    setExpiringBatches(expiringSoon);
    setGoodBatches(good);
  }, [refresh]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-red-100 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lots expirés</p>
                <p className="text-2xl font-bold">{expiredBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lots expirant bientôt</p>
                <p className="text-2xl font-bold">{expiringBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lots en bon état</p>
                <p className="text-2xl font-bold">{goodBatches.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {expiredBatches.length > 0 && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention: Lots expirés</AlertTitle>
          <AlertDescription>
            Vous avez {expiredBatches.length} lot(s) expiré(s) qui nécessitent votre attention immédiate.
          </AlertDescription>
        </Alert>
      )}
      
      {expiringBatches.length > 0 && (
        <Alert variant="warning" className="bg-amber-50 text-amber-800 border-amber-200">
          <Clock className="h-4 w-4" />
          <AlertTitle>Lots expirant prochainement</AlertTitle>
          <AlertDescription>
            {expiringBatches.length} lot(s) vont expirer dans les 30 prochains jours.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ExpiryDashboard;
