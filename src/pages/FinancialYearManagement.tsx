import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format, parseISO } from 'date-fns';
import { CalendarIcon, Lock, Unlock, Plus, Calendar, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/components/ui/use-toast';
import { useFinancialYears } from '@/hooks/useFinancialYears';
import { FinancialYearFormData } from '@/models/interfaces/financialYearInterfaces';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  startDate: z.string().min(1, { message: 'Start date is required.' }),
  endDate: z.string().min(1, { message: 'End date is required.' }),
  status: z.enum(['open', 'closed'], { message: 'Status is required.' }),
});

const FinancialYearManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const hasPermission = user?.isAdmin || user?.isGlobalAdmin;

  const { activeYear, isLoading, financialYears, createFinancialYear, updateFinancialYearStatus } = useFinancialYears();

  const form = useForm<FinancialYearFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      startDate: '',
      endDate: '',
      status: 'open',
    },
  });

  const { reset } = form;

  const handleCreateFinancialYear = async (data: FinancialYearFormData) => {
    const yearData = {
      ...data,
      createdBy: user?.id || 'system'
    };
    
    const result = await createFinancialYear(yearData);
    if (result) {
      setIsModalOpen(false);
      reset();
    }
  };

  const handleStatusChange = async (id: string, status: 'open' | 'closed') => {
    await updateFinancialYearStatus(id, status);
  };

  const renderFinancialYearCard = (year: any) => {
    const isActive = activeYear?.id === year.id;
    const startDate = parseISO(year.startDate);
    const endDate = parseISO(year.endDate);

    return (
      <Card key={year.id} className={cn("mb-4", isActive && "border-primary")}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{year.name}</CardTitle>
              <CardDescription>
                {format(startDate, 'PPP')} - {format(endDate, 'PPP')}
              </CardDescription>
            </div>
            <Badge variant={year.status === 'open' ? 'default' : 'secondary'}>
              {year.status === 'open' ? 'Open' : 'Closed'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Start Date</p>
              <p className="font-medium">{format(startDate, 'PPP')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">End Date</p>
              <p className="font-medium">{format(endDate, 'PPP')}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created By</p>
              <p className="font-medium">{year.createdBy || 'System'}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Created At</p>
              <p className="font-medium">{format(parseISO(year.createdAt), 'PPP')}</p>
            </div>
            {year.status === 'closed' && year.closedBy && (
              <>
                <div>
                  <p className="text-muted-foreground">Closed By</p>
                  <p className="font-medium">{year.closedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Closed At</p>
                  <p className="font-medium">{year.closedAt ? format(parseISO(year.closedAt), 'PPP') : 'N/A'}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          {year.status === 'open' ? (
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={() => handleStatusChange(year.id, 'closed')}
              disabled={!hasPermission || (user && !user.isAdmin)}
            >
              <Lock className="mr-2 h-4 w-4" />
              Close Year
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleStatusChange(year.id, 'open')}
              disabled={!hasPermission || (user && !user.isAdmin)}
            >
              <Unlock className="mr-2 h-4 w-4" />
              Reopen Year
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Financial Year Management</h1>
          <p className="text-muted-foreground">Manage your financial years and accounting periods</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={!hasPermission}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Financial Year
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Financial Years</CardTitle>
              <CardDescription>All financial years in your system</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : financialYears.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Financial Years</h3>
                  <p className="text-muted-foreground mt-1">
                    You haven't created any financial years yet.
                  </p>
                  <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Financial Year
                  </Button>
                </div>
              ) : (
                <div>
                  {financialYears.map(renderFinancialYearCard)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Active Financial Year</CardTitle>
              <CardDescription>Currently active financial year</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-32 w-full" />
              ) : activeYear ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">{activeYear.name}</h3>
                    <Badge variant="outline" className={activeYear.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                      {activeYear.status === 'open' ? (
                        <Check className="mr-1 h-3 w-3" />
                      ) : (
                        <X className="mr-1 h-3 w-3" />
                      )}
                      {activeYear.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-muted-foreground">Start Date</p>
                      <p className="font-medium">{format(parseISO(activeYear.startDate), 'PPP')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">End Date</p>
                      <p className="font-medium">{format(parseISO(activeYear.endDate), 'PPP')}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No Active Year</h3>
                  <p className="text-muted-foreground mt-1">
                    Create a financial year to get started.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium">What is a Financial Year?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  A financial year is a 12-month period used for accounting and financial reporting.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Why is it important?</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Financial years help organize your accounting data and are essential for tax reporting and financial analysis.
                </p>
              </div>
              <div>
                <h3 className="font-medium">Managing Financial Years</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  You can have multiple financial years, but only one can be active at a time. Closed years can be reopened if needed.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create New Financial Year</DialogTitle>
            <DialogDescription>
              Set up a new financial year for your accounting periods.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleCreateFinancialYear)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Financial Year Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. FY 2023-2024" {...field} />
                    </FormControl>
                    <FormDescription>
                      A descriptive name for this financial year.
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
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={field.value ? new Date(field.value) : undefined}
                            onSelect={(date) => field.onChange(date?.toISOString() ?? "")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
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
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="open">Open</SelectItem>
                        <SelectItem value="closed">Closed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      An open financial year can be used for transactions.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create Financial Year</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FinancialYearManagement;
