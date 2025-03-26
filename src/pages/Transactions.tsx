
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, DownloadCloud, Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { mockTransactions, Transaction, mockLedgerEntries, mockBranches } from "@/models/transaction";
import { useToast } from "@/hooks/use-toast";
import TransactionFilters from "@/components/transactions/TransactionFilters";
import TransactionsList from "@/components/transactions/TransactionsList";
import TransactionLedgerDialog from "@/components/transactions/TransactionLedgerDialog";
import BackupDialog from "@/components/transactions/BackupDialog";
import { useTransactionFilters } from "@/hooks/useTransactionFilters";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ROUTES } from "@/constants/routes";

// Form schema for creating a new transaction
const transactionFormSchema = z.object({
  amount: z.string().min(1).transform(val => parseFloat(val)),
  description: z.string().min(5, { message: "Description must be at least 5 characters" }),
  paymentMethod: z.enum(["cash", "card", "bank", "wave", "mobile", "not_specified"]),
  branchId: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

const Transactions = () => {
  const { toast: toastUI } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  const [showLedgerPreview, setShowLedgerPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmittingTransaction, setIsSubmittingTransaction] = useState(false);
  
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: "",
      description: "",
      paymentMethod: "cash",
      branchId: "",
    },
  });
  
  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortDirection,
    setSortDirection,
    branchFilter,
    setBranchFilter,
    filteredTransactions
  } = useTransactionFilters(transactions);
  
  // Fetch transactions (simulated)
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In a real app, fetch from API
        setTransactions(mockTransactions);
      } catch (error) {
        toast.error("Failed to load transactions");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTransactions();
  }, []);
  
  const handleChangeStatus = (transactionId: string, newStatus: "open" | "locked" | "verified" | "secure") => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === transactionId) {
        // Check for valid status transitions
        if (
          (transaction.status === "open" && newStatus !== "verified") || 
          (transaction.status === "locked" && newStatus !== "open") ||
          (transaction.status === "verified" && (newStatus === "secure" || newStatus === "locked"))
        ) {
          return {
            ...transaction,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            // Add additional metadata for audit purposes
            ...(newStatus === "locked" && { lockedAt: new Date().toISOString(), lockedBy: "Current User" }),
            ...(newStatus === "verified" && { verifiedAt: new Date().toISOString(), verifiedBy: "Current User" })
          };
        } else {
          // Invalid transition
          toast.error(`Invalid status transition from ${transaction.status} to ${newStatus}`);
          return transaction;
        }
      }
      return transaction;
    }));
    
    toast.success(`Transaction status updated`, {
      description: `Transaction has been ${newStatus}`,
    });
  };

  const handleDeleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter(t => t.id !== transactionId));
    
    toast.success("Transaction deleted", {
      description: "The transaction has been permanently deleted",
    });
  };
  
  const handleShowLedger = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowLedgerPreview(true);
  };
  
  const handleToggleOfflineMode = () => {
    setIsSyncing(true);
    
    // Simulate sync process
    setTimeout(() => {
      setIsOfflineMode(!isOfflineMode);
      setIsSyncing(false);
      
      if (!isOfflineMode) {
        toastUI({
          title: "Offline Mode Enabled",
          description: "Changes will be stored locally and synced when you're back online.",
          variant: "default",
        });
      } else {
        toastUI({
          title: "Online Mode Restored",
          description: "All changes have been synced to the server.",
          variant: "default",
        });
      }
    }, 1500);
  };
  
  const getLedgerEntries = (transactionId: string) => {
    return mockLedgerEntries.filter(entry => entry.transactionId === transactionId);
  };
  
  const handleBackupData = () => {
    setShowBackupDialog(true);
  };
  
  const generateBackupFile = (type: 'json' | 'sql') => {
    setTimeout(() => {
      setShowBackupDialog(false);
      toastUI({
        title: "Backup Created Successfully",
        description: `Your ${type.toUpperCase()} backup is ready to download.`,
        variant: "default",
      });
    }, 1500);
  };
  
  const handleCreateTransaction = async (data: TransactionFormValues) => {
    setIsSubmittingTransaction(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Generate a new transaction ID
      const newId = `txn-${Date.now().toString(36)}`;
      
      // Create the new transaction object
      const newTransaction: Transaction = {
        id: newId,
        amount: data.amount, // This is now correctly typed as a number through the zod transform
        status: "open",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: "Current User",
        description: data.description,
        paymentMethod: data.paymentMethod,
        branchId: data.branchId,
        journalEntries: []
      };
      
      // Add the new transaction to the state
      setTransactions(prev => [newTransaction, ...prev]);
      
      toast.success("Transaction created successfully");
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Failed to create transaction");
      console.error(error);
    } finally {
      setIsSubmittingTransaction(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to={ROUTES.HOME}>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Transactions</h1>
            
            {isOfflineMode && (
              <Badge variant="outline" className="ml-2 bg-amber-100 text-amber-800 border-amber-200">
                Offline Mode
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex items-center mr-4">
              <span className="text-sm mr-2">Offline Mode</span>
              <Switch 
                checked={isOfflineMode} 
                onCheckedChange={handleToggleOfflineMode}
                disabled={isSyncing}
              />
              {isSyncing && <Loader2 className="ml-2 h-4 w-4 animate-spin text-primary" />}
            </div>
            
            <Button variant="outline" onClick={handleBackupData} className="mr-2" disabled={isLoading}>
              <DownloadCloud className="h-4 w-4 mr-2" />
              Backup
            </Button>
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button disabled={isLoading}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Transaction
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Transaction</DialogTitle>
                  <DialogDescription>
                    Create a new financial transaction in the system.
                  </DialogDescription>
                </DialogHeader>
                
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(handleCreateTransaction)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="0.00" 
                              {...field} 
                              type="number"
                              step="0.01"
                              min="0.01"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Enter transaction details..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="paymentMethod"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Payment Method</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cash">Cash</SelectItem>
                              <SelectItem value="card">Card</SelectItem>
                              <SelectItem value="bank">Bank Transfer</SelectItem>
                              <SelectItem value="wave">Wave</SelectItem>
                              <SelectItem value="mobile">Mobile Money</SelectItem>
                              <SelectItem value="not_specified">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="branchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Branch</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select branch" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {mockBranches.map(branch => (
                                <SelectItem key={branch.id} value={branch.id}>
                                  {branch.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsDialogOpen(false)}
                        disabled={isSubmittingTransaction}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={isSubmittingTransaction}>
                        {isSubmittingTransaction ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Transaction"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View and manage all transactions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TransactionFilters 
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              branchFilter={branchFilter}
              setBranchFilter={setBranchFilter}
              sortDirection={sortDirection}
              setSortDirection={setSortDirection}
              branches={mockBranches}
            />
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredTransactions && filteredTransactions.length > 0 ? (
              <TransactionsList 
                transactions={filteredTransactions}
                onViewLedger={handleShowLedger}
                onChangeStatus={handleChangeStatus}
                onDeleteTransaction={handleDeleteTransaction}
              />
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">No transactions found</p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Transaction
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      <TransactionLedgerDialog 
        open={showLedgerPreview}
        onOpenChange={setShowLedgerPreview}
        transaction={selectedTransaction}
        ledgerEntries={selectedTransaction ? getLedgerEntries(selectedTransaction.id) : []}
      />
      
      <BackupDialog 
        open={showBackupDialog}
        onOpenChange={setShowBackupDialog}
        onBackupGenerate={generateBackupFile}
      />
    </div>
  );
};

export default Transactions;
