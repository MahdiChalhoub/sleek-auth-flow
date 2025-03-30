
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';

const PurchaseAnalytics = () => {
  // Sample data for charts
  const monthlyData = [
    { name: 'Jan', purchases: 4000, stock: 2400 },
    { name: 'Feb', purchases: 3000, stock: 1398 },
    { name: 'Mar', purchases: 2000, stock: 9800 },
    { name: 'Apr', purchases: 2780, stock: 3908 },
    { name: 'May', purchases: 1890, stock: 4800 },
    { name: 'Jun', purchases: 2390, stock: 3800 },
    { name: 'Jul', purchases: 3490, stock: 4300 },
  ];

  const supplierData = [
    { name: 'Supplier A', value: 400 },
    { name: 'Supplier B', value: 300 },
    { name: 'Supplier C', value: 300 },
    { name: 'Supplier D', value: 200 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Analyse des Achats</h1>
          <p className="text-muted-foreground">Vue d'ensemble des tendances d'achat et des performances</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total des Commandes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">47</div>
            <p className="text-muted-foreground text-sm">+12% depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12,450 €</div>
            <p className="text-muted-foreground text-sm">-5% depuis le mois dernier</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Fournisseurs Actifs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8</div>
            <p className="text-muted-foreground text-sm">4 nouveaux ce mois-ci</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="trends">
        <TabsList>
          <TabsTrigger value="trends">Tendances</TabsTrigger>
          <TabsTrigger value="suppliers">Fournisseurs</TabsTrigger>
          <TabsTrigger value="categories">Catégories</TabsTrigger>
        </TabsList>
        
        <TabsContent value="trends">
          <Card>
            <CardHeader>
              <CardTitle>Tendances des achats mensuels</CardTitle>
              <CardDescription>Comparaison des achats et des niveaux de stock</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96">
                <BarChart
                  width={800}
                  height={350}
                  data={monthlyData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="purchases" fill="#8884d8" name="Achats" />
                  <Bar dataKey="stock" fill="#82ca9d" name="Stock" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="suppliers">
          <Card>
            <CardHeader>
              <CardTitle>Distribution des achats par fournisseur</CardTitle>
              <CardDescription>Proportion des commandes par fournisseur</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <PieChart width={400} height={300}>
                  <Pie
                    data={supplierData}
                    cx={200}
                    cy={150}
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {supplierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Analyse par catégories</CardTitle>
              <CardDescription>Cette visualisation sera disponible prochainement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center h-64">
                <p className="text-muted-foreground">
                  Les données des catégories sont en cours de compilation
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PurchaseAnalytics;
