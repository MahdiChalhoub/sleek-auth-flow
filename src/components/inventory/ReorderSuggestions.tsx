import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockProducts } from "@/models/product";
import { ShoppingCart, TrendingUp, AlertTriangle, Clock, Lightbulb, BarChart4 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  sold?: number;
  price: number;
  expiry?: string;
  lastSold?: string;
  restockSuggestion?: number;
  profitMargin?: number;
  turnoverRate?: number;
}

interface ReorderSuggestionsProps {
  locationId: string;
  showAll: boolean;
  onReorderAll: () => void;
}

const enhancedProducts: Product[] = [
  ...mockProducts.map(product => ({
    ...product,
    sold: Math.floor(Math.random() * 50),
    expiry: product.id === "1" || product.id === "3" ? "2023-12-30" : undefined,
    lastSold: product.id === "9" ? "2023-08-15" : "2023-10-20",
    restockSuggestion: Math.floor(Math.random() * 20) + 5,
    profitMargin: Math.random() * 0.5 + 0.2, // 20-70% profit margin
    turnoverRate: Math.random() * 4 + 0.5, // 0.5-4.5 turnover rate
  }))
];

const lowStockProducts = enhancedProducts
  .filter(product => product.stock <= 10)
  .sort((a, b) => a.stock - b.stock);

const topSellingProducts = [
  { id: "1", name: "iPhone 15 Pro", category: "mobile", sold: 25, stock: 15, restockSuggestion: 20, profitMargin: 0.35 },
  { id: "4", name: "Samsung Galaxy S24", category: "mobile", sold: 18, stock: 20, restockSuggestion: 15, profitMargin: 0.3 },
  { id: "3", name: "AirPods Pro 2", category: "electronics", sold: 15, stock: 25, restockSuggestion: 10, profitMargin: 0.45 },
  { id: "6", name: "Sony WH-1000XM5", category: "electronics", sold: 10, stock: 12, restockSuggestion: 8, profitMargin: 0.4 },
  { id: "9", name: "Craft Beer Set", category: "beverages", sold: 9, stock: 15, restockSuggestion: 5, profitMargin: 0.5 }
];

const expiringProducts = enhancedProducts
  .filter(product => product.expiry)
  .sort((a, b) => new Date(a.expiry || "").getTime() - new Date(b.expiry || "").getTime());

const nonSellingProducts = enhancedProducts
  .filter(product => new Date(product.lastSold || "").getTime() < new Date("2023-09-01").getTime())
  .sort((a, b) => new Date(a.lastSold || "").getTime() - new Date(b.lastSold || "").getTime());

