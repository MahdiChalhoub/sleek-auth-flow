
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Calendar, FileDown, Filter, RefreshCw } from "lucide-react";
import { useLocationContext } from "@/contexts/LocationContext";
import { mockProducts } from "@/models/product";
import StockAdjustmentTable from "@/components/inventory/StockAdjustmentTable";
import { useToast } from "@/hooks/use-toast";
import { Location } from "@/types/location";

const StockAdjustments: React.FC = () => {
  const { toast } = useToast();
  const { currentLocation } = useLocationContext();
  const [activeTab, setActiveTab] = useState("adjustment");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);
  const [isLoading, setIsLoading] = useState(false);

  // Filter products based on current location and other filters
  useEffect(() => {
    setFilteredProducts(mockProducts);
  }, [currentLocation, selectedDate]);

  const handleRefreshData = () => {
    setIsLoading(true);
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Données actualisées",
        description: "Les données d'inventaire ont été actualisées avec succès"
      });
    }, 1000);
  };

  const handleExportData = () => {
    toast({
      title: "Export en cours",
      description: "L'export des ajustements de stock a été lancé"
    });
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Ajustement des Stocks</CardTitle>
              <CardDescription>
                Ajustez votre inventaire en fonction des comptages physiques réels
                {currentLocation && <span className="font-medium"> - {currentLocation.name}</span>}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
              <Button variant="outline" onClick={handleExportData}>
                <FileDown className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <TabsList>
                <TabsTrigger value="adjustment">Ajustement des stocks</TabsTrigger>
                <TabsTrigger value="history">Historique des ajustements</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Sélectionner une date
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </div>
            </div>

            <TabsContent value="adjustment" className="space-y-4 mt-2">
              <StockAdjustmentTable products={filteredProducts} currentLocation={currentLocation} />
            </TabsContent>
            
            <TabsContent value="history" className="space-y-4 mt-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center justify-center py-12">
                    <p className="text-muted-foreground">L'historique des ajustements sera bientôt disponible</p>
                    <Button variant="outline" className="mt-4">
                      Voir les transactions
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAdjustments;
