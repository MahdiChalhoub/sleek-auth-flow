
import React from 'react';
import { Client } from '@/models/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface ClientFinancialCardProps {
  client: Client;
}

export const ClientFinancialCard: React.FC<ClientFinancialCardProps> = ({ client }) => {
  // Get financial data from client
  const totalDue = client.financialAccount?.totalDue || 0;
  const totalPaid = client.financialAccount?.totalPaid || 0;
  const availableCredit = client.financialAccount?.availableCredit || 0;
  const creditLimit = client.creditLimit || 0;

  // Calculate credit utilization percentage
  const creditUtilization = creditLimit > 0 ? (totalDue / creditLimit) * 100 : 0;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Total Due */}
          <div className="p-4 bg-muted rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Outstanding Balance</span>
            </div>
            <p className={`text-2xl font-bold ${totalDue > 0 ? 'text-red-500' : 'text-green-500'}`}>
              {formatCurrency(totalDue)}
            </p>
          </div>
          
          {/* Credit Information */}
          {client.type === 'credit' && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Credit Limit</span>
                </div>
                <span className="text-sm font-medium">{formatCurrency(creditLimit)}</span>
              </div>
              
              {/* Credit utilization bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                <div 
                  className={`h-full ${
                    creditUtilization > 90 
                      ? 'bg-red-500' 
                      : creditUtilization > 70 
                        ? 'bg-orange-500' 
                        : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(creditUtilization, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs mt-1">
                <span className="text-muted-foreground">Used: {formatCurrency(totalDue)}</span>
                <span className="text-muted-foreground">Available: {formatCurrency(creditLimit - totalDue)}</span>
              </div>
            </div>
          )}
          
          {/* Loyalty Points */}
          {availableCredit > 0 && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-medium">Loyalty Points</span>
              </div>
              <p className="text-2xl font-bold text-purple-500">
                {availableCredit} points
              </p>
              <p className="text-xs text-muted-foreground">
                Value: {formatCurrency(availableCredit * 0.01)}
              </p>
            </div>
          )}
          
          {/* Summary data */}
          <div className="space-y-2 text-sm pt-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Paid (All Time):</span>
              <span>{formatCurrency(totalPaid)}</span>
            </div>
            {client.type === 'credit' && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credit Utilization:</span>
                <span className={
                  creditUtilization > 90 
                    ? 'text-red-500' 
                    : creditUtilization > 70 
                      ? 'text-orange-500' 
                      : 'text-green-500'
                }>
                  {creditUtilization.toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
