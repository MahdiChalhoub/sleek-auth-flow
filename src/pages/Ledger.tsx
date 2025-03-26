
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, FileText, Search } from "lucide-react";
import { toast } from "sonner";

const Ledger = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [accountType, setAccountType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState("general-ledger");

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
    },
    {
      id: "5",
      date: "2025-03-28",
      description: "Paiement de Loyer",
      refNumber: "EXP-001",
      account: "Dépenses",
      debit: 500.00,
      credit: 0,
      balance: 500.00
    },
    {
      id: "6",
      date: "2025-03-28",
      description: "Paiement de Loyer",
      refNumber: "EXP-001",
      account: "Banque",
      debit: 0,
      credit: 500.00,
      balance: 500.00
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
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Grand Livre</h1>
          <p className="text-muted-foreground mt-1">
            Gestion du livre comptable et des journaux
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

      <Tabs defaultValue="general-ledger" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="general-ledger">Grand Livre</TabsTrigger>
          <TabsTrigger value="journal-entries">Écritures Journal</TabsTrigger>
          <TabsTrigger value="trial-balance">Balance de Vérification</TabsTrigger>
          <TabsTrigger value="accounts">Plan Comptable</TabsTrigger>
        </TabsList>
        
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

        <TabsContent value="general-ledger" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Grand Livre</CardTitle>
              <CardDescription>
                Liste complète des transactions comptables
              </CardDescription>
            </CardHeader>
            <CardContent>
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
        </TabsContent>

        <TabsContent value="journal-entries" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Écritures de Journal</CardTitle>
              <CardDescription>
                Écritures comptables par date
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Group by date */}
                <div>
                  <h3 className="text-lg font-medium mb-2">26 Mars 2025</h3>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Vente au Client ABC - Référence: INV-001</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Compte</TableHead>
                            <TableHead className="text-right">Débit</TableHead>
                            <TableHead className="text-right">Crédit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Comptes Clients</TableCell>
                            <TableCell className="text-right">€1,200.50</TableCell>
                            <TableCell className="text-right"></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Ventes</TableCell>
                            <TableCell className="text-right"></TableCell>
                            <TableCell className="text-right">€1,200.50</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2">27 Mars 2025</h3>
                  <Card>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">Achat de Stock - Référence: PO-001</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Compte</TableHead>
                            <TableHead className="text-right">Débit</TableHead>
                            <TableHead className="text-right">Crédit</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Stock</TableCell>
                            <TableCell className="text-right">€750.00</TableCell>
                            <TableCell className="text-right"></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Comptes Fournisseurs</TableCell>
                            <TableCell className="text-right"></TableCell>
                            <TableCell className="text-right">€750.00</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trial-balance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Balance de Vérification</CardTitle>
              <CardDescription>
                Balance des comptes débiteurs et créditeurs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Compte</TableHead>
                    <TableHead className="text-right">Débit</TableHead>
                    <TableHead className="text-right">Crédit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Comptes Clients</TableCell>
                    <TableCell className="text-right">€1,200.50</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Ventes</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                    <TableCell className="text-right">€1,200.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Stock</TableCell>
                    <TableCell className="text-right">€750.00</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Comptes Fournisseurs</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                    <TableCell className="text-right">€750.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Dépenses</TableCell>
                    <TableCell className="text-right">€500.00</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Banque</TableCell>
                    <TableCell className="text-right">€0.00</TableCell>
                    <TableCell className="text-right">€500.00</TableCell>
                  </TableRow>
                  <TableRow className="font-bold border-t">
                    <TableCell>Total</TableCell>
                    <TableCell className="text-right">€2,450.50</TableCell>
                    <TableCell className="text-right">€2,450.50</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plan Comptable</CardTitle>
              <CardDescription>
                Liste des comptes et leur structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Nom du Compte</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Solde</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>1000</TableCell>
                    <TableCell>Banque</TableCell>
                    <TableCell>Actif</TableCell>
                    <TableCell className="text-right">€4,500.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>1200</TableCell>
                    <TableCell>Comptes Clients</TableCell>
                    <TableCell>Actif</TableCell>
                    <TableCell className="text-right">€1,200.50</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>1300</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Actif</TableCell>
                    <TableCell className="text-right">€3,250.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>2000</TableCell>
                    <TableCell>Comptes Fournisseurs</TableCell>
                    <TableCell>Passif</TableCell>
                    <TableCell className="text-right">€750.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>4000</TableCell>
                    <TableCell>Ventes</TableCell>
                    <TableCell>Revenu</TableCell>
                    <TableCell className="text-right">€12,500.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>5000</TableCell>
                    <TableCell>Coût des Marchandises Vendues</TableCell>
                    <TableCell>Dépense</TableCell>
                    <TableCell className="text-right">€4,200.00</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>6000</TableCell>
                    <TableCell>Dépenses</TableCell>
                    <TableCell>Dépense</TableCell>
                    <TableCell className="text-right">€1,800.00</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ledger;
