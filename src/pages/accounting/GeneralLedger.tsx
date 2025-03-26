
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const GeneralLedger = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [accountType, setAccountType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handleExport = (format: "pdf" | "csv" | "excel") => {
    toast.success(`Exporting ledger as ${format.toUpperCase()}`, {
      description: "Your report will be ready to download shortly."
    });
  };

  // Mock ledger entries data
  const ledgerEntries = [
    {
      id: "1",
      date: "2025-03-26",
      description: "Vente au Client ABC",
      refNumber: "INV-001",
      account: "Ventes",
      debit: 0,
      credit: 1200.50,
      balance: 1200.50
    },
    {
      id: "2",
      date: "2025-03-26",
      description: "Vente au Client ABC",
      refNumber: "INV-001",
      account: "Comptes Clients",
      debit: 1200.50,
      credit: 0,
      balance: 1200.50
    },
    {
      id: "3",
      date: "2025-03-27",
      description: "Achat de Stock",
      refNumber: "PO-001",
      account: "Stock",
      debit: 750.00,
      credit: 0,
      balance: 750.00
    },
    {
      id: "4",
      date: "2025-03-27",
      description: "Achat de Stock",
      refNumber: "PO-001",
      account: "Comptes Fournisseurs",
      debit: 0,
      credit: 750.00,
      balance: 750.00
    }
  ];

  // Filter ledger entries based on search query and account type
  const filteredEntries = ledgerEntries.filter(entry => {
    const matchesSearch = searchQuery === "" || 
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.account.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesAccountType = accountType === "all" || entry.account.includes(accountType);
    
    return matchesSearch && matchesAccountType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Grand Livre</h2>
          <p className="text-muted-foreground">Liste complète des transactions comptables</p>
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
            Filtrer les données comptables
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Période</p>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Type de Compte</p>
              <Select value={accountType} onValueChange={setAccountType}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les comptes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les comptes</SelectItem>
                  <SelectItem value="Ventes">Ventes</SelectItem>
                  <SelectItem value="Achats">Achats</SelectItem>
                  <SelectItem value="Dépenses">Dépenses</SelectItem>
                  <SelectItem value="Banque">Banque</SelectItem>
                  <SelectItem value="Caisse">Caisse</SelectItem>
                  <SelectItem value="Stock">Stock</SelectItem>
                  <SelectItem value="Comptes">Comptes Clients</SelectItem>
                  <SelectItem value="Fournisseurs">Comptes Fournisseurs</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Recherche</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher transaction ou description..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Compte</TableHead>
                <TableHead className="text-right">Débit</TableHead>
                <TableHead className="text-right">Crédit</TableHead>
                <TableHead className="text-right">Solde</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEntries.length > 0 ? (
                filteredEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.date}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.refNumber}</TableCell>
                    <TableCell>{entry.account}</TableCell>
                    <TableCell className="text-right">{entry.debit > 0 ? `€${entry.debit.toFixed(2)}` : ""}</TableCell>
                    <TableCell className="text-right">{entry.credit > 0 ? `€${entry.credit.toFixed(2)}` : ""}</TableCell>
                    <TableCell className="text-right">€{entry.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucune écriture trouvée pour les critères sélectionnés
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralLedger;
