
import React from 'react';
import { Client } from '@/models/client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { formatDate, formatCurrency } from '@/lib/utils';

interface ClientsTableProps {
  clients: Client[];
  isLoading: boolean;
  onViewClient: (clientId: string) => void;
}

export const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
  isLoading,
  onViewClient
}) => {
  // Helper function to generate client type badge
  const getClientTypeBadge = (client: Client) => {
    if (client.isVip) {
      return <Badge className="bg-amber-100 text-amber-800 border-amber-300">VIP</Badge>;
    }
    
    switch (client.type) {
      case 'wholesale':
        return <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300">Wholesale</Badge>;
      case 'credit':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-300">Credit</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 border-gray-300">Regular</Badge>;
    }
  };

  if (clients.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No clients found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Last Visit</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.name}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    {client.email && <span className="text-sm">{client.email}</span>}
                    {client.phone && <span className="text-sm text-muted-foreground">{client.phone}</span>}
                  </div>
                </TableCell>
                <TableCell>{getClientTypeBadge(client)}</TableCell>
                <TableCell>{client.lastVisit ? formatDate(client.lastVisit) : 'Never'}</TableCell>
                <TableCell className="text-right">
                  {client.outstanding_balance ? formatCurrency(client.outstanding_balance) : '-'}
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => onViewClient(client.id)}>
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">View</span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};
