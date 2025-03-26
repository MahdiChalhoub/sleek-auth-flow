
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, BarChart, PieChart } from "@/components/ui/chart";

const ProfitLoss = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 90)),
    to: new Date(),
  });
  const [period, setPeriod] = useState<string>("month");
  const [view, setView] = useState<string>("summary");

  // Mock profit and loss data
  const summaryData = {
    revenue: 75680.50,
    costOfGoods: 45408.30,
    grossProfit: 30272.20,
    expenses: {
      rent: 4500.00,
      utilities: 1200.00,
      salaries: 15000.00,
      marketing: 2500.00,
      other: 1800.00
    },
    netProfit: 5272.20
  };

  // Chart data
  const monthlyData = [
    { month: "Jan", revenue: 22500, expenses: 18000, profit: 4500 },
    { month: "Feb", revenue: 24800, expenses: 19500, profit: 5300 },
    { month: "Mar", revenue: 28380, expenses: 23100, profit: 5280 }
  ];

  // Category breakdown data
  const categoryData = [
    { name: "Électronique", value: 45 },
    { name: "Alimentaire", value: 25 },
    { name: "Vêtements", value: 15 },
    { name: "Maison", value: 10 },
    { name: "Autres", value: 5 }
  ];

  // Expense breakdown data
  const expenseData = [
    { name: "Loyer", value: 18 },
    { name: "Salaires", value: 60 },
    { name: "Utilities", value: 5 },
    { name: "Marketing", value: 10 },
    { name: "Autres", value: 7 }
  ];

  // Calculate total expenses
  const totalExpenses = Object.values(summaryData.expenses).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Profit & Pertes</h2>
          <p className="text-muted-foreground">Analyse des performances financières</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => {/* handle PDF export */}}>
            <FileText className="mr-2 h-4 w-4" />
            Exporter PDF
          </Button>
          <Button variant="outline" onClick={() => {/* handle CSV export */}}>
            <Download className="mr-2 h-4 w-4" />
            Exporter CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Sélectionner la période et le type d'analyse
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Période</p>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Grouper par</p>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue placeholder="Mois" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Jour</SelectItem>
                  <SelectItem value="week">Semaine</SelectItem>
                  <SelectItem value="month">Mois</SelectItem>
                  <SelectItem value="quarter">Trimestre</SelectItem>
                  <SelectItem value="year">Année</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Vue</p>
              <Select value={view} onValueChange={setView}>
                <SelectTrigger>
                  <SelectValue placeholder="Récapitulatif" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Récapitulatif</SelectItem>
                  <SelectItem value="details">Détaillé</SelectItem>
                  <SelectItem value="compare">Comparaison périodes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="revenue">Revenus</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Résumé Financier</CardTitle>
                <CardDescription>Aperçu du T1 2025</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Revenus totaux</span>
                    <span className="font-medium">€{summaryData.revenue.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b">
                    <span className="text-muted-foreground">Coût des marchandises</span>
                    <span className="font-medium">€{summaryData.costOfGoods.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2 border-b bg-muted/20 p-1">
                    <span className="font-medium">Marge brute</span>
                    <span className="font-bold">€{summaryData.grossProfit.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-muted-foreground">Dépenses totales</span>
                    <span className="font-medium">€{totalExpenses.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t bg-muted/20 p-1">
                    <span className="font-medium">Bénéfice net</span>
                    <span className="font-bold text-green-600">€{summaryData.netProfit.toLocaleString('fr-FR', {minimumFractionDigits: 2})}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Performance Mensuelle</CardTitle>
                <CardDescription>Revenus, dépenses et bénéfices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <BarChart 
                    data={monthlyData}
                    index="month"
                    categories={["revenue", "expenses", "profit"]}
                    colors={["blue", "red", "green"]}
                    valueFormatter={(value) => `€${value.toLocaleString()}`}
                    showLegend={true}
                    showXAxis={true}
                    showYAxis={true}
                    yAxisWidth={60}
                    showAnimation={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Revenus</CardTitle>
                <CardDescription>Par catégorie de produits</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={categoryData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    showLabel={true}
                    showAnimation={true}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Dépenses</CardTitle>
                <CardDescription>Par type de dépense</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <PieChart 
                    data={expenseData}
                    index="name"
                    category="value"
                    valueFormatter={(value) => `${value}%`}
                    showLabel={true}
                    showAnimation={true}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Revenus</CardTitle>
              <CardDescription>Évolution sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AreaChart 
                  data={monthlyData}
                  index="month"
                  categories={["revenue"]}
                  colors={["blue"]}
                  valueFormatter={(value) => `€${value.toLocaleString()}`}
                  showLegend={false}
                  showAnimation={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Dépenses</CardTitle>
              <CardDescription>Évolution sur la période sélectionnée</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AreaChart 
                  data={monthlyData}
                  index="month"
                  categories={["expenses"]}
                  colors={["red"]}
                  valueFormatter={(value) => `€${value.toLocaleString()}`}
                  showLegend={false}
                  showAnimation={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Analyse de Tendance</CardTitle>
              <CardDescription>Comparaison des métriques clés</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <AreaChart 
                  data={monthlyData}
                  index="month"
                  categories={["revenue", "expenses", "profit"]}
                  colors={["blue", "red", "green"]}
                  valueFormatter={(value) => `€${value.toLocaleString()}`}
                  showLegend={true}
                  showXAxis={true}
                  showYAxis={true}
                  showAnimation={true}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfitLoss;
