
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Trash2, 
  Edit, 
  MoreVertical, 
  FileText, 
  UnlockIcon, 
  LockIcon, 
  ShieldCheckIcon, 
  ShieldIcon 
} from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { 
  Transaction, 
  TransactionStatus 
} from '@/models/transaction';
import { format } from 'date-fns';

export interface TransactionsListProps {
  transactions: Transaction[];
  onChangeStatus: (transactionId: string, newStatus: TransactionStatus) => void;
  onDeleteTransaction: (transactionId: string) => void;
  onViewLedger: (transaction: Transaction) => void;
}

const TransactionsList: React.FC<TransactionsListProps> = ({
  transactions,
  onChangeStatus,
  onDeleteTransaction,
  onViewLedger
}) => {
  // Group transactions by date
  const groupTransactionsByDate = () => {
    const grouped: Record<string, Transaction[]> = {};
    
    transactions.forEach(transaction => {
      const date = format(new Date(transaction.createdAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    
    return grouped;
  };

  const groupedTransactions = groupTransactionsByDate();
  
  // Get the status badge
  const getStatusBadge = (status: TransactionStatus) => {
    switch (status) {
      case 'open':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">Open</Badge>;
      case 'locked':
        return <Badge variant="outline" className="bg-amber-50 text-amber-700 hover:bg-amber-50">Locked</Badge>;
      case 'verified':
        return <Badge variant="outline" className="bg-green-50 text-green-700 hover:bg-green-50">Verified</Badge>;
      case 'secure':
        return <Badge variant="outline" className="bg-purple-50 text-purple-700 hover:bg-purple-50">Secure</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  // Get type badge
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'sale':
        return <Badge className="bg-emerald-500 hover:bg-emerald-600">Sale</Badge>;
      case 'expense':
        return <Badge className="bg-red-500 hover:bg-red-600">Expense</Badge>;
      case 'transfer':
        return <Badge className="bg-blue-500 hover:bg-blue-600">Transfer</Badge>;
      case 'adjustment':
        return <Badge className="bg-amber-500 hover:bg-amber-600">Adjustment</Badge>;
      case 'income':
        return <Badge className="bg-indigo-500 hover:bg-indigo-600">Income</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(groupedTransactions)
        .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
        .map(([date, dayTransactions]) => (
          <Card key={date}>
            <CardHeader className="py-3">
              <CardTitle className="text-base font-medium">
                {format(new Date(date), 'MMMM d, yyyy')}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-0">
              <div className="divide-y">
                {dayTransactions.map(transaction => (
                  <div 
                    key={transaction.id}
                    className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        {getTypeBadge(transaction.type)}
                      </div>
                      
                      <div>
                        <h3 className="font-medium">{transaction.description}</h3>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <span>${transaction.amount.toFixed(2)}</span>
                          <span>•</span>
                          <span>{format(new Date(transaction.createdAt), 'h:mm a')}</span>
                          {transaction.branchId && (
                            <>
                              <span>•</span>
                              <span>Branch: {transaction.branchId}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(transaction.status)}
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => onViewLedger(transaction)}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Ledger
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(transaction.id, 'open')}>
                            <UnlockIcon className="mr-2 h-4 w-4" />
                            Set as Open
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(transaction.id, 'locked')}>
                            <LockIcon className="mr-2 h-4 w-4" />
                            Set as Locked
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(transaction.id, 'verified')}>
                            <ShieldIcon className="mr-2 h-4 w-4" />
                            Set as Verified
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onChangeStatus(transaction.id, 'secure')}>
                            <ShieldCheckIcon className="mr-2 h-4 w-4" />
                            Set as Secure
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => onDeleteTransaction(transaction.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
    </div>
  );
};

export default TransactionsList;
