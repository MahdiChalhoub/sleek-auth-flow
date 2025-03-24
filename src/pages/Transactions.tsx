
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Filter, Search, Edit, Lock, Unlock, CheckCircle, ShieldCheck, Trash2, ArrowUpDown, Calendar } from "lucide-react";
import { toast } from "sonner";
import { mockTransactions, Transaction, TransactionStatus } from "@/models/transaction";
import TransactionStatusBadge from "@/components/TransactionStatusBadge";

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

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

  const filteredTransactions = transactions
    .filter(transaction => {
      // Filter by search query
      const searchLower = searchQuery.toLowerCase();
      return (
        transaction.id.toLowerCase().includes(searchLower) ||
        transaction.description.toLowerCase().includes(searchLower) ||
        transaction.createdBy.toLowerCase().includes(searchLower) ||
        transaction.paymentMethod.toLowerCase().includes(searchLower)
      );
    })
    .filter(transaction => {
      // Filter by status
      if (statusFilter === "all") return true;
      return transaction.status === statusFilter;
    })
    .sort((a, b) => {
      // Sort by date
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
          </div>
          
          <Button>
            New Transaction
          </Button>
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
              
              <div className="flex gap-2">
                <Select
                  value={statusFilter}
                  onValueChange={(value) => setStatusFilter(value as TransactionStatus | "all")}
                >
                  <SelectTrigger className="w-[180px] glass-input">
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
    </div>
  );
};

export default Transactions;
