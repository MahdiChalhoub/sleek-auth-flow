
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const JournalEntries = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Group entries by date and reference for journal display
  const journalGroups = [
    {
      date: "26 Mars 2025",
      entries: [
        {
          id: "je-1",
          title: "Vente au Client ABC - Référence: INV-001",
          lines: [
            { account: "Comptes Clients", debit: 1200.50, credit: 0 },
            { account: "Ventes", debit: 0, credit: 1200.50 }
          ]
        }
      ]
    },
    {
      date: "27 Mars 2025",
      entries: [
        {
          id: "je-2",
          title: "Achat de Stock - Référence: PO-001",
          lines: [
            { account: "Stock", debit: 750.00, credit: 0 },
            { account: "Comptes Fournisseurs", debit: 0, credit: 750.00 }
          ]
        },
        {
          id: "je-3",
          title: "Paiement de Loyer - Référence: EXP-001",
          lines: [
            { account: "Dépenses", debit: 500.00, credit: 0 },
            { account: "Banque", debit: 0, credit: 500.00 }
          ]
        }
      ]
    }
  ];

  // Filter by search query
  const filteredJournalGroups = journalGroups
    .map(group => ({
      ...group,
      entries: group.entries.filter(entry => 
        searchQuery === "" || entry.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }))
    .filter(group => group.entries.length > 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Écritures de Journal</h2>
          <p className="text-muted-foreground">Écritures comptables par date</p>
        </div>
        
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nouvelle Écriture
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Filtrer les écritures de journal
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Période</p>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Recherche</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher une écriture..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {filteredJournalGroups.length > 0 ? (
          filteredJournalGroups.map((group) => (
            <div key={group.date}>
              <h3 className="text-lg font-medium mb-2">{group.date}</h3>
              
              <div className="space-y-4">
                {group.entries.map(entry => (
                  <Card key={entry.id}>
                    <CardHeader className="py-2">
                      <CardTitle className="text-sm">{entry.title}</CardTitle>
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
                          {entry.lines.map((line, index) => (
                            <TableRow key={index}>
                              <TableCell>{line.account}</TableCell>
                              <TableCell className="text-right">{line.debit > 0 ? `€${line.debit.toFixed(2)}` : ""}</TableCell>
                              <TableCell className="text-right">{line.credit > 0 ? `€${line.credit.toFixed(2)}` : ""}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              Aucune écriture trouvée pour les critères sélectionnés
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default JournalEntries;
