import React, { useState } from "react";
import { 
  Calendar, CalendarClock, AlertTriangle, Clock, CheckCircle, XCircle, 
  Filter, Truck, Search, BarChart, Download, ArrowDownUp, Plus, FileDown
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface ProductBatch {
  id: string;
  productId: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  receivedDate: string;
  storageLocation: string;
  supplier: string;
  notes?: string;
}

const isApproachingExpiry = (expiryDate: string, daysThreshold: number = 30) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays > 0 && diffDays <= daysThreshold;
};

const isExpired = (expiryDate: string) => {
  const today = new Date();
  const expiry = new Date(expiryDate);
  return expiry < today;
};

const generateMockBatches = (): ProductBatch[] => {
  const mockBatches: ProductBatch[] = [];
  
  const today = new Date();
  
  mockBatches.push({
    id: "b1",
    productId: "1",
    batchNumber: "MLK2023-001",
    expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 5).toISOString().split('T')[0],
    quantity: 25,
    receivedDate: new Date(today.getFullYear(), today.getMonth() - 1, 1).toISOString().split('T')[0],
    storageLocation: "Refrigerated-A",
    supplier: "Dairy Farms Inc",
    notes: "Keep refrigerated at 2-4°C"
  });
  
  mockBatches.push({
    id: "b2",
    productId: "1",
    batchNumber: "MLK2023-002",
    expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15).toISOString().split('T')[0],
    quantity: 40,
    receivedDate: new Date(today.getFullYear(), today.getMonth(), 10).toISOString().split('T')[0],
    storageLocation: "Refrigerated-B",
    supplier: "Dairy Farms Inc"
  });
  
  mockBatches.push({
    id: "b3",
    productId: "2",
    batchNumber: "BRD2023-005",
    expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString().split('T')[0],
    quantity: 10,
    receivedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7).toISOString().split('T')[0],
    storageLocation: "Bakery-A",
    supplier: "Fresh Bakery Ltd",
    notes: "Discounted due to approaching expiry"
  });
  
  mockBatches.push({
    id: "b4",
    productId: "2",
    batchNumber: "BRD2023-006",
    expiryDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 3).toISOString().split('T')[0],
    quantity: 30,
    receivedDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2).toISOString().split('T')[0],
    storageLocation: "Bakery-A",
    supplier: "Fresh Bakery Ltd"
  });
  
  mockBatches.push({
    id: "b5",
    productId: "3",
    batchNumber: "CAN2023-010",
    expiryDate: new Date(today.getFullYear() + 1, today.getMonth(), 15).toISOString().split('T')[0],
    quantity: 100,
    receivedDate: new Date(today.getFullYear(), today.getMonth() - 2, 15).toISOString().split('T')[0],
    storageLocation: "Dry Storage-C",
    supplier: "Global Foods Co."
  });
  
  mockBatches.push({
    id: "b6",
    productId: "4",
    batchNumber: "MED2022-100",
    expiryDate: new Date(today.getFullYear(), today.getMonth() + 1, 20).toISOString().split('T')[0],
    quantity: 50,
    receivedDate: new Date(today.getFullYear() - 1, 11, 10).toISOString().split('T')[0],
    storageLocation: "Pharmacy-A",
    supplier: "MediPharm Supply",
    notes: "Controlled substance"
  });
  
  mockBatches.push({
    id: "b7",
    productId: "4",
    batchNumber: "MED2023-045",
    expiryDate: new Date(today.getFullYear(), today.getMonth() - 1, 5).toISOString().split('T')[0],
    quantity: 5,
    receivedDate: new Date(today.getFullYear() - 1, 5, 20).toISOString().split('T')[0],
    storageLocation: "Pharmacy-B",
    supplier: "MediPharm Supply",
    notes: "EXPIRED - Needs disposal"
  });
  
  return mockBatches;
};

const mockBatches = generateMockBatches();

const mockProducts = [
  { id: "1", name: "Lait Entier 1L", category: "Produits laitiers", price: 1.99 },
  { id: "2", name: "Pain de Campagne 500g", category: "Boulangerie", price: 2.49 },
  { id: "3", name: "Conserve de Maïs 330g", category: "Conserves", price: 0.99 },
  { id: "4", name: "Paracétamol 500mg", category: "Pharmacie", price: 5.99 }
];

