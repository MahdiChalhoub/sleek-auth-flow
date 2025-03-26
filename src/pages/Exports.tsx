
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText, Table } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Exports = () => {
  const handleExport = (dataType: string, format: string) => {
    toast.success(`Exportation des données ${dataType} au format ${format} initiée`);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Exports de Données</h1>
      <p className="text-muted-foreground">Exportez vos données du système dans différents formats</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Inventaire</CardTitle>
            <CardDescription>Exportez les données d'inventaire</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="csv">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("inventaire", "CSV")}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Ventes</CardTitle>
            <CardDescription>Exportez les données de vente</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("ventes", "Excel")}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Clients</CardTitle>
            <CardDescription>Exportez les données clients</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="csv">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("clients", "CSV")}>
              <Table className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Exportez les données de transaction</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="excel">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("transactions", "Excel")}>
              <Download className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Comptabilité</CardTitle>
            <CardDescription>Exportez les données comptables</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="pdf">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="excel">Excel</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("comptabilité", "PDF")}>
              <FileText className="mr-2 h-4 w-4" />
              Exporter
            </Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Tous les Rapports</CardTitle>
            <CardDescription>Exportez tous les rapports</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select defaultValue="zip">
              <SelectTrigger>
                <SelectValue placeholder="Format d'export" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="zip">ZIP (tous formats)</SelectItem>
                <SelectItem value="excel">Excel (multi-feuilles)</SelectItem>
              </SelectContent>
            </Select>
            
            <Button className="w-full" onClick={() => handleExport("tous rapports", "ZIP")}>
              <Download className="mr-2 h-4 w-4" />
              Exporter Tout
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Exports;
