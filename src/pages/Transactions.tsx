
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionHeader } from '@/components/transactions/TransactionHeader';
import { TransactionsList } from '@/components/transactions/TransactionsList';
import { TransactionFilters } from '@/components/transactions/TransactionFilters';

const Transactions: React.FC = () => {
  const { currentBusiness } = useAuth();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  
  // Mocked businesses for demo
  const businesses = [
    {
      id: "business-1",
      name: "Main Business", 
      status: "active",
      ownerId: "user-1",
      active: true
    },
    {
      id: "business-2", 
      name: "Secondary Business",
      status: "active",
      ownerId: "user-1",
      active: true
    }
  ];
  
  const { 
    loading,
    transactions,
    setTransactions,
    currentPage,
    totalPages,
    handlePageChange,
    addTransaction,
    handleDeleteTransaction,
    handleSearchChange,
    applyFilters,
    exportTransactions,
    dateRange,
    setDateRange
  } = useTransactions();
  
  return (
    <div className="space-y-4">
      <TransactionHeader onExport={exportTransactions} />
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-xl">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters 
            onSearch={handleSearchChange}
            onApplyFilters={applyFilters}
            businesses={businesses}
            selectedBranches={selectedBranches}
            setSelectedBranches={setSelectedBranches}
            dateRange={dateRange}
            setDateRange={setDateRange}
          />
          
          <TransactionsList 
            transactions={transactions}
            loading={loading}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onDelete={handleDeleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
