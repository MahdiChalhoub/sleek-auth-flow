
import React, { useState } from "react";
import { 
  Printer, ListChecks, Barcode, QrCode, Scan, FileDown, Settings, Plus, Layers, 
  Check, File, CalendarClock, Tags, Monitor, X
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
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { BarcodeScannerModal } from "@/components/inventory/BarcodeScannerModal";
import { mockProducts } from "@/models/product";

interface PrintTemplate {
  id: string;
  name: string;
  type: "barcode" | "label";
  format: "small" | "medium" | "large";
  showPrice: boolean;
  showName: boolean;
  showExpiry: boolean;
  showQR: boolean;
  barcodeType: "CODE128" | "EAN13" | "QR" | "CODE39";
}

const templates: PrintTemplate[] = [
  {
    id: "t1",
    name: "Standard Barcode",
    type: "barcode",
    format: "small",
    showPrice: false,
    showName: false,
    showExpiry: false,
    showQR: false,
    barcodeType: "CODE128"
  },
  {
    id: "t2",
    name: "Product Label",
    type: "label",
    format: "medium",
    showPrice: true,
    showName: true,
    showExpiry: false,
    showQR: false,
    barcodeType: "EAN13"
  },
  {
    id: "t3",
    name: "Full Label w/ Expiry",
    type: "label",
    format: "large",
    showPrice: true,
    showName: true,
    showExpiry: true,
    showQR: false,
    barcodeType: "EAN13"
  },
  {
    id: "t4",
    name: "QR Code Label",
    type: "label",
    format: "medium",
    showPrice: true,
    showName: true,
    showExpiry: false,
    showQR: true,
    barcodeType: "QR"
  }
];

const BarcodePrinting: React.FC = () => {
  const [products, setProducts] = useState(mockProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("t2");
  const [quantity, setQuantity] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [barcodeDialogOpen, setBarcodeDialogOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);
  
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.barcode.includes(searchQuery)
  );

  const template = templates.find(t => t.id === selectedTemplate) || templates[0];

  const handleSelectProduct = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedProducts(prev => [...prev, productId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === filteredProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(filteredProducts.map(p => p.id));
    }
  };

  const handleScanBarcode = (barcode: string) => {
    const product = products.find(p => p.barcode === barcode);
    if (product) {
      if (!selectedProducts.includes(product.id)) {
        setSelectedProducts(prev => [...prev, product.id]);
        toast.success(`Produit ajouté: ${product.name}`);
      } else {
        toast.info(`Le produit ${product.name} est déjà sélectionné`);
      }
    } else {
      toast.error("Produit non trouvé", {
        description: `Aucun produit avec le code-barres ${barcode}`
      });
    }
    setScannerOpen(false);
  };

  const handlePrint = () => {
    if (selectedProducts.length === 0) {
      toast.error("Veuillez sélectionner au moins un produit");
      return;
    }
    
    const selectedCount = selectedProducts.length;
    const totalLabels = selectedCount * quantity;
    
    toast.success(`Impression démarrée`, {
      description: `${totalLabels} étiquettes envoyées à l'imprimante`
    });
    
    // In a real app, we would send the print job to the printer here
    console.log("Printing", {
      products: selectedProducts.map(id => products.find(p => p.id === id)),
      template,
      quantity
    });
  };

  const handleExportPDF = () => {
    if (selectedProducts.length === 0) {
      toast.error("Veuillez sélectionner au moins un produit");
      return;
    }
    
    toast.success(`Exportation PDF démarrée`, {
      description: `PDF généré pour ${selectedProducts.length} produits`
    });
    
    // In a real app, we would generate and download the PDF here
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Impression de Codes-barres</h1>
          <p className="text-muted-foreground">Générez et imprimez des codes-barres et étiquettes</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setScannerOpen(true)} className="flex items-center gap-2">
            <Scan size={16} />
            Scanner
          </Button>
          <Button className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600">
            <Plus size={16} />
            Nouveau Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 order-2 md:order-1">
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/60">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle>Sélection des Produits</CardTitle>
                <Button variant="ghost" size="sm" onClick={handleSelectAll}>
                  {selectedProducts.length === filteredProducts.length ? "Désélectionner tout" : "Sélectionner tout"}
                </Button>
              </div>
              <CardDescription>
                Sélectionnez les produits pour lesquels vous souhaitez imprimer des étiquettes
              </CardDescription>
              <div className="mt-3">
                <div className="relative">
                  <Barcode className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher par nom ou code-barres"
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[500px]">
                <Table>
                  <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Produit</TableHead>
                      <TableHead>Code-barres</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead className="text-right">Prix</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          Aucun produit trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product) => (
                        <TableRow key={product.id} onClick={() => handleSelectProduct(product.id)}
                          className={selectedProducts.includes(product.id) ? "bg-blue-50/50" : "hover:bg-slate-50"}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onCheckedChange={() => handleSelectProduct(product.id)}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell className="font-mono text-sm">{product.barcode}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">${product.price.toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </ScrollArea>
              
              <div className="p-4 border-t border-slate-200/60">
                <div className="text-sm">
                  <span className="font-medium">{selectedProducts.length}</span> produits sélectionnés sur {filteredProducts.length}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-1 order-1 md:order-2">
          <Card className="bg-white/90 backdrop-blur-sm shadow-sm border border-slate-200/60">
            <CardHeader>
              <CardTitle>Paramètres d'Impression</CardTitle>
              <CardDescription>Configurez les options d'impression</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Template d'Étiquette</Label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez un template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map(template => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Quantité par produit</Label>
                <Input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={quantity} 
                  onChange={(e) => setQuantity(Number(e.target.value))} 
                />
                <p className="text-xs text-muted-foreground">
                  Total: {selectedProducts.length * quantity} étiquettes
                </p>
              </div>

              <div className="space-y-2">
                <Label>Type de Code-barres</Label>
                <Select value={template.barcodeType} disabled>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CODE128">CODE128</SelectItem>
                    <SelectItem value="EAN13">EAN13</SelectItem>
                    <SelectItem value="QR">QR Code</SelectItem>
                    <SelectItem value="CODE39">CODE39</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant={template.format === "small" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Petit
                  </Button>
                  <Button
                    variant={template.format === "medium" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Moyen
                  </Button>
                  <Button
                    variant={template.format === "large" ? "default" : "outline"}
                    size="sm"
                    className="w-full"
                    disabled
                  >
                    Grand
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Contenu de l'Étiquette</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="name" checked={template.showName} disabled />
                    <label
                      htmlFor="name"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Nom du Produit
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="price" checked={template.showPrice} disabled />
                    <label
                      htmlFor="price"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Prix
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="expiry" checked={template.showExpiry} disabled />
                    <label
                      htmlFor="expiry"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      Date d'Expiration
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="qr" checked={template.showQR} disabled />
                    <label
                      htmlFor="qr"
                      className="text-sm font-medium leading-none cursor-pointer"
                    >
                      QR Code
                    </label>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>Aperçu</Label>
                <div className="border rounded-md p-4 bg-white flex flex-col items-center">
                  <div className="text-center mb-2 text-xs text-muted-foreground">Preview Template: {template.name}</div>
                  <div className="w-full h-24 flex items-center justify-center border border-dashed rounded-md relative overflow-hidden">
                    {selectedProducts.length > 0 ? (
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="text-xs text-center p-2">
                          <Barcode className="h-6 w-6 mx-auto mb-1 opacity-70" />
                          {template.showName && (
                            <div className="font-medium">
                              {products.find(p => p.id === selectedProducts[0])?.name || "Product Name"}
                            </div>
                          )}
                          <div className="font-mono">
                            {products.find(p => p.id === selectedProducts[0])?.barcode || "0000000000000"}
                          </div>
                          {template.showPrice && (
                            <div className="font-bold mt-1">
                              ${products.find(p => p.id === selectedProducts[0])?.price.toFixed(2) || "0.00"}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-center text-muted-foreground">
                        <Barcode className="h-6 w-6 mx-auto mb-1 opacity-50" />
                        Sélectionnez un produit pour voir l'aperçu
                      </div>
                    )}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-2"
                    onClick={() => setPreviewOpen(true)}
                    disabled={selectedProducts.length === 0}
                  >
                    <Monitor className="h-3.5 w-3.5 mr-1" />
                    Aperçu Complet
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button 
                onClick={handlePrint}
                disabled={selectedProducts.length === 0} 
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600"
              >
                <Printer className="h-4 w-4 mr-2" />
                Imprimer {selectedProducts.length > 0 ? `(${selectedProducts.length * quantity})` : ""}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportPDF}
                disabled={selectedProducts.length === 0}
                className="w-full"
              >
                <FileDown className="h-4 w-4 mr-2" />
                Exporter en PDF
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Barcode Scanner Modal */}
      {scannerOpen && (
        <BarcodeScannerModal 
          onScan={handleScanBarcode} 
          onClose={() => setScannerOpen(false)} 
        />
      )}

      {/* Full Preview Dialog */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Aperçu des Étiquettes</DialogTitle>
            <DialogDescription>
              Aperçu des étiquettes pour {selectedProducts.length} produit(s)
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] w-full">
            <div className="space-y-4 p-2">
              {selectedProducts.map(productId => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                
                return (
                  <div key={product.id} className="border rounded-md p-4 bg-white">
                    <div className="mb-2 text-xs text-slate-500">
                      Template: {template.name}
                    </div>
                    <div className="flex justify-center">
                      <div className="w-48 h-32 border flex flex-col items-center justify-center p-2">
                        {template.showName && (
                          <div className="font-medium text-sm text-center">
                            {product.name}
                          </div>
                        )}
                        <div className="my-2">
                          {template.barcodeType === "QR" ? (
                            <QrCode className="h-12 w-12" />
                          ) : (
                            <div className="font-mono text-xs bg-white px-4 py-2">
                              {product.barcode}
                            </div>
                          )}
                        </div>
                        {template.showPrice && (
                          <div className="font-bold text-sm">
                            ${product.price.toFixed(2)}
                          </div>
                        )}
                        {template.showExpiry && (
                          <div className="text-xs mt-1 flex items-center">
                            <CalendarClock className="h-3 w-3 mr-1" />
                            Exp: 30/12/2023
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPreviewOpen(false)}>
              Fermer
            </Button>
            <Button onClick={handlePrint}>
              <Printer className="h-4 w-4 mr-2" />
              Imprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BarcodePrinting;
