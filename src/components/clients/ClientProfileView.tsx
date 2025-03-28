
import React, { useState } from 'react';
import { Client } from '@/models/client';
import { ClientTransaction } from '@/models/clientTransaction';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ClientInfoCard } from './ClientInfoCard';
import { ClientFinancialCard } from './ClientFinancialCard';
import { ClientTransactionsTable } from './ClientTransactionsTable';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Trash2, CreditCard, AlertCircle } from 'lucide-react';
import { clientsApi } from '@/api/clientsApi';

interface ClientProfileViewProps {
  client: Client;
  transactions: ClientTransaction[];
  creditSales?: any[];
  areTransactionsLoading: boolean;
  areCreditSalesLoading?: boolean;
  onRecordPayment: (amount: number, description?: string) => Promise<any>;
  onDeleteClient: () => Promise<void>;
}

export const ClientProfileView: React.FC<ClientProfileViewProps> = ({
  client,
  transactions,
  creditSales = [],
  areTransactionsLoading,
  areCreditSalesLoading = false,
  onRecordPayment,
  onDeleteClient
}) => {
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDescription, setPaymentDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paymentAmount || isNaN(parseFloat(paymentAmount))) {
      toast({
        title: 'Invalid amount',
        description: 'Please enter a valid payment amount',
        variant: 'destructive',
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      const amount = parseFloat(paymentAmount);
      await onRecordPayment(amount, paymentDescription || 'Payment received');
      
      toast({
        title: 'Payment recorded',
        description: `Successfully recorded payment of ${formatCurrency(amount)}`,
      });
      
      setIsPaymentDialogOpen(false);
      setPaymentAmount('');
      setPaymentDescription('');
    } catch (error) {
      toast({
        title: 'Error recording payment',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    
    try {
      await onDeleteClient();
      
      toast({
        title: 'Client deleted',
        description: 'Client has been successfully deleted',
      });
      
      navigate('/clients');
    } catch (error) {
      toast({
        title: 'Error deleting client',
        description: error instanceof Error ? error.message : 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
      setIsDeleteDialogOpen(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold">Client Profile</h1>
        <div className="flex gap-2 mt-2 md:mt-0">
          <Button 
            variant="default" 
            disabled={client.outstandingBalance === 0}
            onClick={() => setIsPaymentDialogOpen(true)}
          >
            <CreditCard className="mr-2 h-4 w-4" />
            Record Payment
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Client
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          <ClientInfoCard client={client} />
        </div>
        <div>
          <ClientFinancialCard client={client} />
        </div>
      </div>
      
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="credit-sales">Credit Sales</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                All financial interactions with this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="invoices">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>
                All invoices issued to this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions.filter(t => t.type === 'invoice')} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle>Payments</CardTitle>
              <CardDescription>
                All payments received from this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ClientTransactionsTable 
                transactions={transactions.filter(t => t.type === 'payment')} 
                isLoading={areTransactionsLoading} 
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="credit-sales">
          <Card>
            <CardHeader>
              <CardTitle>Credit Sales</CardTitle>
              <CardDescription>
                All credit sales for this client
              </CardDescription>
            </CardHeader>
            <CardContent>
              {areCreditSalesLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-12 bg-muted animate-pulse rounded-md"></div>
                  ))}
                </div>
              ) : creditSales.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No credit sales found.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Sale Reference</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Paid Amount</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {creditSales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell>{formatDate(sale.created_at)}</TableCell>
                        <TableCell>{sale.sale_id}</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.amount)}</TableCell>
                        <TableCell className="text-right">{formatCurrency(sale.paid_amount)}</TableCell>
                        <TableCell>{formatDate(sale.due_date)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              sale.status === 'paid'
                                ? 'default'
                                : sale.status === 'partially_paid'
                                ? 'secondary'
                                : sale.status === 'overdue'
                                ? 'destructive'
                                : 'outline'
                            }
                            className="capitalize"
                          >
                            {sale.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notes">
          <Card>
            <CardHeader>
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Client-specific notes and remarks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg">
                {client.notes ? (
                  <p>{client.notes}</p>
                ) : (
                  <p className="text-muted-foreground">No notes available for this client.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Payment Dialog */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a payment from {client.name}
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handlePaymentSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="amount" className="text-sm font-medium">
                  Payment Amount
                </label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0.00"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description (Optional)
                </label>
                <Input
                  id="description"
                  placeholder="Payment for invoice #..."
                  value={paymentDescription}
                  onChange={(e) => setPaymentDescription(e.target.value)}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsPaymentDialogOpen(false)}
                disabled={isProcessing}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : 'Record Payment'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Client</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this client? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {client.outstandingBalance > 0 && (
              <div className="flex items-center p-3 mb-4 bg-red-100 text-red-800 rounded-md">
                <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <p className="text-sm">
                  Warning: This client has an outstanding balance of {formatCurrency(client.outstandingBalance)}.
                  Deleting this client will remove all financial records.
                </p>
              </div>
            )}
            
            <p>
              This will permanently delete <strong>{client.name}</strong> and all associated data.
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete} 
              disabled={isProcessing}
            >
              {isProcessing ? 'Deleting...' : 'Delete Client'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Helper imports for credit sales table
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { formatDate } from '@/lib/utils';
