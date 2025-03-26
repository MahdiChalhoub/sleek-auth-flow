
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ProfitLossChart } from "@/components/dashboard/ProfitLossChart";
import { SalesTrendsChart } from "@/components/dashboard/SalesTrendsChart";
import { TopSellingProductsChart } from "@/components/dashboard/TopSellingProductsChart";
import { BarChart3, Download, FileText } from "lucide-react";
import { toast } from "sonner";

const FinanceDashboard = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [location, setLocation] = useState<string>("all");
  const [period, setPeriod] = useState<string>("month");
  const [activeTab, setActiveTab] = useState("overview");

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    toast.success(`Exporting dashboard as ${format.toUpperCase()}`, {
      description: "Your report will be ready to download shortly."
    });
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord Financier</h1>
          <p className="text-muted-foreground mt-1">
            Vue d'ensemble des indicateurs financiers clés
          </p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => handleExport("pdf")}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button variant="outline" onClick={() => handleExport("csv")}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Filtrer les données financières par période, emplacement et type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Période</p>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Emplacement</p>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les emplacements" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les emplacements</SelectItem>
                  <SelectItem value="main">Magasin Principal</SelectItem>
                  <SelectItem value="branch1">Succursale 1</SelectItem>
                  <SelectItem value="branch2">Succursale 2</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Intervalle</p>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Mensuel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Journalier</SelectItem>
                  <SelectItem value="week">Hebdomadaire</SelectItem>
                  <SelectItem value="month">Mensuel</SelectItem>
                  <SelectItem value="quarter">Trimestriel</SelectItem>
                  <SelectItem value="year">Annuel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="sales">Ventes & Revenus</TabsTrigger>
          <TabsTrigger value="financials">États Financiers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Revenu Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">123,456 €</div>
                <p className="text-xs text-muted-foreground">
                  +12.5% par rapport à la période précédente
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Profit Net
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">36,789 €</div>
                <p className="text-xs text-muted-foreground">
                  +8.2% par rapport à la période précédente
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Marge Brute
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">29.8%</div>
                <p className="text-xs text-muted-foreground">
                  +1.5% par rapport à la période précédente
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,234</div>
                <p className="text-xs text-muted-foreground">
                  +18.7% par rapport à la période précédente
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendance Profit & Perte</CardTitle>
                <CardDescription>
                  Comparaison des profits et pertes sur les 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProfitLossChart />
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Produits les Plus Vendus</CardTitle>
                <CardDescription>
                  Top 5 des produits par quantité et revenus générés
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopSellingProductsChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Ventes</CardTitle>
              <CardDescription>
                Analyse des ventes sur les 6 derniers mois
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <SalesTrendsChart />
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance par Caissier</CardTitle>
                <CardDescription>
                  Ventes par caissier pour la période sélectionnée
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance par Catégorie</CardTitle>
                <CardDescription>
                  Ventes par catégorie de produit
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="financials" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comptes Clients</CardTitle>
                <CardDescription>
                  Analyse des comptes clients
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Comptes Fournisseurs</CardTitle>
                <CardDescription>
                  Analyse des comptes fournisseurs
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <div className="flex items-center justify-center h-full">
                  <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Flux de Trésorerie</CardTitle>
              <CardDescription>
                Analyse des entrées et sorties de trésorerie
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <div className="flex items-center justify-center h-full">
                <BarChart3 className="h-16 w-16 text-muted-foreground/50" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinanceDashboard;