const ExpirationManagement: React.FC = () => {
  const [batches, setBatches] = useState<ProductBatch[]>(mockBatches);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "expiring" | "expired" | "fresh">("all");
  const [selectedBatch, setSelectedBatch] = useState<ProductBatch | null>(null);
  const [addBatchOpen, setAddBatchOpen] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [blockExpiredSales, setBlockExpiredSales] = useState(true);
  const [daysBeforeWarning, setDaysBeforeWarning] = useState(30);
  
  const getProductName = (productId: string) => {
    return mockProducts.find(p => p.id === productId)?.name || "Produit inconnu";
  };
  
  const getBatchStatus = (batch: ProductBatch) => {
    if (isExpired(batch.expiryDate)) {
      return "expired";
    } else if (isApproachingExpiry(batch.expiryDate, daysBeforeWarning)) {
      return "expiring";
    } else {
      return "fresh";
    }
  };
  
  const filteredBatches = batches.filter(batch => {
    const productName = getProductName(batch.productId);
    const matchesQuery = 
      productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      batch.batchNumber.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesQuery) return false;
    
    if (filterStatus === "all") return true;
    
    const status = getBatchStatus(batch);
    return status === filterStatus;
  });
  
  const expiryStats = {
    expired: batches.filter(b => isExpired(b.expiryDate)).length,
    expiring: batches.filter(b => !isExpired(b.expiryDate) && isApproachingExpiry(b.expiryDate, daysBeforeWarning)).length,
    fresh: batches.filter(b => !isExpired(b.expiryDate) && !isApproachingExpiry(b.expiryDate, daysBeforeWarning)).length
  };
  
  const totalBatches = batches.length;
  const expiryPercentage = (expiryStats.expiring / totalBatches) * 100;
  const expiredPercentage = (expiryStats.expired / totalBatches) * 100;
  const freshPercentage = (expiryStats.fresh / totalBatches) * 100;
  
  const handleAddBatch = (newBatch: Partial<ProductBatch>) => {
    const batch: ProductBatch = {
      id: `b${batches.length + 1}`,
      productId: newBatch.productId || "",
      batchNumber: newBatch.batchNumber || `BATCH-${Date.now().toString().substring(8)}`,
      expiryDate: newBatch.expiryDate || new Date().toISOString().split('T')[0],
      quantity: newBatch.quantity || 0,
      receivedDate: newBatch.receivedDate || new Date().toISOString().split('T')[0],
      storageLocation: newBatch.storageLocation || "",
      supplier: newBatch.supplier || "",
      notes: newBatch.notes
    };
    
    setBatches(prev => [batch, ...prev]);
    toast.success("Lot ajouté avec succès");
    setAddBatchOpen(false);
  };
  
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Dates d'Expiration</h1>
          <p className="text-muted-foreground">Suivez et gérez les lots de produits et leurs dates d'expiration</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowReport(true)}
            className="gap-2"
          >
            <FileDown size={16} />
            Rapport
          </Button>
          <Dialog open={addBatchOpen} onOpenChange={setAddBatchOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-green-600 to-emerald-600">
                <Plus size={16} />
                Nouveau Lot
              </Button>
            </DialogTrigger>
            <BatchFormDialog onSubmit={handleAddBatch} onCancel={() => setAddBatchOpen(false)} />
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ExpiryStatCard 
          title="Lots Expirés" 
          count={expiryStats.expired}
          total={totalBatches}
          percentage={expiredPercentage}
          variant="danger" 
          icon={<XCircle />}
        />
        <ExpiryStatCard 
          title="Expiration Proche" 
          count={expiryStats.expiring}
          total={totalBatches}
          percentage={expiryPercentage}
          variant="warning" 
          icon={<AlertTriangle />}
        />
        <ExpiryStatCard 
          title="Lots Frais" 
          count={expiryStats.fresh}
          total={totalBatches}
          percentage={freshPercentage}
          variant="success" 
          icon={<CheckCircle />}
        />
        <Card className="bg-white shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-md font-medium">Paramètres</CardTitle>
            <CardDescription>Configuration des alertes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="expiry-days">Alerte avant expiration</Label>
                <span className="text-xs font-medium">{daysBeforeWarning} jours</span>
              </div>
              <Input 
                id="expiry-days"
                type="range" 
                min="1" 
                max="90" 
                value={daysBeforeWarning} 
                onChange={(e) => setDaysBeforeWarning(Number(e.target.value))}
                className="cursor-pointer"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch 
                id="block-sales" 
                checked={blockExpiredSales} 
                onCheckedChange={setBlockExpiredSales} 
              />
              <Label htmlFor="block-sales">Bloquer la vente de produits expirés</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white shadow-sm">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Lots de Produits</CardTitle>
              <CardDescription>Gérez vos lots et leurs dates d'expiration</CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher un produit ou lot"
                  className="pl-8 w-full sm:w-[250px]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as any)}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les lots</SelectItem>
                  <SelectItem value="expired">Expirés</SelectItem>
                  <SelectItem value="expiring">Expiration proche</SelectItem>
                  <SelectItem value="fresh">Frais</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="w-[200px]">Produit</TableHead>
                <TableHead>N° de lot</TableHead>
                <TableHead>Expiration</TableHead>
                <TableHead className="text-center">Statut</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Emplacement</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="h-32 text-center">
                    Aucun lot trouvé
                  </TableCell>
                </TableRow>
              ) : (
                filteredBatches.map((batch) => {
                  const status = getBatchStatus(batch);
                  return (
                    <TableRow key={batch.id}>
                      <TableCell className="font-medium">
                        {getProductName(batch.productId)}
                      </TableCell>
                      <TableCell>{batch.batchNumber}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          {batch.expiryDate}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {status === "expired" && (
                          <Badge variant="destructive" className="gap-1">
                            <XCircle className="h-3.5 w-3.5" />
                            Expiré
                          </Badge>
                        )}
                        {status === "expiring" && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-200 gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            Expire bientôt
                          </Badge>
                        )}
                        {status === "fresh" && (
                          <Badge variant="outline" className="bg-green-100 text-green-700 border-green-200 gap-1">
                            <CheckCircle className="h-3.5 w-3.5" />
                            Frais
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">{batch.quantity}</TableCell>
                      <TableCell className="text-right">{batch.storageLocation}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setSelectedBatch(batch)}
                        >
                          Détails
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedBatch} onOpenChange={(open) => !open && setSelectedBatch(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Détails du Lot</DialogTitle>
            <DialogDescription>
              {selectedBatch && getProductName(selectedBatch.productId)} - Lot {selectedBatch?.batchNumber}
            </DialogDescription>
          </DialogHeader>
          {selectedBatch && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Produit</Label>
                  <div className="font-medium">{getProductName(selectedBatch.productId)}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Numéro de Lot</Label>
                  <div className="font-medium">{selectedBatch.batchNumber}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date d'Expiration</Label>
                  <div className="font-medium flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                    {selectedBatch.expiryDate}
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Quantité Restante</Label>
                  <div className="font-medium">{selectedBatch.quantity}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Date de Réception</Label>
                  <div className="font-medium">{selectedBatch.receivedDate}</div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Emplacement</Label>
                  <div className="font-medium">{selectedBatch.storageLocation}</div>
                </div>
              </div>
              
              <div>
                <Label className="text-xs text-muted-foreground">Fournisseur</Label>
                <div className="font-medium">{selectedBatch.supplier}</div>
              </div>
              
              {selectedBatch.notes && (
                <div>
                  <Label className="text-xs text-muted-foreground">Notes</Label>
                  <div className="text-sm bg-slate-50 p-2 rounded border">{selectedBatch.notes}</div>
                </div>
              )}
              
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Statut</Label>
                <div className="space-y-1">
                  {getBatchStatus(selectedBatch) === "expired" ? (
                    <div className="text-red-600 flex items-center gap-1.5">
                      <XCircle className="h-4 w-4" />
                      Expiré depuis {Math.abs(Math.ceil((new Date(selectedBatch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} jours
                    </div>
                  ) : getBatchStatus(selectedBatch) === "expiring" ? (
                    <div className="text-amber-600 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" />
                      Expire dans {Math.ceil((new Date(selectedBatch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                    </div>
                  ) : (
                    <div className="text-green-600 flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4" />
                      Frais - Expire dans {Math.ceil((new Date(selectedBatch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setSelectedBatch(null)}>
              Fermer
            </Button>
            <Button 
              variant="default" 
              className={getBatchStatus(selectedBatch!) === "expired" ? "bg-red-600 hover:bg-red-700" : ""}
            >
              {getBatchStatus(selectedBatch!) === "expired" ? "Marquer comme Détruit" : "Éditer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Rapport d'Expiration</DialogTitle>
            <DialogDescription>
              Aperçu des produits expirant prochainement
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px]">
            <div className="space-y-6 p-1">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  Produits Expirés ({expiryStats.expired})
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-red-50">
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Lot</TableHead>
                          <TableHead>Expiré depuis</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batches
                          .filter(b => isExpired(b.expiryDate))
                          .map(batch => (
                            <TableRow key={batch.id}>
                              <TableCell>{getProductName(batch.productId)}</TableCell>
                              <TableCell>{batch.batchNumber}</TableCell>
                              <TableCell>
                                {Math.abs(Math.ceil((new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))} jours
                              </TableCell>
                              <TableCell className="text-right">{batch.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="h-5 w-5" />
                  Expiration Proche ({expiryStats.expiring})
                </h3>
                <Card>
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-amber-50">
                        <TableRow>
                          <TableHead>Produit</TableHead>
                          <TableHead>Lot</TableHead>
                          <TableHead>Expire dans</TableHead>
                          <TableHead className="text-right">Quantité</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {batches
                          .filter(b => !isExpired(b.expiryDate) && isApproachingExpiry(b.expiryDate, daysBeforeWarning))
                          .sort((a, b) => new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime())
                          .map(batch => (
                            <TableRow key={batch.id}>
                              <TableCell>{getProductName(batch.productId)}</TableCell>
                              <TableCell>{batch.batchNumber}</TableCell>
                              <TableCell>
                                {Math.ceil((new Date(batch.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} jours
                              </TableCell>
                              <TableCell className="text-right">{batch.quantity}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>

              <div className="rounded-lg border p-4 bg-slate-50">
                <h4 className="font-medium mb-2">Rapport d'expiration</h4>
                <p className="text-sm text-muted-foreground mb-4">Ce rapport montre les produits qui sont expirés ou qui expireront bientôt dans les {daysBeforeWarning} prochains jours.</p>
                <Button variant="outline" className="w-full gap-2">
                  <Download className="h-4 w-4" />
                  Télécharger au format PDF
                </Button>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReport(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface ExpiryStatCardProps {
  title: string;
  count: number;
  total: number;
  percentage: number;
  variant: "success" | "warning" | "danger";
  icon: React.ReactNode;
}

const ExpiryStatCard: React.FC<ExpiryStatCardProps> = ({
  title,
  count,
  total,
  percentage,
  variant,
  icon
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case "success":
        return "bg-green-50 border-green-100 text-green-800";
      case "warning":
        return "bg-amber-50 border-amber-100 text-amber-800";
      case "danger":
        return "bg-red-50 border-red-100 text-red-800";
    }
  };

  const getProgressColor = () => {
    switch (variant) {
      case "success":
        return "bg-green-500";
      case "warning":
        return "bg-amber-500";
      case "danger":
        return "bg-red-500";
    }
  };

  return (
    <Card className={`${getVariantClasses()} shadow-sm`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium flex items-center gap-2">
          {React.cloneElement(icon as React.ReactElement, { className: "h-4 w-4" })}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <div className="flex items-center justify-between mt-1">
          <div className="text-sm opacity-80">sur {total} lots</div>
          <div className="text-sm font-medium">{percentage.toFixed(1)}%</div>
        </div>
        <Progress className="h-1.5 mt-2" value={percentage}>
          <div className={`h-full ${getProgressColor()}`} style={{ width: `${percentage}%` }} />
        </Progress>
      </CardContent>
    </Card>
  );
};

interface BatchFormDialogProps {
  onSubmit: (batch: Partial<ProductBatch>) => void;
  onCancel: () => void;
  initialData?: Partial<ProductBatch>;
}

const BatchFormDialog: React.FC<BatchFormDialogProps> = ({ 
  onSubmit, 
  onCancel,
  initialData = {}
}) => {
  const today = new Date().toISOString().split('T')[0];
  const [formData, setFormData] = useState<Partial<ProductBatch>>({
    productId: "1",
    batchNumber: `BATCH-${Date.now().toString().substring(8)}`,
    expiryDate: today,
    quantity: 1,
    receivedDate: today,
    storageLocation: "",
    supplier: "",
    notes: "",
    ...initialData
  });

  const handleChange = (field: keyof ProductBatch, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Ajouter un Nouveau Lot</DialogTitle>
        <DialogDescription>
          Entrez les détails du lot de produit et sa date d'expiration
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="product">Produit</Label>
              <Select 
                value={formData.productId} 
                onValueChange={(v) => handleChange("productId", v)}
              >
                <SelectTrigger id="product">
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  {mockProducts.map(product => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="batchNumber">Numéro de Lot</Label>
              <Input 
                id="batchNumber" 
                value={formData.batchNumber} 
                onChange={(e) => handleChange("batchNumber", e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantité</Label>
              <Input 
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", Number(e.target.value))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="receivedDate">Date de Réception</Label>
              <Input 
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleChange("receivedDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiryDate">Date d'Expiration</Label>
              <Input 
                id="expiryDate"
                type="date"
                value={formData.expiryDate}
                onChange={(e) => handleChange("expiryDate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storageLocation">Emplacement de Stockage</Label>
              <Input 
                id="storageLocation"
                value={formData.storageLocation}
                onChange={(e) => handleChange("storageLocation", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Fournisseur</Label>
              <Input 
                id="supplier"
                value={formData.supplier}
                onChange={(e) => handleChange("supplier", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Input 
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <Button variant="outline" type="button" onClick={onCancel}>Annuler</Button>
          <Button type="submit">Enregistrer</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default ExpirationManagement;