const ReorderSuggestions: React.FC<ReorderSuggestionsProps> = ({ locationId, showAll, onReorderAll }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // In a real app, this would be an API call
    setTimeout(() => {
      // Create products with required properties from type definition
      const mockProductsWithAnalytics: Product[] = mockProducts.map(product => ({
        ...product,
        sold: Math.floor(Math.random() * 100),
        expiry: new Date(Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        lastSold: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000).toISOString(),
        restockSuggestion: Math.floor(Math.random() * 30) + 5,
        profitMargin: Math.random() * 0.4 + 0.1,
        turnoverRate: Math.random() * 5 + 0.5,
        category: product.category || product.categoryId || 'Uncategorized',  // Ensure category is set
        hasStock: true,
      }));
      
      setProducts(mockProductsWithAnalytics);
      setLoading(false);
    }, 1000);
  }, [locationId]);
  
  const [activeTab, setActiveTab] = useState("low-stock");
  const [isGeneratingForecast, setIsGeneratingForecast] = useState(false);
  const [forecastGenerated, setForecastGenerated] = useState(false);

  const handleGenerateForecast = () => {
    setIsGeneratingForecast(true);
    
    // Simulate AI forecast generation with a delay
    setTimeout(() => {
      setIsGeneratingForecast(false);
      setForecastGenerated(true);
      
      toast({
        title: "Prévisions générées",
        description: "Les prévisions de ventes ont été générées avec succès",
      });
    }, 2500);
  };

  const handleCreatePO = (productName: string) => {
    toast({
      title: "Bon de commande créé",
      description: `Un bon de commande pour ${productName} a été ajouté`,
    });
  };

  const handleCreatePOForAll = (type: string) => {
    toast({
      title: "Bon de commande groupé créé",
      description: `Un bon de commande pour tous les produits ${type} a été créé`,
    });
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysSinceLastSold = (lastSoldDate: string) => {
    const today = new Date();
    const lastSold = new Date(lastSoldDate);
    const diffTime = today.getTime() - lastSold.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-4 mb-6">
        <TabsTrigger value="low-stock">Stock Bas</TabsTrigger>
        <TabsTrigger value="top-selling">Meilleures Ventes</TabsTrigger>
        <TabsTrigger value="expiring">Produits Expirants</TabsTrigger>
        <TabsTrigger value="forecast">Prévisions IA</TabsTrigger>
      </TabsList>

      <TabsContent value="low-stock" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              <CardTitle>Produits en Stock Bas</CardTitle>
            </div>
            <CardDescription>
              Ces produits sont en quantité limitée et devraient être recommandés bientôt.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Produit</th>
                    <th className="h-10 px-4 text-left font-medium">Catégorie</th>
                    <th className="h-10 px-4 text-center font-medium">Stock Actuel</th>
                    <th className="h-10 px-4 text-center font-medium">Seuil</th>
                    <th className="h-10 px-4 text-center font-medium">Suggestion IA</th>
                    <th className="h-10 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2 pl-4 font-medium">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className={`p-2 text-center ${product.stock <= 5 ? "text-red-600 font-medium" : ""}`}>
                        {product.stock}
                      </td>
                      <td className="p-2 text-center">10</td>
                      <td className="p-2 text-center font-medium text-blue-600">
                        {product.restockSuggestion || "-"}
                      </td>
                      <td className="p-2 pr-4 text-right">
                        <Button size="sm" onClick={() => handleCreatePO(product.name)}>Ajouter au BC</Button>
                      </td>
                    </tr>
                  ))}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-muted-foreground">
                        Aucun produit n'est actuellement en dessous du seuil de stock
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handleCreatePOForAll('en stock bas')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Créer un Bon de Commande pour Tous les Articles en Stock Bas
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="top-selling" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <CardTitle>Produits les Plus Vendus</CardTitle>
            </div>
            <CardDescription>
              Ce sont vos produits les plus vendus des 30 derniers jours.
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="rounded-md border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted">
                  <tr>
                    <th className="h-10 px-4 text-left font-medium">Produit</th>
                    <th className="h-10 px-4 text-left font-medium">Catégorie</th>
                    <th className="h-10 px-4 text-center font-medium">Unités Vendues</th>
                    <th className="h-10 px-4 text-center font-medium">Stock Actuel</th>
                    <th className="h-10 px-4 text-center font-medium">Marge</th>
                    <th className="h-10 px-4 text-center font-medium">Suggestion IA</th>
                    <th className="h-10 px-4 text-right font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {topSellingProducts.map(product => (
                    <tr key={product.id} className="border-t">
                      <td className="p-2 pl-4 font-medium">{product.name}</td>
                      <td className="p-2">{product.category}</td>
                      <td className="p-2 text-center font-medium">{product.sold}</td>
                      <td className={`p-2 text-center ${product.stock <= 10 ? "text-amber-600" : ""}`}>
                        {product.stock}
                      </td>
                      <td className="p-2 text-center">
                        {(product.profitMargin * 100).toFixed(0)}%
                      </td>
                      <td className="p-2 text-center font-medium text-blue-600">
                        {product.restockSuggestion}
                      </td>
                      <td className="p-2 pr-4 text-right">
                        <Button size="sm" onClick={() => handleCreatePO(product.name)}>Ajouter au BC</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => handleCreatePOForAll('les plus vendus')}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Créer un Bon de Commande Suggéré pour les Produits les Plus Vendus
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="expiring" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-red-500" />
              <CardTitle>Produits Expirants & Dormants</CardTitle>
            </div>
            <CardDescription>
              Ces produits sont bientôt périmés ou ne se vendent plus.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="expiring" className="w-full">
              <div className="flex justify-center mb-4">
                <TabsList>
                  <TabsTrigger value="expiring">Produits Expirants</TabsTrigger>
                  <TabsTrigger value="non-selling">Produits Dormants</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="expiring">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="h-10 px-4 text-left font-medium">Produit</th>
                        <th className="h-10 px-4 text-left font-medium">Catégorie</th>
                        <th className="h-10 px-4 text-center font-medium">Stock</th>
                        <th className="h-10 px-4 text-center font-medium">Date d'Expiration</th>
                        <th className="h-10 px-4 text-center font-medium">Jours Restants</th>
                        <th className="h-10 px-4 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expiringProducts.length > 0 ? (
                        expiringProducts.map(product => {
                          const daysUntilExpiry = getDaysUntilExpiry(product.expiry || "");
                          return (
                            <tr key={product.id} className="border-t">
                              <td className="p-2 pl-4 font-medium">{product.name}</td>
                              <td className="p-2">{product.category}</td>
                              <td className="p-2 text-center">{product.stock}</td>
                              <td className="p-2 text-center">{product.expiry}</td>
                              <td className="p-2 text-center">
                                <Badge className={daysUntilExpiry < 7 ? "bg-red-500" : "bg-amber-500"}>
                                  {daysUntilExpiry} jours
                                </Badge>
                              </td>
                              <td className="p-2 pr-4 text-right">
                                <Button variant="outline" size="sm">Promotion</Button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            Aucun produit expirant trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              <TabsContent value="non-selling">
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="h-10 px-4 text-left font-medium">Produit</th>
                        <th className="h-10 px-4 text-left font-medium">Catégorie</th>
                        <th className="h-10 px-4 text-center font-medium">Stock</th>
                        <th className="h-10 px-4 text-center font-medium">Dernière Vente</th>
                        <th className="h-10 px-4 text-center font-medium">Jours Sans Vente</th>
                        <th className="h-10 px-4 text-right font-medium">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nonSellingProducts.length > 0 ? (
                        nonSellingProducts.map(product => {
                          const daysSinceLastSold = getDaysSinceLastSold(product.lastSold || "");
                          return (
                            <tr key={product.id} className="border-t">
                              <td className="p-2 pl-4 font-medium">{product.name}</td>
                              <td className="p-2">{product.category}</td>
                              <td className="p-2 text-center">{product.stock}</td>
                              <td className="p-2 text-center">{product.lastSold}</td>
                              <td className="p-2 text-center">
                                <Badge className={daysSinceLastSold > 60 ? "bg-red-500" : "bg-amber-500"}>
                                  {daysSinceLastSold} jours
                                </Badge>
                              </td>
                              <td className="p-2 pr-4 text-right">
                                <Button variant="outline" size="sm">Solde</Button>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            Aucun produit dormant trouvé
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter>
            <div className="grid grid-cols-2 gap-2 w-full">
              <Button variant="outline" className="w-full">
                Générer Promotions Automatiques
              </Button>
              <Button variant="outline" className="w-full">
                Analyse des Produits Dormants
              </Button>
            </div>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="forecast" className="space-y-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-amber-500" />
              <CardTitle>Prévisions des Ventes IA</CardTitle>
            </div>
            <CardDescription>
              Prévisions de ventes générées par intelligence artificielle basées sur l'historique.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!forecastGenerated ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <BarChart4 className="h-16 w-16 mb-4 text-muted-foreground/50" />
                <h3 className="text-lg font-medium mb-2">Générer des prévisions de ventes</h3>
                <p className="text-muted-foreground mb-6 max-w-md">
                  Utilisez l'IA pour analyser vos données historiques et générer des prévisions de ventes pour les prochains mois.
                </p>
                {isGeneratingForecast ? (
                  <div className="w-full max-w-md space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Analyse des données historiques...
                    </p>
                    <Progress value={65} className="h-2 w-full" />
                    <p className="text-xs text-muted-foreground">
                      Cela peut prendre quelques instants. L'IA analyse vos données de ventes, tendances saisonnières et autres facteurs.
                    </p>
                  </div>
                ) : (
                  <Button onClick={handleGenerateForecast}>
                    Générer des prévisions IA
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">+12%</div>
                        <p className="text-sm text-muted-foreground">Croissance prévue</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold">72%</div>
                        <p className="text-sm text-muted-foreground">Précision du modèle</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-amber-600">3</div>
                        <p className="text-sm text-muted-foreground">Mois analysés</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="rounded-md border overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="h-10 px-4 text-left font-medium">Produit</th>
                        <th className="h-10 px-4 text-left font-medium">Catégorie</th>
                        <th className="h-10 px-4 text-center font-medium">Ventes Actuelles</th>
                        <th className="h-10 px-4 text-center font-medium">Prévision (3 mois)</th>
                        <th className="h-10 px-4 text-center font-medium">Tendance</th>
                        <th className="h-10 px-4 text-center font-medium">Confiance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellingProducts.map(product => (
                        <tr key={product.id} className="border-t">
                          <td className="p-2 pl-4 font-medium">{product.name}</td>
                          <td className="p-2">{product.category}</td>
                          <td className="p-2 text-center">{product.sold} unités/mois</td>
                          <td className="p-2 text-center font-medium">
                            {Math.floor(product.sold * (1 + Math.random() * 0.4 - 0.1))} unités/mois
                          </td>
                          <td className="p-2 text-center">
                            {Math.random() > 0.3 ? (
                              <Badge className="bg-green-500">Croissance</Badge>
                            ) : Math.random() > 0.5 ? (
                              <Badge className="bg-amber-500">Stable</Badge>
                            ) : (
                              <Badge className="bg-red-500">Déclin</Badge>
                            )}
                          </td>
                          <td className="p-2 text-center">
                            {Math.floor(60 + Math.random() * 30)}%
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border p-4 rounded-md bg-muted/30">
                  <h4 className="font-medium mb-2">Insights IA</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>Les produits mobiles montrent une tendance à la hausse de 15% pour le prochain trimestre.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>Les ventes d'électronique semblent saisonnières avec des pics en décembre et juin.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lightbulb className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>Considérez d'augmenter le stock d'iPhone 15 Pro de 20% pour répondre à la demande croissante.</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
          {forecastGenerated && (
            <CardFooter>
              <div className="grid grid-cols-2 gap-2 w-full">
                <Button variant="outline" className="w-full">
                  Exporter les Prévisions
                </Button>
                <Button variant="outline" className="w-full">
                  Créer Plan d'Approvisionnement
                </Button>
              </div>
            </CardFooter>
          )}
        </Card>
      </TabsContent>
    </Tabs>
  );
};

export default ReorderSuggestions;
