import React, { useState } from "react";
import { useFinancialYears } from "@/hooks/useFinancialYears";
import { FinancialYearFormData, FinancialYearStatus } from "@/models/interfaces/financialYearInterfaces";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isAfter, parseISO } from "date-fns";
import { Lock, Unlock, XCircle, CheckCircle, AlertCircle, CalendarRange, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Form validation schema
const financialYearSchema = z.object({
  name: z.string().min(1, "Name is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
  status: z.enum(["open", "locked", "closed"]).default("open"),
}).refine(data => {
  return isAfter(parseISO(data.endDate), parseISO(data.startDate));
}, {
  message: "End date must be after start date",
  path: ["endDate"],
});

const FinancialYearManagement: React.FC = () => {
  const { 
    financialYears, 
    currentFinancialYear, 
    isLoading, 
    createFinancialYear, 
    updateFinancialYearStatus 
  } = useFinancialYears();
  const { user } = useAuth();
  const [isCreating, setIsCreating] = useState(false);
  const [yearToUpdate, setYearToUpdate] = useState<{ id: string, status: FinancialYearStatus, name: string } | null>(null);
  
  const form = useForm<FinancialYearFormData>({
    resolver: zodResolver(financialYearSchema),
    defaultValues: {
      name: "",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
      status: "open",
    },
  });

  const onSubmit = async (data: FinancialYearFormData) => {
    const success = await createFinancialYear(data);
    if (success) {
      setIsCreating(false);
      form.reset();
    }
  };

  const handleStatusChange = async () => {
    if (!yearToUpdate) return;
    
    const { id, status } = yearToUpdate;
    const success = await updateFinancialYearStatus(id, status);
    
    if (success) {
      setYearToUpdate(null);
    }
  };

  const confirmStatusChange = (id: string, name: string, newStatus: FinancialYearStatus) => {
    const isUserAdmin = user?.isAdmin || user?.isGlobalAdmin || user?.role === 'admin';
    
    if (newStatus === 'open' && !isUserAdmin) {
      toast.error("Only administrators can reopen a closed financial year");
      return;
    }
    
    setYearToUpdate({ id, status: newStatus, name });
  };

  const getStatusBadge = (status: FinancialYearStatus) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-green-100 text-green-800 border-green-300">Open</Badge>;
      case 'locked':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300">Locked</Badge>;
      case 'closed':
        return <Badge className="bg-red-100 text-red-800 border-red-300">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const isUserAdmin = user?.isAdmin || user?.isGlobalAdmin || user?.role === 'admin';

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Financial Year Management</h1>
          <p className="text-muted-foreground">
            Manage financial years and control transaction periods
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Financial Year
        </Button>
      </div>

      {/* Current Financial Year Card */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="flex items-center">
            <CalendarRange className="mr-2 h-5 w-5" />
            Current Financial Year
          </CardTitle>
          <CardDescription>
            All new transactions are automatically assigned to this period
          </CardDescription>
        </CardHeader>
        <CardContent>
          {currentFinancialYear ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</span>
                <p className="text-lg font-semibold">{currentFinancialYear.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Period</span>
                <p className="text-lg font-semibold">
                  {format(new Date(currentFinancialYear.startDate), "dd MMM yyyy")} - {format(new Date(currentFinancialYear.endDate), "dd MMM yyyy")}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</span>
                <p className="text-lg font-semibold">
                  {getStatusBadge(currentFinancialYear.status)}
                </p>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Actions</span>
                <div className="flex space-x-2 mt-1">
                  {currentFinancialYear.status === 'open' && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => confirmStatusChange(currentFinancialYear.id, currentFinancialYear.name, 'locked')}
                    >
                      <Lock className="mr-1 h-3 w-3" />
                      Lock
                    </Button>
                  )}
                  {currentFinancialYear.status === 'locked' && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => confirmStatusChange(currentFinancialYear.id, currentFinancialYear.name, 'open')}
                      >
                        <Unlock className="mr-1 h-3 w-3" />
                        Reopen
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => confirmStatusChange(currentFinancialYear.id, currentFinancialYear.name, 'closed')}
                      >
                        <XCircle className="mr-1 h-3 w-3" />
                        Close
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <AlertCircle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Active Financial Year</h3>
              <p className="text-muted-foreground mb-4">
                You need to create and activate a financial year to manage transactions properly.
              </p>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Financial Year
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Financial Years Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Financial Years</CardTitle>
          <CardDescription>
            History and management of all financial periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : financialYears.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No financial years found. Click the button above to create your first financial year.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created By</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {financialYears.map((year) => (
                  <TableRow key={year.id}>
                    <TableCell className="font-medium">{year.name}</TableCell>
                    <TableCell>{format(new Date(year.startDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{format(new Date(year.endDate), "dd MMM yyyy")}</TableCell>
                    <TableCell>{getStatusBadge(year.status)}</TableCell>
                    <TableCell>{year.createdBy}</TableCell>
                    <TableCell>{format(new Date(year.createdAt), "dd MMM yyyy")}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {year.status === 'open' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => confirmStatusChange(year.id, year.name, 'locked')}
                          >
                            <Lock className="mr-1 h-3 w-3" />
                            Lock
                          </Button>
                        )}
                        {year.status === 'locked' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => confirmStatusChange(year.id, year.name, 'open')}
                            >
                              <Unlock className="mr-1 h-3 w-3" />
                              Reopen
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => confirmStatusChange(year.id, year.name, 'closed')}
                            >
                              <XCircle className="mr-1 h-3 w-3" />
                              Close
                            </Button>
                          </>
                        )}
                        {year.status === 'closed' && isUserAdmin && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => confirmStatusChange(year.id, year.name, 'locked')}
                          >
                            <Unlock className="mr-1 h-3 w-3" />
                            Reopen
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Financial Year Dialog */}
      <Dialog open={isCreating} onOpenChange={setIsCreating}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Financial Year</DialogTitle>
            <DialogDescription>
              Define a new financial period for transaction management
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Year Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. FY 2024-2025" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter a descriptive name for this financial year
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="locked">Locked</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Open: allows transactions, Locked: prevents new entries
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Financial Year</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Status Change Confirmation Dialog */}
      <AlertDialog open={!!yearToUpdate} onOpenChange={(open) => !open && setYearToUpdate(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {yearToUpdate?.status === 'closed' 
                ? "Close Financial Year" 
                : yearToUpdate?.status === 'locked'
                  ? "Lock Financial Year"
                  : "Reopen Financial Year"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {yearToUpdate?.status === 'closed' && (
                <>
                  <p className="mb-2 font-medium text-red-600">This action has significant implications:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All transactions for this period will be permanently locked</li>
                    <li>Balances will be carried forward to the next financial year</li>
                    <li>Only administrators can reopen a closed financial year</li>
                  </ul>
                </>
              )}
              {yearToUpdate?.status === 'locked' && (
                <>
                  <p className="mb-2">Locking will:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Prevent new transactions from being created in this period</li>
                    <li>Allow existing transactions to be viewed</li>
                    <li>You can unlock this period later if needed</li>
                  </ul>
                </>
              )}
              {yearToUpdate?.status === 'open' && (
                <>
                  <p className="mb-2">Reopening will:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Allow new transactions to be created for this period</li>
                    <li>This action will be logged in the audit trail</li>
                  </ul>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleStatusChange} className={
              yearToUpdate?.status === 'closed' 
                ? "bg-red-600 hover:bg-red-700" 
                : undefined
            }>
              {yearToUpdate?.status === 'closed' 
                ? "Close Financial Year" 
                : yearToUpdate?.status === 'locked'
                  ? "Lock Financial Year"
                  : "Reopen Financial Year"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default FinancialYearManagement;
