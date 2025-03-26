
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Search, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DatePickerWithRange } from "@/components/returns/DateRangePicker";
import { DateRange } from "react-day-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const AccountsReceivable = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [status, setStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Mock accounts receivable data
  const receivables = [
    {
      id: "AR-001",
      clientId: "1",
      clientName: "John Doe",
      invoiceNumber: "INV-001",
      amount: 1200.50,
      dueDate: "2025-04-15",
      status: "pending",
      age: 15,  // days
      notes: "Premier rappel envoyé le 01/04/2025"
    },
    {
      id: "AR-002",
      clientId: "3",
      clientName: "Bob Johnson",
      invoiceNumber: "INV-023",
      amount: 450.00,
      dueDate: "2025-04-05",
      status: "overdue",
      age: 25, // days
      notes: "Second rappel envoyé le 10/04/2025"
    },
    {
      id: "AR-003",
      clientId: "5",
      clientName: "Charlie Wilson",
      invoiceNumber: "INV-056",
      amount: 3275.25,
      dueDate: "2025-04-30",
      status: "pending",
      age: 0, // days
      notes: ""
    },
    {
      id: "AR-004",
      clientId: "2",
      clientName: "Jane Smith",
      invoiceNumber: "INV-089",
      amount: 675.50,
      dueDate: "2025-03-25",
      status: "paid",
      age: 35, // days
      notes: "Payé le 15/04/2025"
    }
  ];

  // Filter accounts receivable based on search query and status
  const filteredReceivables = receivables.filter(item => {
    const matchesSearch = searchQuery === "" || 
      item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = status === "all" || item.status === status;
    
    return matchesSearch && matchesStatus;
  });

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">En attente</Badge>;
      case 'overdue':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">En retard</Badge>;
      case 'paid':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Payé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">Comptes Clients</h2>
          <p className="text-muted-foreground">Gestion des créances clients</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => {/* handle export */}}>
            <Download className="mr-2 h-4 w-4" />
            Exporter
          </Button>
          <Button>
            <UserCircle className="mr-2 h-4 w-4" />
            Nouveau Client
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Filtres</CardTitle>
          <CardDescription>
            Filtrer les comptes clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2">Période d'échéance</p>
              <DatePickerWithRange date={dateRange} setDate={setDateRange} />
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Statut</p>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Tous les statuts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="overdue">En retard</SelectItem>
                  <SelectItem value="paid">Payé</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-2">Recherche</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Rechercher client ou facture..."
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
                <TableHead>Facture</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Échéance</TableHead>
                <TableHead>Âge (jours)</TableHead>
                <TableHead className="text-right">Montant</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReceivables.length > 0 ? (
                filteredReceivables.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.invoiceNumber}</TableCell>
                    <TableCell>{item.clientName}</TableCell>
                    <TableCell>{item.dueDate}</TableCell>
                    <TableCell>{item.age}</TableCell>
                    <TableCell className="text-right">€{item.amount.toFixed(2)}</TableCell>
                    <TableCell>{renderStatusBadge(item.status)}</TableCell>
                    <TableCell>{item.notes}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    Aucun compte client trouvé pour les critères sélectionnés
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

export default AccountsReceivable;
