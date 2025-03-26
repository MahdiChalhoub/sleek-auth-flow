
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, FileDown, Filter, Pencil, Trash2, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface Expense {
  id: string;
  date: string;
  category: string;
  amount: number;
  description: string;
  paymentMethod: string;
  reference?: string;
  status: "pending" | "approved" | "rejected";
}

const mockExpenses: Expense[] = [
  {
    id: "1",
    date: "2023-10-15",
    category: "Loyer",
    amount: 1200,
    description: "Loyer du magasin pour Octobre 2023",
    paymentMethod: "Virement bancaire",
    reference: "REF123456",
    status: "approved"
  },
  {
    id: "2",
    date: "2023-10-14",
    category: "Fournitures",
    amount: 250.75,
    description: "Fournitures de bureau",
    paymentMethod: "Carte de crédit",
    reference: "INV-2023-1014",
    status: "approved"
  },
  {
    id: "3",
    date: "2023-10-12",
    category: "Utilités",
    amount: 175.50,
    description: "Facture d'électricité",
    paymentMethod: "Prélèvement",
    reference: "ELEC-10-2023",
    status: "pending"
  },
  {
    id: "4",
    date: "2023-10-10",
    category: "Marketing",
    amount: 500,
    description: "Campagne publicitaire Facebook",
    paymentMethod: "Carte de crédit",
    reference: "FB-ADS-1010",
    status: "approved"
  },
  {
    id: "5",
    date: "2023-10-05",
    category: "Salaires",
    amount: 3500,
    description: "Salaires des employés",
    paymentMethod: "Virement bancaire",
    status: "approved"
  }
];

const expenseCategories = [
  "Loyer", 
  "Fournitures", 
  "Utilités", 
  "Marketing", 
  "Salaires", 
  "Transport", 
  "Assurance", 
  "Maintenance", 
  "Formation",
  "Autre"
];

const paymentMethods = [
  "Espèces",
  "Carte de crédit",
  "Carte de débit",
  "Virement bancaire",
  "Prélèvement",
  "Chèque",
  "Mobile Money"
];

