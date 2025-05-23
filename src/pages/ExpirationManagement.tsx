import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, AlertTriangle, Clock, Filter, ChevronDown } from 'lucide-react';
import { Product } from '@/models/product';
import { ProductBatch, createProductBatch } from '@/models/productBatch';
import { format, parseISO, differenceInDays, addDays } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import BatchForm from '@/components/inventory/expiration/BatchForm';
import BatchTable from '@/components/inventory/expiration/BatchTable';
import BatchStatusBadge from '@/components/inventory/expiration/BatchStatusBadge';
import { getBatchStatus } from '@/utils/expirationUtils';
import useProducts from '@/hooks/useProducts';
import { toast } from 'sonner';
import { safeArray } from '@/utils/supabaseUtils';
import { mapDbProductBatchToModel } from '@/models/productBatch';
import { callRPC } from '@/utils/rpcUtils';

const ExpirationManagement: React.FC = () => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const [batches, setBatches] = useState<ProductBatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [hideExpired, setHideExpired] = useState(false);
  
  useEffect(() => {
    const loadBatches = async () => {
      setIsLoading(true);
      try {
        const tableExists = await callRPC<boolean>('check_table_exists', { table_name: 'product_batches' });
        
        if (!tableExists) {
          console.log('product_batches table does not exist yet');
          setIsLoading(false);
          setBatches([]);
          return;
        }
        
        const batchesData = await callRPC<any[]>('get_all_product_batches', {});
        
        const fetchedBatches = safeArray(batchesData || [], mapDbProductBatchToModel);
        setBatches(fetchedBatches);
      } catch (error) {
        console.error('Error loading batches:', error);
        toast.error('Failed to load product batches');
      } finally {
        setIsLoading(false);
      }
    };

    loadBatches();
  }, []);
  
  const productsWithBatches = products.filter(product => 
    batches.some(batch => batch.product_id === product.id)
  );
  
  const filteredBatches = batches.filter(batch => {
    if (hideExpired && getBatchStatus(batch.expiry_date) === 'expired') {
      return false;
    }
    
    if (filterStatus !== 'all') {
      return getBatchStatus(batch.expiry_date) === filterStatus;
    }
    
    return true;
  });

  const filteredProducts = productsWithBatches.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         (product.barcode && product.barcode.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const hasMatchingBatches = filteredBatches.some(batch => batch.product_id === product.id);
    
    return matchesSearch && hasMatchingBatches;
  });

  const addBatch = async (batch: Omit<ProductBatch, "id">) => {
    try {
      const newBatch = await callRPC<ProductBatch>('insert_product_batch', {
        batch: {
          product_id: batch.product_id,
          batch_number: batch.batch_number,
          quantity: batch.quantity,
          expiry_date: batch.expiry_date,
          purchase_date: batch.purchase_date,
          cost_per_unit: batch.cost_per_unit,
          status: batch.status || 'active',
          created_at: batch.created_at,
          updated_at: batch.updated_at
        }
      });
      
      if (newBatch) {
        const addedBatch = mapDbProductBatchToModel(newBatch);
        setBatches(prev => [...prev, addedBatch]);
        toast.success('Batch added successfully');
      }
      
      setSelectedProduct(null); // Reset selected product after adding
    } catch (error) {
      console.error('Error adding batch:', error);
      toast.error('Failed to add batch');
    }
  };

  const deleteBatch = async (batchId: string) => {
    try {
      await callRPC<any>('delete_product_batch', { batch_id: batchId });
      
      setBatches(prev => prev.filter(batch => batch.id !== batchId));
      toast.success('Batch deleted successfully');
    } catch (error) {
      console.error('Error deleting batch:', error);
      toast.error('Failed to delete batch');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Dates d'Expiration</h1>
          <p className="text-muted-foreground mt-1">
            Suivez les dates d'expiration par lot pour chaque produit
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Produits avec lots</CardTitle>
              <CardDescription>Gérez les dates d'expiration par produit et par lot</CardDescription>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un produit..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex gap-2">
                        <Filter className="h-4 w-4" />
                        Filtres
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h4 className="font-medium">Statut d'expiration</h4>
                          <Select 
                            value={filterStatus} 
                            onValueChange={(value) => setFilterStatus(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Tous les statuts" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Tous les statuts</SelectItem>
                              <SelectItem value="fresh">Frais</SelectItem>
                              <SelectItem value="expiring_soon">Expire bientôt</SelectItem>
                              <SelectItem value="expired">Expiré</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="hide-expired"
                            checked={hideExpired}
                            onCheckedChange={setHideExpired}
                          />
                          <Label htmlFor="hide-expired">Masquer les produits expirés</Label>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <Clock className="animate-spin mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Chargement des produits...</p>
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="text-center py-8">
                  <AlertTriangle className="mx-auto h-12 w-12 text-amber-500 mb-4" />
                  <h3 className="text-lg font-medium">Aucun produit trouvé</h3>
                  <p className="text-muted-foreground mt-1">
                    Aucun produit ne correspond à vos critères de recherche.
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredProducts.map(product => {
                    const productBatches = filteredBatches.filter(batch => batch.product_id === product.id);
                    
                    return (
                      <Card key={product.id} className="overflow-hidden">
                        <CardHeader className="pb-2 bg-muted/50">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-lg font-medium">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                Barcode: {product.barcode} | {productBatches.length} lots
                              </p>
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              Ajouter un lot
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="p-0">
                          <BatchTable 
                            batches={productBatches}
                            onDelete={deleteBatch}
                            product={product}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle>
                {selectedProduct 
                  ? `Ajouter un lot : ${selectedProduct.name}`
                  : "Sélectionnez un produit"}
              </CardTitle>
              <CardDescription>
                Enregistrez un nouveau lot avec une date d'expiration
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedProduct ? (
                <BatchForm 
                  batch={null}
                  onSave={addBatch}
                  onCancel={() => setSelectedProduct(null)}
                  productId={selectedProduct.id}
                />
              ) : (
                <div className="text-center py-8">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Aucun produit sélectionné</h3>
                  <p className="text-muted-foreground mt-1">
                    Cliquez sur le bouton "Ajouter un lot" pour un produit
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Informations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <BatchStatusBadge expiryDate={addDays(new Date(), 90).toISOString()} />
                <span>Produit frais</span>
              </div>
              <div className="flex items-center gap-2">
                <BatchStatusBadge expiryDate={addDays(new Date(), 15).toISOString()} />
                <span>Expire dans moins de 30 jours</span>
              </div>
              <div className="flex items-center gap-2">
                <BatchStatusBadge expiryDate={addDays(new Date(), -1).toISOString()} />
                <span>Produit expiré</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpirationManagement;
