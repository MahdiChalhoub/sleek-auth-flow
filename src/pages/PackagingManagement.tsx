import React, { useState } from "react";
import { 
  Package, Package2, BoxesIcon, BarChart, Scan, History, CornerRightDown, ArrowDownUp, Plus, PlusCircle, MinusCircle, Printer
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

interface PackagingHierarchy {
  unit: {
    barcode: string;
    name: string;
  };
  paquet: {
    barcode: string;
    name: string;
    unitCount: number;
  };
  carton: {
    barcode: string;
    name: string;
    paquetCount: number;
  };
}

interface PackagingHistoryItem {
  id: string;
  date: string;
  action: "box" | "unbox";
  from: string;
  to: string;
  quantity: number;
  user: string;
}

const mockPackagingData: Record<string, PackagingHierarchy> = {
  "P001": {
    unit: {
      barcode: "U123456789",
      name: "Chocolat Noir 100g"
    },
    paquet: {
      barcode: "P123456789",
      name: "Pack 5x Chocolat Noir 100g",
      unitCount: 5
    },
    carton: {
      barcode: "C123456789",
      name: "Carton 10x Pack Chocolat Noir",
      paquetCount: 10
    }
  },
  "P002": {
    unit: {
      barcode: "U223456789",
      name: "Biscuits Chocolat 200g"
    },
    paquet: {
      barcode: "P223456789",
      name: "Pack 6x Biscuits Chocolat",
      unitCount: 6
    },
    carton: {
      barcode: "C223456789",
      name: "Carton 8x Pack Biscuits Chocolat",
      paquetCount: 8
    }
  },
  "P003": {
    unit: {
      barcode: "U323456789",
      name: "Café Moulu 250g"
    },
    paquet: {
      barcode: "P323456789",
      name: "Pack 4x Café Moulu 250g",
      unitCount: 4
    },
    carton: {
      barcode: "C323456789",
      name: "Carton 12x Pack Café Moulu",
      paquetCount: 12
    }
  }
};

const mockHistory: PackagingHistoryItem[] = [
  {
    id: "1",
    date: "2023-07-20 14:35",
    action: "box",
    from: "Unit - Chocolat Noir 100g",
    to: "Pack 5x Chocolat Noir 100g",
    quantity: 15,
    user: "Marie Dupont"
  },
  {
    id: "2",
    date: "2023-07-19 10:12",
    action: "unbox",
    from: "Carton 10x Pack Biscuits Chocolat",
    to: "Pack 6x Biscuits Chocolat",
    quantity: 2,
    user: "Jean Martin"
  },
  {
    id: "3",
    date: "2023-07-18 16:45",
    action: "box",
    from: "Pack 4x Café Moulu 250g",
    to: "Carton 12x Pack Café Moulu",
    quantity: 36,
    user: "Sophie Leclerc"
  }
];

const PackagingManagement: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<string>("P001");
  const [boxDialogOpen, setBoxDialogOpen] = useState(false);
  const [unboxDialogOpen, setUnboxDialogOpen] = useState(false);
  const [boxingFrom, setBoxingFrom] = useState<"unit" | "paquet">("unit");
  const [boxingTo, setBoxingTo] = useState<"paquet" | "carton">("paquet");
  const [unboxingFrom, setUnboxingFrom] = useState<"carton" | "paquet">("carton");
  const [unboxingTo, setUnboxingTo] = useState<"paquet" | "unit">("paquet");
  const [quantity, setQuantity] = useState(1);
  const [history, setHistory] = useState(mockHistory);

  const productPackaging = mockPackagingData[selectedProduct];

  const handleBoxing = () => {
    let fromName = boxingFrom === "unit" ? productPackaging.unit.name : productPackaging.paquet.name;
    let toName = boxingTo === "paquet" ? productPackaging.paquet.name : productPackaging.carton.name;
    
    setHistory(prev => [
      {
        id: (prev.length + 1).toString(),
        date: new Date().toLocaleString(),
        action: "box",
        from: `${boxingFrom.charAt(0).toUpperCase() + boxingFrom.slice(1)} - ${fromName}`,
        to: toName,
        quantity,
        user: "Utilisateur Actuel"
      },
      ...prev
    ]);
    
    toast.success("Produits emballés avec succès", {
      description: `${quantity} ${fromName} emballés en ${toName}`,
    });
    
    setBoxDialogOpen(false);
  };

  const handleUnboxing = () => {
    let fromName = unboxingFrom === "carton" ? productPackaging.carton.name : productPackaging.paquet.name;
    let toName = unboxingTo === "paquet" ? productPackaging.paquet.name : productPackaging.unit.name;
    
    setHistory(prev => [
      {
        id: (prev.length + 1).toString(),
        date: new Date().toLocaleString(),
        action: "unbox",
        from: fromName,
        to: `${unboxingTo.charAt(0).toUpperCase() + unboxingTo.slice(1)} - ${toName}`,
        quantity,
        user: "Utilisateur Actuel"
      },
      ...prev
    ]);
    
    toast.success("Produits déballés avec succès", {
      description: `${quantity} ${fromName} déballés en ${toName}`,
    });
    
    setUnboxDialogOpen(false);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Emballages</h1>
          <p className="text-muted-foreground">Boxage et déballage des produits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <History size={16} />
            Historique Complet
          </Button>
          <Button className="gap-2">
            <Plus size={16} />
            Nouveau Type d'Emballage
          </Button>
        </div>
      </div>

      <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/60">
        <CardHeader>
          <CardTitle>Hiérarchie d'Emballage du Produit</CardTitle>
          <CardDescription>Sélectionnez un produit pour gérer ses niveaux d'emballage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Select 
                value={selectedProduct} 
                onValueChange={setSelectedProduct}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un produit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P001">Chocolat Noir 100g</SelectItem>
                  <SelectItem value="P002">Biscuits Chocolat 200g</SelectItem>
                  <SelectItem value="P003">Café Moulu 250g</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="md:col-span-3 flex flex-col md:flex-row gap-3 items-center justify-center">
              <PackagingLevel 
                type="unit"
                name={productPackaging.unit.name}
                barcode={productPackaging.unit.barcode}
                icon={<Package className="h-8 w-8" />}
              />
              
              <div className="flex flex-col items-center text-slate-400">
                <ArrowDownUp className="rotate-90 md:rotate-0 h-5 w-5" />
                <span className="text-xs">{productPackaging.paquet.unitCount}:1</span>
              </div>
              
              <PackagingLevel 
                type="paquet"
                name={productPackaging.paquet.name}
                barcode={productPackaging.paquet.barcode}
                icon={<Package2 className="h-8 w-8" />}
              />
              
              <div className="flex flex-col items-center text-slate-400">
                <ArrowDownUp className="rotate-90 md:rotate-0 h-5 w-5" />
                <span className="text-xs">{productPackaging.carton.paquetCount}:1</span>
              </div>
              
              <PackagingLevel 
                type="carton"
                name={productPackaging.carton.name}
                barcode={productPackaging.carton.barcode}
                icon={<BoxesIcon className="h-8 w-8" />}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 justify-center border-t pt-4">
          <Button 
            onClick={() => setBoxDialogOpen(true)}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Boxage
          </Button>
          <Button 
            onClick={() => setUnboxDialogOpen(true)}
            variant="outline"
            className="w-full sm:w-auto"
          >
            <MinusCircle className="h-4 w-4 mr-2" />
            Déballage
          </Button>
        </CardFooter>
      </Card>

      <Tabs defaultValue="history" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="history">Historique d'Emballage</TabsTrigger>
          <TabsTrigger value="barcodes">Codes-barres Liés</TabsTrigger>
          <TabsTrigger value="stats">Statistiques</TabsTrigger>
        </TabsList>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Historique Récent</CardTitle>
              <CardDescription>Dernières opérations d'emballage et déballage</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>De</TableHead>
                    <TableHead>Vers</TableHead>
                    <TableHead className="text-right">Quantité</TableHead>
                    <TableHead>Opérateur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.date}</TableCell>
                      <TableCell>
                        {item.action === "box" ? (
                          <Badge className="bg-blue-500/20 text-blue-600 hover:bg-blue-500/30">Boxage</Badge>
                        ) : (
                          <Badge className="bg-amber-500/20 text-amber-600 hover:bg-amber-500/30">Déballage</Badge>
                        )}
                      </TableCell>
                      <TableCell>{item.from}</TableCell>
                      <TableCell>{item.to}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell>{item.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="barcodes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Codes-barres Liés</CardTitle>
              <CardDescription>Tous les codes-barres associés à ce produit</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BarcodeCard 
                  title="Unité"
                  name={productPackaging.unit.name}
                  barcode={productPackaging.unit.barcode}
                  icon={<Package className="h-6 w-6" />}
                />
                <BarcodeCard 
                  title="Paquet"
                  name={productPackaging.paquet.name}
                  barcode={productPackaging.paquet.barcode}
                  icon={<Package2 className="h-6 w-6" />}
                />
                <BarcodeCard 
                  title="Carton"
                  name={productPackaging.carton.name}
                  barcode={productPackaging.carton.barcode}
                  icon={<BoxesIcon className="h-6 w-6" />}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Emballage</CardTitle>
              <CardDescription>Activité d'emballage au fil du temps</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <BarChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Les statistiques seront disponibles prochainement</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Boxing Dialog */}
      <Dialog open={boxDialogOpen} onOpenChange={setBoxDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Boîtage de Produits</DialogTitle>
            <DialogDescription>
              Regrouper des unités de niveau inférieur en emballages de niveau supérieur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">De</label>
              <Select value={boxingFrom} onValueChange={(v) => setBoxingFrom(v as "unit" | "paquet")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unit">Unité - {productPackaging.unit.name}</SelectItem>
                  <SelectItem value="paquet">Paquet - {productPackaging.paquet.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Vers</label>
              <Select 
                value={boxingTo} 
                onValueChange={(v) => setBoxingTo(v as "paquet" | "carton")}
                disabled={boxingFrom === "paquet"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paquet" disabled={boxingFrom === "paquet"}>
                    Paquet - {productPackaging.paquet.name}
                  </SelectItem>
                  <SelectItem value="carton">
                    Carton - {productPackaging.carton.name}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Quantité</label>
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {boxingFrom === "unit" && boxingTo === "paquet" && (
                  <>Cela créera {Math.floor(quantity / productPackaging.paquet.unitCount)} paquet(s) complet(s).</>
                )}
                {boxingFrom === "unit" && boxingTo === "carton" && (
                  <>Cela créera {Math.floor(quantity / (productPackaging.paquet.unitCount * productPackaging.carton.paquetCount))} carton(s) complet(s).</>
                )}
                {boxingFrom === "paquet" && boxingTo === "carton" && (
                  <>Cela créera {Math.floor(quantity / productPackaging.carton.paquetCount)} carton(s) complet(s).</>
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBoxDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleBoxing}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unboxing Dialog */}
      <Dialog open={unboxDialogOpen} onOpenChange={setUnboxDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Déballage de Produits</DialogTitle>
            <DialogDescription>
              Décomposer des emballages en unités de niveau inférieur
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">De</label>
              <Select value={unboxingFrom} onValueChange={(v) => setUnboxingFrom(v as "carton" | "paquet")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="carton">Carton - {productPackaging.carton.name}</SelectItem>
                  <SelectItem value="paquet">Paquet - {productPackaging.paquet.name}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Vers</label>
              <Select 
                value={unboxingTo} 
                onValueChange={(v) => setUnboxingTo(v as "paquet" | "unit")}
                disabled={unboxingFrom === "paquet"}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paquet" disabled={unboxingFrom === "paquet"}>
                    Paquet - {productPackaging.paquet.name}
                  </SelectItem>
                  <SelectItem value="unit">
                    Unité - {productPackaging.unit.name}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Quantité</label>
              <Input 
                type="number" 
                min="1" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
              />
              <p className="text-xs text-muted-foreground mt-1">
                {unboxingFrom === "carton" && unboxingTo === "paquet" && (
                  <>Cela créera {quantity * productPackaging.carton.paquetCount} paquet(s).</>
                )}
                {unboxingFrom === "carton" && unboxingTo === "unit" && (
                  <>Cela créera {quantity * productPackaging.carton.paquetCount * productPackaging.paquet.unitCount} unité(s).</>
                )}
                {unboxingFrom === "paquet" && unboxingTo === "unit" && (
                  <>Cela créera {quantity * productPackaging.paquet.unitCount} unité(s).</>
                )}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setUnboxDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleUnboxing}>Confirmer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface PackagingLevelProps {
  type: "unit" | "paquet" | "carton";
  name: string;
  barcode: string;
  icon: React.ReactNode;
}

const PackagingLevel: React.FC<PackagingLevelProps> = ({
  type,
  name,
  barcode,
  icon
}) => {
  const getColor = () => {
    switch (type) {
      case "unit": return "bg-blue-50 border-blue-200 text-blue-700";
      case "paquet": return "bg-green-50 border-green-200 text-green-700";
      case "carton": return "bg-amber-50 border-amber-200 text-amber-700";
      default: return "";
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColor()} flex flex-col items-center text-center`}>
      <div className="mb-2">{icon}</div>
      <h3 className="font-semibold text-sm">{type.charAt(0).toUpperCase() + type.slice(1)}</h3>
      <div className="text-xs mt-1">{name}</div>
      <div className="text-xs mt-1 opacity-70">{barcode}</div>
    </div>
  );
};

interface BarcodeCardProps {
  title: string;
  name: string;
  barcode: string;
  icon: React.ReactNode;
}

const BarcodeCard: React.FC<BarcodeCardProps> = ({
  title,
  name,
  barcode,
  icon
}) => {
  return (
    <div className="border rounded-lg p-4 flex flex-col items-center">
      <div className="flex items-center justify-center mb-2">
        {icon}
        <h3 className="font-semibold ml-2">{title}</h3>
      </div>
      <div className="text-sm mb-2">{name}</div>
      <div className="w-full h-16 bg-gray-100 flex items-center justify-center rounded mb-2">
        <span className="font-mono text-sm">{barcode}</span>
      </div>
      <div className="flex gap-2 mt-2">
        <Button variant="outline" size="sm" className="w-full">
          <Scan className="h-4 w-4 mr-1" />
          Scanner
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          <Printer className="h-4 w-4 mr-1" />
          Imprimer
        </Button>
      </div>
    </div>
  );
};

export default PackagingManagement;