const Expenses: React.FC = () => {
  const { toast } = useToast();
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [currentExpense, setCurrentExpense] = useState<Expense | null>(null);
  const [newExpense, setNewExpense] = useState<Partial<Expense>>({
    date: new Date().toISOString().split('T')[0],
    category: "",
    amount: 0,
    description: "",
    paymentMethod: "",
    reference: "",
    status: "pending"
  });

  const handleAddExpense = () => {
    if (!newExpense.category || !newExpense.amount || !newExpense.description || !newExpense.paymentMethod) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    const id = (expenses.length + 1).toString();
    setExpenses([...expenses, { id, ...newExpense as Expense }]);
    setIsAddDialogOpen(false);
    setNewExpense({
      date: new Date().toISOString().split('T')[0],
      category: "",
      amount: 0,
      description: "",
      paymentMethod: "",
      reference: "",
      status: "pending"
    });
    
    toast({
      title: "Dépense ajoutée",
      description: "La dépense a été ajoutée avec succès"
    });
  };

  const handleEditExpense = () => {
    if (!currentExpense) return;
    
    if (!currentExpense.category || !currentExpense.amount || !currentExpense.description || !currentExpense.paymentMethod) {
      toast({
        title: "Formulaire incomplet",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }
    
    setExpenses(expenses.map(expense => expense.id === currentExpense.id ? currentExpense : expense));
    setIsEditDialogOpen(false);
    setCurrentExpense(null);
    
    toast({
      title: "Dépense modifiée",
      description: "La dépense a été modifiée avec succès"
    });
  };

  const handleDeleteExpense = () => {
    if (!currentExpense) return;
    
    setExpenses(expenses.filter(expense => expense.id !== currentExpense.id));
    setIsDeleteDialogOpen(false);
    setCurrentExpense(null);
    
    toast({
      title: "Dépense supprimée",
      description: "La dépense a été supprimée avec succès"
    });
  };

  const handleApproveExpense = (id: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: "approved" } : expense
    ));
    
    toast({
      title: "Dépense approuvée",
      description: "La dépense a été approuvée avec succès"
    });
  };

  const handleRejectExpense = (id: string) => {
    setExpenses(expenses.map(expense => 
      expense.id === id ? { ...expense, status: "rejected" } : expense
    ));
    
    toast({
      title: "Dépense rejetée",
      description: "La dépense a été rejetée avec succès"
    });
  };

  const filteredExpenses = expenses
    .filter(expense => 
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.paymentMethod.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expense.reference && expense.reference.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .filter(expense => 
      activeTab === "all" || 
      (activeTab === "pending" && expense.status === "pending") ||
      (activeTab === "approved" && expense.status === "approved") ||
      (activeTab === "rejected" && expense.status === "rejected")
    );

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'XOF' }).format(amount);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR').format(date);
  };

  const getStatusBadge = (status: Expense["status"]) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500">Approuvée</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejetée</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-amber-100 text-amber-800 hover:bg-amber-100">En attente</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Gestion des Dépenses</CardTitle>
              <CardDescription>
                Enregistrez et suivez toutes les dépenses de votre entreprise
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Nouvelle dépense
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4">
              <TabsList>
                <TabsTrigger value="all">Toutes</TabsTrigger>
                <TabsTrigger value="pending">En attente</TabsTrigger>
                <TabsTrigger value="approved">Approuvées</TabsTrigger>
                <TabsTrigger value="rejected">Rejetées</TabsTrigger>
              </TabsList>
              
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-[200px] sm:w-[300px]"
                  />
                </div>
                
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <Calendar className="h-4 w-4" />
                </Button>
                
                <Button variant="outline" size="icon">
                  <FileDown className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Méthode de paiement</TableHead>
                      <TableHead>Référence</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredExpenses.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={8} className="h-24 text-center">
                          Aucune dépense trouvée
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredExpenses.map((expense) => (
                        <TableRow key={expense.id}>
                          <TableCell>{formatDate(expense.date)}</TableCell>
                          <TableCell>{expense.category}</TableCell>
                          <TableCell className="max-w-[200px] truncate" title={expense.description}>
                            {expense.description}
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(expense.amount)}</TableCell>
                          <TableCell>{expense.paymentMethod}</TableCell>
                          <TableCell>{expense.reference || "-"}</TableCell>
                          <TableCell>{getStatusBadge(expense.status)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {expense.status === "pending" && (
                                <>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-green-500 text-green-600 hover:bg-green-50"
                                    onClick={() => handleApproveExpense(expense.id)}
                                  >
                                    Approuver
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 border-red-500 text-red-600 hover:bg-red-50"
                                    onClick={() => handleRejectExpense(expense.id)}
                                  >
                                    Rejeter
                                  </Button>
                                </>
                              )}
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => {
                                  setCurrentExpense(expense);
                                  setIsEditDialogOpen(true);
                                }}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8 text-red-600"
                                onClick={() => {
                                  setCurrentExpense(expense);
                                  setIsDeleteDialogOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex justify-between items-center w-full">
            <div className="text-sm text-muted-foreground">
              Affichage de {filteredExpenses.length} sur {expenses.length} dépenses
            </div>
            <div className="font-medium">
              Total: {formatCurrency(filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0))}
            </div>
          </div>
        </CardFooter>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Ajouter une dépense</DialogTitle>
            <DialogDescription>
              Enregistrez une nouvelle dépense pour votre entreprise
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="category" className="text-sm font-medium">
                  Catégorie
                </label>
                <select
                  id="category"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {expenseCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Input
                id="description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                placeholder="Description de la dépense"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Montant
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  value={newExpense.amount || ""}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="payment-method" className="text-sm font-medium">
                  Méthode de paiement
                </label>
                <select
                  id="payment-method"
                  value={newExpense.paymentMethod}
                  onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="">Sélectionner une méthode</option>
                  {paymentMethods.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="reference" className="text-sm font-medium">
                Référence (optionnel)
              </label>
              <Input
                id="reference"
                value={newExpense.reference || ""}
                onChange={(e) => setNewExpense({ ...newExpense, reference: e.target.value })}
                placeholder="Numéro de facture, reçu, etc."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddExpense}>Ajouter</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Expense Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier une dépense</DialogTitle>
            <DialogDescription>
              Modifiez les détails de la dépense sélectionnée
            </DialogDescription>
          </DialogHeader>
          {currentExpense && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-date" className="text-sm font-medium">
                    Date
                  </label>
                  <Input
                    id="edit-date"
                    type="date"
                    value={currentExpense.date}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, date: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-category" className="text-sm font-medium">
                    Catégorie
                  </label>
                  <select
                    id="edit-category"
                    value={currentExpense.category}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, category: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Sélectionner une catégorie</option>
                    {expenseCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-description" className="text-sm font-medium">
                  Description
                </label>
                <Input
                  id="edit-description"
                  value={currentExpense.description}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, description: e.target.value })}
                  placeholder="Description de la dépense"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="edit-amount" className="text-sm font-medium">
                    Montant
                  </label>
                  <Input
                    id="edit-amount"
                    type="number"
                    step="0.01"
                    value={currentExpense.amount}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, amount: parseFloat(e.target.value) })}
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="edit-payment-method" className="text-sm font-medium">
                    Méthode de paiement
                  </label>
                  <select
                    id="edit-payment-method"
                    value={currentExpense.paymentMethod}
                    onChange={(e) => setCurrentExpense({ ...currentExpense, paymentMethod: e.target.value })}
                    className="w-full rounded-md border border-input bg-background px-3 py-2"
                  >
                    <option value="">Sélectionner une méthode</option>
                    {paymentMethods.map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-reference" className="text-sm font-medium">
                  Référence (optionnel)
                </label>
                <Input
                  id="edit-reference"
                  value={currentExpense.reference || ""}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, reference: e.target.value })}
                  placeholder="Numéro de facture, reçu, etc."
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status" className="text-sm font-medium">
                  Statut
                </label>
                <select
                  id="edit-status"
                  value={currentExpense.status}
                  onChange={(e) => setCurrentExpense({ ...currentExpense, status: e.target.value as Expense["status"] })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="pending">En attente</option>
                  <option value="approved">Approuvée</option>
                  <option value="rejected">Rejetée</option>
                </select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleEditExpense}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Expense Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer une dépense</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir supprimer cette dépense ? Cette action est irréversible.
            </DialogDescription>
          </DialogHeader>
          {currentExpense && (
            <div className="py-4">
              <p>
                Vous êtes sur le point de supprimer la dépense suivante :
              </p>
              <p className="mt-2">
                <strong>Date :</strong> {formatDate(currentExpense.date)}
              </p>
              <p>
                <strong>Catégorie :</strong> {currentExpense.category}
              </p>
              <p>
                <strong>Description :</strong> {currentExpense.description}
              </p>
              <p>
                <strong>Montant :</strong> {formatCurrency(currentExpense.amount)}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDeleteExpense}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Expenses;
