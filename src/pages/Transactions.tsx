
import React, { useState } from 'react';
import { useAuth } from '@/providers/AuthProvider'; // Updated import path
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTransactions } from '@/hooks/useTransactions';
import TransactionHeader from '@/components/transactions/TransactionHeader';
import TransactionsList from '@/components/transactions/TransactionsList';
import TransactionFilters from '@/components/transactions/TransactionFilters';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const Transactions: React.FC = () => {
  const { currentBusiness } = useAuth();
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [branchFilter, setBranchFilter] = useState<string>('all');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  
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
  
  // Mock branches for the demo
  const branches = businesses.map(business => ({
    id: `branch-${business.id}`,
    name: `${business.name} Branch`,
    businessId: business.id
  }));
  
  const { 
    transactions,
    isLoading,
    error,
    deleteTransaction,
  } = useTransactions();
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };
  
  const applyFilters = () => {
    // In a real app, this would apply filters to the transaction query
    console.log('Applying filters:', { statusFilter, branchFilter, dateRange });
  };
  
  const exportTransactions = () => {
    // In a real app, this would export the transactions
    console.log('Exporting transactions');
  };
  
  const handlePageChange = (page: number) => {
    // In a real app, this would change the page
    console.log('Changing to page:', page);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <TransactionHeader onExport={exportTransactions} />
        <Button className="flex items-center gap-2" onClick={() => console.log('New transaction')}>
          <Plus className="h-4 w-4" />
          New Transaction
        </Button>
      </div>
      
      <Card>
        <CardHeader className="py-4">
          <CardTitle className="text-xl">Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters 
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            branchFilter={branchFilter}
            setBranchFilter={setBranchFilter}
            sortDirection={sortDirection}
            setSortDirection={setSortDirection}
            branches={branches}
          />
          
          <TransactionsList 
            transactions={transactions}
            loading={isLoading}
            currentPage={1}
            totalPages={1}
            onPageChange={handlePageChange}
            onDelete={deleteTransaction}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Transactions;
