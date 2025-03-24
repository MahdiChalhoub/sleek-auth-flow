
import { useState, useMemo } from 'react';
import { Transaction, TransactionStatus } from '@/models/transaction';

export function useTransactionFilters(allTransactions: Transaction[]) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TransactionStatus | "all">("all");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [branchFilter, setBranchFilter] = useState<string>("all");

  const filteredTransactions = useMemo(() => {
    return allTransactions
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
  }, [allTransactions, searchQuery, statusFilter, branchFilter, sortDirection]);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortDirection,
    setSortDirection,
    branchFilter,
    setBranchFilter,
    filteredTransactions
  };
}
