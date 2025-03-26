import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  Calendar,
  Check,
  Clock,
  CreditCard,
  Edit,
  Plus,
  Repeat,
  Search,
  Trash,
  XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { format, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import RecurringExpenseDialog from '@/components/payments/RecurringExpenseDialog';
import { PaymentMethod, RecurringExpense } from '@/models/payment';
import { useRecurringExpenses } from '@/hooks/useRecurringExpenses';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const RecurringExpenses: React.FC = () => {
  const {
    recurringExpenses,
    isLoading,
    getUpcomingExpenses,
    addRecurringExpense,
    updateRecurringExpense,
    toggleRecurringExpense,
    processOccurrence
  } = useRecurringExpenses();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<RecurringExpense | null>(null);
  const [isProcessingDialogOpen, setIsProcessingDialogOpen] = useState(false);
  const [processingExpense, setProcessingExpense] = useState<(RecurringExpense & { nextOccurrence: string }) | null>(null);
  const [processingPaymentMethod, setProcessingPaymentMethod] = useState<PaymentMethod>('cash');
  
  const handleProcessClick = (expense: RecurringExpense & { nextOccurrence: string }) => {
    setProcessingExpense(expense);
    setProcessingPaymentMethod(expense.paymentMethod || 'cash');
    setIsProcessingDialogOpen(true);
  };

  const handleProcessConfirm = async () => {
    if (!processingExpense) return;
    
    try {
      await processOccurrence(processingExpense.id, processingPaymentMethod);
      setIsProcessingDialogOpen(false);
      setProcessingExpense(null);
    } catch (error) {
      console.error("Error processing occurrence:", error);
    }
  };
  
  const handleEditClick = (expense: RecurringExpense) => {
    setEditingExpense(expense);
  };
  
  const handleUpdateExpense = async (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingExpense) return;
    
    try {
      await updateRecurringExpense(editingExpense.id, data);
      setEditingExpense(null);
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };
  
  const handleAddRecurringExpense = async (data: Omit<RecurringExpense, 'id' | 'createdAt' | 'updatedAt'>) => {
    await addRecurringExpense(data);
  };
  
  const filteredExpenses = recurringExpenses.filter(expense => 
    expense.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (expense.notes && expense.notes.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const upcomingExpenses = getUpcomingExpenses(30);
  
  const formatFrequency = (expense: RecurringExpense) => {
    switch (expense.frequency) {
      case 'daily': return 'Quotidien';
      case 'weekly': return 'Hebdomadaire';
      case 'monthly': return 'Mensuel';
      case 'quarterly': return 'Trimestriel';
      case 'yearly': return 'Annuel';
      case 'custom': return `Tous les ${expense.customDays} jours`;
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(parseISO(dateString), 'P', { locale: fr });
  };
  
  const formatPaymentMethod = (method?: PaymentMethod) => {
    if (!method) return 'N/A';
    
    switch (method) {
      case 'cash': return 'Espèces';
      case 'card': return 'Carte';
      case 'bank_transfer': return 'Virement bancaire';
      case 'mobile_money': return 'Mobile Money';
      case 'check': return 'Chèque';
      case 'credit': return 'Crédit';
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Dépenses Récurrentes</h1>
          <p className="text-muted-foreground mt-1">
            Gérez les dépenses périodiques et automatisées
          </p>
        </div>
        <Button className="mt-4 sm:mt-0" onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nouvelle Dépense Récurrente
        </Button>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-6">
          <TabsTrigger value="all">Toutes les dépenses</TabsTrigger>
          <TabsTrigger value="upcoming">À venir (30 jours)</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Liste des dépenses récurrentes</CardTitle>
              <CardDescription>Voir et gérer toutes vos dépenses périodiques</CardDescription>
              <div className="mt-4 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre ou description..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Fréquence</TableHead>
                    <TableHead>Date de début</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date de fin</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex flex-col items-center gap-2">
                          <Clock className="h-8 w-8 animate-spin text-primary" />
                          <p>Chargement des dépenses récurrentes...</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredExpenses.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <p className="text-muted-foreground">Aucune dépense récurrente trouvée</p>
                        <Button
                          variant="outline"
                          className="mt-4"
                          onClick={() => setIsCreateDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Créer une dépense récurrente
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <TableRow key={expense.id}>
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell>€{expense.amount.toFixed(2)}</TableCell>
                        <TableCell>{formatFrequency(expense)}</TableCell>
                        <TableCell>{formatDate(expense.startDate)}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {expense.isActive ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1.5">
                                <Check className="h-3 w-3" />
                                Actif
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="bg-slate-100 text-slate-800 flex items-center gap-1.5">
                                <XCircle className="h-3 w-3" />
                                Inactif
                              </Badge>
                            )}
                            {expense.isAutoPaid && (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800 flex items-center gap-1.5">
                                <CreditCard className="h-3 w-3" />
                                Auto
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {expense.endDate ? formatDate(expense.endDate) : "Aucune"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditClick(expense)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Switch
                              checked={expense.isActive}
                              onCheckedChange={(checked) => toggleRecurringExpense(expense.id, checked)}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle>Dépenses à venir (30 prochains jours)</CardTitle>
              <CardDescription>Prévisions des paiements à effectuer</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingExpenses.length === 0 ? (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Aucune dépense à venir</AlertTitle>
                  <AlertDescription>
                    Vous n'avez pas de dépenses récurrentes prévues dans les 30 prochains jours.
                  </AlertDescription>
                </Alert>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Titre</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Date prévue</TableHead>
                      <TableHead>Méthode de paiement</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingExpenses.map((expense) => (
                      <TableRow key={`${expense.id}-${expense.nextOccurrence}`}>
                        <TableCell className="font-medium">{expense.title}</TableCell>
                        <TableCell>€{expense.amount.toFixed(2)}</TableCell>
                        <TableCell className="flex items-center gap-1.5">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {formatDate(expense.nextOccurrence)}
                        </TableCell>
                        <TableCell>
                          {expense.isAutoPaid 
                            ? (
                              <Badge variant="outline" className="bg-blue-100 text-blue-800">
                                Auto: {formatPaymentMethod(expense.paymentMethod)}
                              </Badge>
                            ) 
                            : "Manuel"
                          }
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 flex items-center gap-1.5 w-fit">
                            <Repeat className="h-3 w-3" />
                            {formatFrequency(expense)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-sm"
                            onClick={() => handleProcessClick(expense)}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Traiter
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <RecurringExpenseDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSubmit={handleAddRecurringExpense}
        isSubmitting={isLoading}
      />
      
      {editingExpense && (
        <RecurringExpenseDialog
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSubmit={handleUpdateExpense}
          isSubmitting={isLoading}
          initialData={editingExpense}
          isEditing
        />
      )}
      
      <Dialog open={isProcessingDialogOpen} onOpenChange={setIsProcessingDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Traiter une dépense récurrente</DialogTitle>
            <DialogDescription>
              Confirmez le traitement de cette dépense pour la période en cours.
            </DialogDescription>
          </DialogHeader>
          
          {processingExpense && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dépense</p>
                  <p className="font-medium">{processingExpense.title}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Montant</p>
                  <p className="font-medium">€{processingExpense.amount.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date prévue</p>
                  <p className="font-medium">{formatDate(processingExpense.nextOccurrence)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Fréquence</p>
                  <p className="font-medium">{formatFrequency(processingExpense)}</p>
                </div>
              </div>
              
              {!processingExpense.isAutoPaid && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Méthode de paiement</p>
                  <Select 
                    value={processingPaymentMethod} 
                    onValueChange={(value) => setProcessingPaymentMethod(value as PaymentMethod)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une méthode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">Espèces</SelectItem>
                      <SelectItem value="card">Carte</SelectItem>
                      <SelectItem value="bank_transfer">Virement bancaire</SelectItem>
                      <SelectItem value="mobile_money">Mobile Money</SelectItem>
                      <SelectItem value="check">Chèque</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsProcessingDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleProcessConfirm} disabled={isLoading}>
              {isLoading ? 'Traitement...' : 'Confirmer le paiement'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RecurringExpenses;
