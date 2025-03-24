
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { RegisterSession, DiscrepancyResolution } from '@/models/transaction';
import { Calendar, Download, Filter, Search } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface RegisterSessionsListProps {
  sessions: RegisterSession[];
}

const RegisterSessionsList = ({ sessions }: RegisterSessionsListProps) => {
  const [filteredSessions, setFilteredSessions] = useState<RegisterSession[]>(sessions);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    
    applyFilters(term, filterStatus);
  };
  
  const handleStatusFilter = (value: string) => {
    setFilterStatus(value);
    applyFilters(searchTerm, value);
  };
  
  const applyFilters = (term: string, status: string) => {
    let filtered = sessions;
    
    // Apply search filter
    if (term) {
      filtered = filtered.filter(session => 
        session.cashierName.toLowerCase().includes(term) ||
        session.id.toLowerCase().includes(term)
      );
    }
    
    // Apply status filter
    if (status !== 'all') {
      if (status === 'discrepancy') {
        filtered = filtered.filter(session => 
          session.discrepancies && 
          Object.values(session.discrepancies).some(val => val !== 0)
        );
      } else if (status === 'balanced') {
        filtered = filtered.filter(session => 
          !session.discrepancies || 
          Object.values(session.discrepancies).every(val => val === 0)
        );
      } else if (status === 'open') {
        filtered = filtered.filter(session => !session.closedAt);
      } else if (status === 'closed') {
        filtered = filtered.filter(session => !!session.closedAt);
      }
    }
    
    setFilteredSessions(filtered);
  };
  
  const handleExport = (format: 'csv' | 'pdf') => {
    toast.success(`Exporting sessions as ${format.toUpperCase()}`, {
      description: `${filteredSessions.length} sessions will be exported.`
    });
    // Implementation would connect to actual export functionality
  };
  
  const getResolutionLabel = (resolution?: DiscrepancyResolution) => {
    switch (resolution) {
      case 'deduct_salary':
        return { label: 'Deducted from Salary', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' };
      case 'ecart_caisse':
        return { label: 'Écart de Caisse', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' };
      case 'approved':
        return { label: 'Approved', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' };
      case 'rejected':
        return { label: 'Rejected', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300' };
      case 'pending':
        return { label: 'Pending Approval', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' };
      default:
        return { label: 'No Discrepancy', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300' };
    }
  };
  
  const getTotalDiscrepancy = (session: RegisterSession) => {
    if (!session.discrepancies) return 0;
    
    return Object.values(session.discrepancies).reduce((sum, value) => sum + value, 0);
  };
  
  return (
    <Card className="shadow-sm animate-fade-in">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Register Sessions</CardTitle>
            <CardDescription>
              Historical record of cashier register sessions
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => handleExport('csv')}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => handleExport('pdf')}>
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cashier or ID..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="flex gap-2">
            <Select defaultValue="all" onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-1" />
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                <SelectItem value="open">Open Sessions</SelectItem>
                <SelectItem value="closed">Closed Sessions</SelectItem>
                <SelectItem value="discrepancy">With Discrepancies</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Cashier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Opening Balance</TableHead>
                <TableHead>Closing Balance</TableHead>
                <TableHead>Discrepancy</TableHead>
                <TableHead>Resolution</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.length > 0 ? (
                filteredSessions.map((session) => {
                  const totalOpening = Object.values(session.openingBalance).reduce((sum, val) => sum + val, 0);
                  const totalClosing = session.closingBalance ? 
                    Object.values(session.closingBalance).reduce((sum, val) => sum + val, 0) : 
                    null;
                  const totalDiscrepancy = getTotalDiscrepancy(session);
                  const resolution = getResolutionLabel(session.discrepancyResolution);
                  
                  return (
                    <TableRow key={session.id}>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{format(new Date(session.openedAt), 'MMM d, yyyy')}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(session.openedAt), 'h:mm a')} - 
                          {session.closedAt ? format(new Date(session.closedAt), ' h:mm a') : ' Open'}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{session.cashierName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          session.closedAt ? 
                          "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300" : 
                          "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                        }>
                          {session.closedAt ? 'Closed' : 'Open'}
                        </Badge>
                      </TableCell>
                      <TableCell>${totalOpening.toFixed(2)}</TableCell>
                      <TableCell>
                        {totalClosing !== null ? `$${totalClosing.toFixed(2)}` : '-'}
                      </TableCell>
                      <TableCell>
                        {totalDiscrepancy !== 0 ? (
                          <span className={totalDiscrepancy > 0 ? "text-green-600" : "text-red-600"}>
                            {totalDiscrepancy > 0 ? '+' : ''}{totalDiscrepancy.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-gray-500">Balance</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {totalDiscrepancy !== 0 && session.discrepancyResolution ? (
                          <Badge variant="outline" className={resolution.color}>
                            {resolution.label}
                          </Badge>
                        ) : totalDiscrepancy !== 0 ? (
                          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            Pending Resolution
                          </Badge>
                        ) : (
                          '-'
                        )}
                      </TableCell>
                      <TableCell>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Details
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Register Session Details</AlertDialogTitle>
                              <AlertDialogDescription>
                                Session by {session.cashierName} on {format(new Date(session.openedAt), 'MMM d, yyyy')}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                              <h3 className="text-sm font-medium mb-2">Payment Method Breakdown</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Opening</TableHead>
                                    <TableHead>Closing</TableHead>
                                    <TableHead>Difference</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {Object.entries(session.openingBalance).map(([method, value]) => (
                                    <TableRow key={method}>
                                      <TableCell className="capitalize">{method}</TableCell>
                                      <TableCell>${value.toFixed(2)}</TableCell>
                                      <TableCell>
                                        {session.closingBalance ? 
                                          `$${session.closingBalance[method as keyof typeof session.closingBalance].toFixed(2)}` : 
                                          '-'}
                                      </TableCell>
                                      <TableCell>
                                        {session.discrepancies && session.discrepancies[method as keyof typeof session.discrepancies] !== 0 ? (
                                          <span className={
                                            session.discrepancies[method as keyof typeof session.discrepancies] > 0 ? 
                                            "text-green-600" : "text-red-600"
                                          }>
                                            {session.discrepancies[method as keyof typeof session.discrepancies] > 0 ? '+' : ''}
                                            {session.discrepancies[method as keyof typeof session.discrepancies].toFixed(2)}
                                          </span>
                                        ) : (
                                          <span className="text-gray-500">0.00</span>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                              
                              {session.discrepancyNotes && (
                                <div className="mt-4 p-3 bg-muted rounded-md">
                                  <h4 className="text-sm font-medium mb-1">Resolution Notes</h4>
                                  <p className="text-sm">{session.discrepancyNotes}</p>
                                </div>
                              )}
                            </div>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Close</AlertDialogCancel>
                              <AlertDialogAction>
                                Export Details
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-6 text-muted-foreground">
                    No register sessions found matching the filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterSessionsList;
