
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  CheckCircle, 
  XCircle, 
  AlertCircle 
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Register, DiscrepancyResolution } from '@/models/transaction';

interface RegisterSessionsListProps {
  sessions: Register[];
}

const RegisterSessionsList: React.FC<RegisterSessionsListProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/30">
        <p className="text-muted-foreground">No register sessions found.</p>
      </div>
    );
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getDiscrepancyStatusLabel = (resolution?: DiscrepancyResolution) => {
    switch (resolution) {
      case 'deduct_salary':
        return 'Deducted from Salary';
      case 'ecart_caisse':
        return 'Écart de Caisse';
      case 'approved':
        return 'Approved';
      default:
        return 'Pending';
    }
  };

  const getTotalBalance = (balances: Record<string, number>) => {
    return Object.values(balances).reduce((sum, value) => sum + value, 0);
  };

  const getTotalDiscrepancy = (discrepancies?: Record<string, number>) => {
    if (!discrepancies) return 0;
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Register</TableHead>
            <TableHead>Opened</TableHead>
            <TableHead>Closed</TableHead>
            <TableHead>Opening Balance</TableHead>
            <TableHead>Closing Balance</TableHead>
            <TableHead>Discrepancy</TableHead>
            <TableHead>Resolution</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sessions.map((session) => {
            const totalDiscrepancy = getTotalDiscrepancy(session.discrepancies);
            const hasDiscrepancy = session.discrepancies && totalDiscrepancy !== 0;
            
            return (
              <TableRow key={session.id}>
                <TableCell>
                  {session.isOpen ? (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      <CheckCircle className="h-3.5 w-3.5 mr-1" />
                      Open
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                      <XCircle className="h-3.5 w-3.5 mr-1" />
                      Closed
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="font-medium">{session.name}</TableCell>
                <TableCell>{formatDate(session.openedAt)}</TableCell>
                <TableCell>{formatDate(session.closedAt)}</TableCell>
                <TableCell>{formatCurrency(getTotalBalance(session.openingBalance))}</TableCell>
                <TableCell>
                  {session.closedAt 
                    ? formatCurrency(getTotalBalance(session.currentBalance)) 
                    : "N/A"}
                </TableCell>
                <TableCell>
                  {hasDiscrepancy ? (
                    <span className={`flex items-center ${totalDiscrepancy > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      <AlertCircle className="h-3.5 w-3.5 mr-1" />
                      {formatCurrency(totalDiscrepancy)}
                    </span>
                  ) : (
                    session.closedAt ? (
                      <span className="text-gray-500">None</span>
                    ) : (
                      "N/A"
                    )
                  )}
                </TableCell>
                <TableCell>
                  {hasDiscrepancy ? (
                    <Badge variant={session.discrepancyResolution ? 'outline' : 'secondary'}
                           className={session.discrepancyResolution 
                              ? "bg-blue-50 text-blue-700 border-blue-200" 
                              : ""}>
                      {getDiscrepancyStatusLabel(session.discrepancyResolution)}
                    </Badge>
                  ) : (
                    session.closedAt ? (
                      <span className="text-gray-500">N/A</span>
                    ) : (
                      "N/A"
                    )
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default RegisterSessionsList;
