import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  ArrowLeft, 
  Filter, 
  Search, 
  Edit, 
  Lock, 
  Unlock, 
  CheckCircle, 
  ShieldCheck, 
  Trash2, 
  ArrowUpDown, 
  Calendar, 
  BookOpen,
  Building,
  DownloadCloud,
  Database
} from "lucide-react";
import { toast } from "sonner";
import { 
  mockTransactions, 
  Transaction, 
  TransactionStatus, 
  LedgerEntry, 
  mockLedgerEntries, 
  mockBranches 
} from "@/models/transaction";
import TransactionStatusBadge from "@/components/TransactionStatusBadge";
import { useToast } from "@/hooks/use-toast";

const Transactions = () => {
  const { toast: toastUI } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [branchFilter, setBranchFilter] = useState<string>("all");
  
  const [showLedgerPreview, setShowLedgerPreview] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [showBackupDialog, setShowBackupDialog] = useState(false);
  
  const handleChangeStatus = (transactionId: string, newStatus: TransactionStatus) => {
    setTransactions(transactions.map(transaction => {
      if (transaction.id === transactionId) {
        return {
          ...transaction,
          status: newStatus,
          updatedAt: new Date().toISOString()
        };
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
    setIsOfflineMode(!isOfflineMode);
    
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
  };
  
  const getLedgerEntries = (transactionId: string): LedgerEntry[] => {
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

  const filteredTransactions = transactions
    .filter(transaction => {
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.createdBy.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod.toLowerCase().includes(searchLower)
      );
    })
    .filter(transaction => {
      if (statusFilter === "all") return true;
      return transaction.status === statusFilter;
    })
    .filter(transaction => {
      if (branchFilter === "all") return true;
      return transaction.branchId === branchFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/home">
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
              />
            </div>
            
            <Button variant="outline" onClick={handleBackupData} className="mr-2">
              <DownloadCloud className="h-4 w-4 mr-2" />
              Backup
            </Button>
            
            <Button>
              New Transaction
            </Button>
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
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search transactions..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-9 glass-input"
                />
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as TransactionStatus | "all")}
                >
                  <SelectTrigger className="w-[160px] glass-input">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      <SelectValue placeholder="Filter by status" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="locked">Locked</SelectItem>
                    <SelectItem value="verified">Verified</SelectItem>
                    <SelectItem value="secure">Secure</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select
                  value={branchFilter}
                  onValueChange={(value) => setBranchFilter(value)}
                >
                  <SelectTrigger className="w-[160px] glass-input">
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <SelectValue placeholder="Filter by branch" />
                    </div>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Branches</SelectItem>
                    {mockBranches.map(branch => (
                      <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
                  className="glass-input"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")} className="cursor-pointer">
                      <div className="flex items-center">
                        Date 
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </div>
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTransactions.map((transaction) => (
                      <TableRow key={transaction.id} className="group hover:bg-muted/30 transition-colors">
                        <TableCell className="font-medium">
                          {new Date(transaction.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{transaction.description}</TableCell>
                        <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{transaction.paymentMethod}</TableCell>
                        <TableCell>
                          <TransactionStatusBadge status={transaction.status} />
                        </TableCell>
                        <TableCell>{transaction.createdBy}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => handleShowLedger(transaction)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              title="View Ledger Entries"
                            >
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            
                            {transaction.status === "open" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "locked")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "locked")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {transaction.status === "locked" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "open")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Unlock className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "verified")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {transaction.status === "verified" && (
                              <>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "locked")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <Lock className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleChangeStatus(transaction.id, "secure")}
                                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <ShieldCheck className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                            
                            {transaction.status !== "secure" && (
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDeleteTransaction(transaction.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {selectedTransaction && (
        <Dialog open={showLedgerPreview} onOpenChange={setShowLedgerPreview}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Journal Entries</DialogTitle>
              <DialogDescription>
                Double-entry ledger records for transaction {selectedTransaction.id}
              </DialogDescription>
            </DialogHeader>
            
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Transaction Details</h3>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <div>
                      <span className="text-muted-foreground">Description:</span>
                      <p>{selectedTransaction.description}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Amount:</span>
                      <p>${selectedTransaction.amount.toFixed(2)}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Date:</span>
                      <p>{new Date(selectedTransaction.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Payment Method:</span>
                      <p className="capitalize">{selectedTransaction.paymentMethod}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium">Ledger Entries</h3>
                  <Table className="mt-1">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Account</TableHead>
                        <TableHead>Debit</TableHead>
                        <TableHead>Credit</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getLedgerEntries(selectedTransaction.id).map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell className="capitalize">{entry.accountType.replace('_', ' ')}</TableCell>
                          <TableCell>{entry.isDebit ? `$${entry.amount.toFixed(2)}` : ""}</TableCell>
                          <TableCell>{!entry.isDebit ? `$${entry.amount.toFixed(2)}` : ""}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p>Created by {selectedTransaction.createdBy} on {new Date(selectedTransaction.createdAt).toLocaleString()}</p>
                  {selectedTransaction.status === "verified" && selectedTransaction.verifiedBy && (
                    <p>Verified by {selectedTransaction.verifiedBy} on {new Date(selectedTransaction.verifiedAt || "").toLocaleString()}</p>
                  )}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={() => setShowLedgerPreview(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      
      <Dialog open={showBackupDialog} onOpenChange={setShowBackupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Backup Data</DialogTitle>
            <DialogDescription>
              Create a backup of your POS data. Choose your preferred format.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button 
                variant="outline" 
                className="h-auto p-4 flex flex-col items-center justify-center text-center space-y-2 border-2"
                onClick={() => generateBackupFile('json')}
              >
                <Database className="h-12 w-12 mb-2 text-blue-500" />
                <span className="font-medium">JSON Backup</span>
                <span className="text-xs text-muted-foreground">Complete data in JSON format</span>
              </Button>
              
              <Button
                variant="outline"
                className="h-auto p-4 flex flex-col items-center justify-center text-center space-y-2 border-2"
                onClick={() => generateBackupFile('sql')}
              >
                <Database className="h-12 w-12 mb-2 text-green-500" />
                <span className="font-medium">SQL Backup</span>
                <span className="text-xs text-muted-foreground">SQL dump for database restore</span>
              </Button>
            </div>
            
            <div>
              <h3 className="text-sm font-medium mb-2">Auto-Backup Settings</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm">Frequency</label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm">Storage Location</label>
                  <Select defaultValue="local">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="local">Local</SelectItem>
                      <SelectItem value="gdrive">Google Drive</SelectItem>
                      <SelectItem value="dropbox">Dropbox</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowBackupDialog(false)}>
              Cancel
            </Button>
            <Button>
              Save Settings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Transactions;
