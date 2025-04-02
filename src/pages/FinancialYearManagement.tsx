
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Check, Lock, Plus, Unlock } from 'lucide-react';
import { useFinancialYears } from '@/hooks/useFinancialYears';
import { FinancialYearStatus } from '@/models/interfaces/financialYearInterfaces';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { useAuth } from '@/contexts/AuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface NewFinancialYearData {
  name: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
}

const FinancialYearManagement: React.FC = () => {
  const { user } = useAuth();
  const { 
    financialYears, 
    currentFinancialYear, 
    loading, 
    createFinancialYear,
    closeFinancialYear,
    reopenFinancialYear,
    updateFinancialYearStatus
  } = useFinancialYears();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newYearData, setNewYearData] = useState<NewFinancialYearData>({
    name: `Financial Year ${new Date().getFullYear()}`,
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    status: 'pending'
  });
  
  const handleCreateYear = async () => {
    if (!user) {
      toast.error('You must be logged in to perform this action');
      return;
    }
    
    try {
      await createFinancialYear(newYearData);
      setIsCreateDialogOpen(false);
      // Reset form
      setNewYearData({
        name: `Financial Year ${new Date().getFullYear()}`,
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
        status: 'pending'
      });
    } catch (error) {
      console.error('Error creating financial year:', error);
    }
  };
  
  const handleStatusChange = async (id: string, status: FinancialYearStatus) => {
    try {
      if (status === 'closed') {
        await closeFinancialYear(id);
      } else {
        await reopenFinancialYear(id);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };
  
  return (
    <div className="container mx-auto py-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Financial Year Management</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Financial Year
        </Button>
      </header>

      {loading ? (
        <div className="flex justify-center p-8">
          <div className="animate-pulse">Loading financial years...</div>
        </div>
      ) : (
        <>
          {currentFinancialYear && (
            <Card className="mb-6 border-2 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Financial Year</span>
                  <Badge variant={currentFinancialYear.status === 'pending' ? 'success' : 'destructive'}>
                    {currentFinancialYear.status === 'pending' ? 'Open' : 'Closed'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Name</h3>
                    <p>{currentFinancialYear.name}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Period</h3>
                    <p>{format(new Date(currentFinancialYear.startDate), 'MMM dd, yyyy')} - {format(new Date(currentFinancialYear.endDate), 'MMM dd, yyyy')}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Created By</h3>
                    <p>{currentFinancialYear.createdBy}</p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-500">Created At</h3>
                    <p>{format(new Date(currentFinancialYear.createdAt || ''), 'MMM dd, yyyy')}</p>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  {currentFinancialYear.status === 'pending' ? (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => handleStatusChange(currentFinancialYear.id, 'closed')}
                    >
                      <Lock className="h-4 w-4 mr-2" />
                      Close Year
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleStatusChange(currentFinancialYear.id, 'pending')}
                    >
                      <Unlock className="h-4 w-4 mr-2" />
                      Reopen Year
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <h2 className="text-xl font-semibold mb-4">All Financial Years</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {financialYears.map(year => (
              <Card key={year.id} className={year.id === currentFinancialYear?.id ? "border-2 border-primary/20" : ""}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{year.name}</span>
                    <Badge variant={year.status === 'pending' || year.status === 'active' ? 'success' : 'secondary'}>
                      {year.status === 'pending' || year.status === 'active' ? 'Open' : 'Closed'}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{format(new Date(year.startDate), 'MMM dd, yyyy')} - {format(new Date(year.endDate), 'MMM dd, yyyy')}</span>
                    </div>
                    
                    {year.status === 'closed' && year.closedAt && (
                      <div className="flex items-center text-sm text-gray-500">
                        <Lock className="h-4 w-4 mr-2" />
                        <span>Closed on {format(new Date(year.closedAt), 'MMM dd, yyyy')}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4 flex justify-end">
                    {year.status === 'pending' || year.status === 'active' ? (
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={() => handleStatusChange(year.id, 'closed')}
                      >
                        <Lock className="h-4 w-4 mr-2" />
                        Close
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleStatusChange(year.id, 'pending')}
                        disabled={currentFinancialYear && (currentFinancialYear.status === 'pending' || currentFinancialYear.status === 'active') && currentFinancialYear.id !== year.id}
                      >
                        <Unlock className="h-4 w-4 mr-2" />
                        Reopen
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
      
      {/* Create Financial Year Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Financial Year</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="year-name" className="text-sm font-medium">Name</label>
              <input
                id="year-name"
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newYearData.name}
                onChange={(e) => setNewYearData({...newYearData, name: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="start-date" className="text-sm font-medium">Start Date</label>
                <input
                  id="start-date"
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newYearData.startDate}
                  onChange={(e) => setNewYearData({...newYearData, startDate: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="end-date" className="text-sm font-medium">End Date</label>
                <input
                  id="end-date"
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newYearData.endDate}
                  onChange={(e) => setNewYearData({...newYearData, endDate: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={newYearData.status === 'pending'}
                    onChange={() => setNewYearData({...newYearData, status: 'pending'})}
                  />
                  <span>Open</span>
                </label>
                
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    checked={newYearData.status === 'closed'}
                    onChange={() => setNewYearData({...newYearData, status: 'closed'})}
                  />
                  <span>Closed</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" className="mr-2" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateYear}>
              <Check className="h-4 w-4 mr-2" />
              Create
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialYearManagement;
