
import React, { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

// Sample financial data
const profitLossData = [
  { month: 'Jan', income: 50000, expenses: 35000, profit: 15000 },
  { month: 'Feb', income: 55000, expenses: 32000, profit: 23000 },
  { month: 'Mar', income: 48000, expenses: 30000, profit: 18000 },
  { month: 'Apr', income: 60000, expenses: 45000, profit: 15000 },
  { month: 'May', income: 58000, expenses: 40000, profit: 18000 },
  { month: 'Jun', income: 65000, expenses: 38000, profit: 27000 },
];

const expenseCategoryData = [
  { name: 'Salaires', value: 30000, fill: '#8884d8' },
  { name: 'Loyer', value: 8000, fill: '#83a6ed' },
  { name: 'Matériaux', value: 15000, fill: '#8dd1e1' },
  { name: 'Marketing', value: 5000, fill: '#82ca9d' },
  { name: 'Autres', value: 12000, fill: '#ffc658' },
];

const ProfitLoss: React.FC = () => {
  const [period, setPeriod] = useState('year');

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Profits et Pertes</h1>
          <p className="text-muted-foreground">Analyse des revenus, dépenses et profits</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sélectionner une période" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mois actuel</SelectItem>
              <SelectItem value="quarter">Trimestre actuel</SelectItem>
              <SelectItem value="year">Année actuelle</SelectItem>
              <SelectItem value="last-year">Année précédente</SelectItem>
              <SelectItem value="custom">Période personnalisée</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FinancialSummaryCard
          title="Revenus Totaux"
          amount="343,000"
          change="+12.5%"
          positive
        />
        <FinancialSummaryCard
          title="Dépenses Totales"
          amount="220,000"
          change="-3.2%"
          positive
        />
        <FinancialSummaryCard
          title="Profits Nets"
          amount="123,000"
          change="+15.7%"
          positive
        />
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="income">Revenus</TabsTrigger>
          <TabsTrigger value="expenses">Dépenses</TabsTrigger>
          <TabsTrigger value="comparison">Comparaison</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Profits et Pertes Mensuels</CardTitle>
                <CardDescription>Vue d'ensemble des revenus, dépenses et profits par mois</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={profitLossData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${value} €`} />
                    <Legend />
                    <Bar dataKey="income" name="Revenus" fill="#8884d8" />
                    <Bar dataKey="expenses" name="Dépenses" fill="#82ca9d" />
                    <Bar dataKey="profit" name="Profits" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Répartition des Dépenses</CardTitle>
                <CardDescription>Ventilation des coûts par catégorie</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expenseCategoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {expenseCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} €`} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  {expenseCategoryData.map((category) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.fill }}></div>
                      <div className="text-sm">{category.name}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Revenus</CardTitle>
              <CardDescription>Évolution des revenus au cours des derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Area type="monotone" dataKey="income" name="Revenus" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Tendance des Dépenses</CardTitle>
              <CardDescription>Évolution des dépenses au cours des derniers mois</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Area type="monotone" dataKey="expenses" name="Dépenses" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Comparaison Revenus vs Dépenses</CardTitle>
              <CardDescription>Analyse comparative des revenus et dépenses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={profitLossData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${value} €`} />
                  <Legend />
                  <Line type="monotone" dataKey="income" name="Revenus" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="expenses" name="Dépenses" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Financial summary card component
interface FinancialSummaryCardProps {
  title: string;
  amount: string;
  change: string;
  positive: boolean;
}

const FinancialSummaryCard: React.FC<FinancialSummaryCardProps> = ({ 
  title, 
  amount, 
  change, 
  positive 
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-md font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{amount} €</div>
        <div className={`text-sm mt-1 ${positive ? 'text-green-600' : 'text-red-600'}`}>
          {change} depuis la période précédente
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfitLoss;
