import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProductBatch, mapDbProductBatchToModel } from "@/models/productBatch";
import { format, parseISO, addDays, isBefore, isAfter } from "date-fns";
import { supabase } from "@/lib/supabase";

// Extended interface that includes product name
interface BatchWithProductName extends ProductBatch {
  productName: string;
}

const ExpiryDashboard: React.FC = () => {
  const [batches, setBatches] = useState<BatchWithProductName[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAllBatches = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('product_batches')
          .select('*, products:product_id(name)')
          .order('expiry_date', { ascending: true });
          
        if (error) throw error;
        
        const formattedBatches = data.map((batch: any) => ({
          ...mapDbProductBatchToModel(batch),
          productName: batch.products?.name || 'Unknown Product'
        }));
        
        setBatches(formattedBatches);
      } catch (error) {
        console.error('Error fetching batches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllBatches();
  }, []);

  // Sort batches by expiry date
  const now = new Date();
  const in30Days = addDays(now, 30);
  const in60Days = addDays(now, 60);
  const in90Days = addDays(now, 90);

  // Filter batches based on expiry timeframes
  const expired = batches.filter(batch => 
    isBefore(parseISO(batch.expiryDate), now)
  );
  
  const expiringSoon = batches.filter(batch => 
    isAfter(parseISO(batch.expiryDate), now) && 
    isBefore(parseISO(batch.expiryDate), in30Days)
  );
  
  const expiringIn30To60Days = batches.filter(batch => 
    isAfter(parseISO(batch.expiryDate), in30Days) && 
    isBefore(parseISO(batch.expiryDate), in60Days)
  );
  
  const expiringIn60To90Days = batches.filter(batch => 
    isAfter(parseISO(batch.expiryDate), in60Days) && 
    isBefore(parseISO(batch.expiryDate), in90Days)
  );

  const renderBatchList = (batchList: BatchWithProductName[]) => {
    if (batchList.length === 0) {
      return (
        <div className="py-6 text-center text-muted-foreground">
          No products found in this timeframe.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {batchList.map(batch => (
          <div key={batch.id} className="rounded-lg border p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{batch.productName}</h3>
                <p className="text-sm text-muted-foreground">
                  Batch: {batch.batchNumber}
                </p>
              </div>
              <div className="text-right">
                <div className="font-medium">{format(parseISO(batch.expiryDate), 'PPP')}</div>
                <p className="text-sm text-muted-foreground">
                  Qty: {batch.quantity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expiration Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Expiration Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="expired">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="expired" className="relative">
              Expired
              {expired.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] text-white">
                  {expired.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="soon" className="relative">
              Within 30 Days
              {expiringSoon.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 text-[10px] text-white">
                  {expiringSoon.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="30-60">30-60 Days</TabsTrigger>
            <TabsTrigger value="60-90">60-90 Days</TabsTrigger>
          </TabsList>
          
          <TabsContent value="expired" className="pt-4">
            {renderBatchList(expired)}
          </TabsContent>
          
          <TabsContent value="soon" className="pt-4">
            {renderBatchList(expiringSoon)}
          </TabsContent>
          
          <TabsContent value="30-60" className="pt-4">
            {renderBatchList(expiringIn30To60Days)}
          </TabsContent>
          
          <TabsContent value="60-90" className="pt-4">
            {renderBatchList(expiringIn60To90Days)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpiryDashboard;
