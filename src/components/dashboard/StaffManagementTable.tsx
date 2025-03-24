
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  CheckCircle, 
  Clock, 
  Edit, 
  Eye, 
  MinusCircle, 
  MoreHorizontal, 
  UserCheck, 
  UserPlus,
  Calendar
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const StaffManagementTable: React.FC = () => {
  const [showEmployeeDialog, setShowEmployeeDialog] = useState(false);
  const [showAttendanceDialog, setShowAttendanceDialog] = useState(false);
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  
  // Mock data - in a real app, this would come from an API
  const employees = [
    {
      id: 1,
      name: "John Doe",
      role: "Cashier",
      status: "Active",
      attendance: 92,
      dailySalary: 85,
      hourlyRate: 12,
      paymentType: "daily",
      bonuses: 45,
      penalties: 0,
      leaveBalance: 12,
      joiningDate: "2022-01-15"
    },
    {
      id: 2,
      name: "Jane Smith",
      role: "Manager",
      status: "Active",
      attendance: 98,
      dailySalary: 150,
      hourlyRate: 18,
      paymentType: "daily",
      bonuses: 120,
      penalties: 0,
      leaveBalance: 18,
      joiningDate: "2021-08-10"
    },
    {
      id: 3,
      name: "Mike Johnson",
      role: "Sales Associate",
      status: "On Leave",
      attendance: 85,
      dailySalary: 80,
      hourlyRate: 11.50,
      paymentType: "hourly",
      bonuses: 25,
      penalties: 15,
      leaveBalance: 5,
      joiningDate: "2022-03-22"
    },
    {
      id: 4,
      name: "Sarah Williams",
      role: "Cashier",
      status: "Active",
      attendance: 94,
      dailySalary: 85,
      hourlyRate: 12,
      paymentType: "daily",
      bonuses: 30,
      penalties: 0,
      leaveBalance: 10,
      joiningDate: "2022-02-18"
    },
    {
      id: 5,
      name: "Robert Brown",
      role: "Inventory Clerk",
      status: "Active",
      attendance: 90,
      dailySalary: 90,
      hourlyRate: 13,
      paymentType: "daily",
      bonuses: 0,
      penalties: 10,
      leaveBalance: 8,
      joiningDate: "2022-05-15"
    }
  ];
  
  const handleViewEmployee = (employee: any) => {
    setSelectedEmployee(employee);
    setShowEmployeeDialog(true);
  };
  
  const handleAttendance = (employee: any) => {
    setSelectedEmployee(employee);
    setShowAttendanceDialog(true);
  };
  
  const handleShift = (employee: any) => {
    setSelectedEmployee(employee);
    setShowShiftDialog(true);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Button variant="default" className="mr-2">
            <UserPlus className="mr-2 h-4 w-4" />
            Add Employee
          </Button>
          <Button variant="outline" className="mr-2">
            <Calendar className="mr-2 h-4 w-4" />
            View Shifts
          </Button>
          <Button variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Process Payroll
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="cashier">Cashier</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="sales">Sales Associate</SelectItem>
              <SelectItem value="inventory">Inventory Clerk</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="leave">On Leave</SelectItem>
              <SelectItem value="suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Attendance %</TableHead>
              <TableHead>Payment Type</TableHead>
              <TableHead className="text-right">Daily/Hourly Rate</TableHead>
              <TableHead className="text-right">Leave Balance</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell className="font-medium">{employee.name}</TableCell>
                <TableCell>{employee.role}</TableCell>
                <TableCell>
                  <Badge variant={
                    employee.status === "Active" 
                      ? "default" 
                      : employee.status === "On Leave" 
                        ? "outline" 
                        : "destructive"
                  }>
                    {employee.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      employee.attendance >= 95 
                        ? "bg-green-500" 
                        : employee.attendance >= 85 
                          ? "bg-yellow-500" 
                          : "bg-red-500"
                    }`}></div>
                    {employee.attendance}%
                  </div>
                </TableCell>
                <TableCell className="capitalize">{employee.paymentType}</TableCell>
                <TableCell className="text-right">
                  {employee.paymentType === 'daily' 
                    ? formatCurrency(employee.dailySalary) + '/day'
                    : formatCurrency(employee.hourlyRate) + '/hr'
                  }
                </TableCell>
                <TableCell className="text-right">{employee.leaveBalance} days</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleViewEmployee(employee)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleAttendance(employee)}>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Mark Attendance
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleShift(employee)}>
                        <Calendar className="h-4 w-4 mr-2" />
                        Assign Shift
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Employee
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Employee View Dialog */}
      <Dialog open={showEmployeeDialog} onOpenChange={setShowEmployeeDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Employee Details</DialogTitle>
            <DialogDescription>
              Detailed information about {selectedEmployee?.name}.
            </DialogDescription>
          </DialogHeader>
          
          {selectedEmployee && (
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="attendance">Attendance</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
                <TabsTrigger value="leave">Leave</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Full Name</p>
                    <p className="text-sm">{selectedEmployee.name}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Role</p>
                    <p className="text-sm">{selectedEmployee.role}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Status</p>
                    <Badge variant={
                      selectedEmployee.status === "Active" 
                        ? "default" 
                        : selectedEmployee.status === "On Leave" 
                          ? "outline" 
                          : "destructive"
                    }>
                      {selectedEmployee.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Joining Date</p>
                    <p className="text-sm">{formatDate(selectedEmployee.joiningDate)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Payment Type</p>
                    <p className="text-sm capitalize">{selectedEmployee.paymentType}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Rate</p>
                    <p className="text-sm">
                      {selectedEmployee.paymentType === 'daily' 
                        ? formatCurrency(selectedEmployee.dailySalary) + ' per day'
                        : formatCurrency(selectedEmployee.hourlyRate) + ' per hour'
                      }
                    </p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="attendance" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Attendance Records</h3>
                    <p className="text-sm text-muted-foreground">
                      Current Month Attendance: {selectedEmployee.attendance}%
                    </p>
                  </div>
                  <Button>
                    <Clock className="mr-2 h-4 w-4" />
                    Mark Attendance
                  </Button>
                </div>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Attendance records and charts would appear here.
                </div>
              </TabsContent>
              
              <TabsContent value="payroll" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Basic Salary</p>
                    <p className="text-sm">
                      {selectedEmployee.paymentType === 'daily'
                        ? formatCurrency(selectedEmployee.dailySalary * 26) + ' (26 days)'
                        : formatCurrency(selectedEmployee.hourlyRate * 8 * 26) + ' (208 hours)'
                      }
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Bonuses</p>
                    <p className="text-sm text-green-500">{formatCurrency(selectedEmployee.bonuses)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Penalties</p>
                    <p className="text-sm text-red-500">{formatCurrency(selectedEmployee.penalties)}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Net Salary</p>
                    <p className="text-sm font-bold">
                      {selectedEmployee.paymentType === 'daily'
                        ? formatCurrency((selectedEmployee.dailySalary * 26) + selectedEmployee.bonuses - selectedEmployee.penalties)
                        : formatCurrency((selectedEmployee.hourlyRate * 8 * 26) + selectedEmployee.bonuses - selectedEmployee.penalties)
                      }
                    </p>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Payroll History</h4>
                  <div className="h-[150px] flex items-center justify-center text-muted-foreground">
                    Payroll history would appear here.
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="leave" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-medium">Leave Management</h3>
                    <p className="text-sm text-muted-foreground">
                      Available Leave Balance: {selectedEmployee.leaveBalance} days
                    </p>
                  </div>
                  <Button>
                    Request Leave
                  </Button>
                </div>
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Leave records and calendar would appear here.
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Attendance Dialog */}
      <Dialog open={showAttendanceDialog} onOpenChange={setShowAttendanceDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark Attendance</DialogTitle>
            <DialogDescription>
              Record attendance for {selectedEmployee?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Button variant="outline" className="w-full">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Check In
                </Button>
              </div>
              <div>
                <Button variant="outline" className="w-full">
                  <MinusCircle className="mr-2 h-4 w-4 text-red-500" />
                  Check Out
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Status</p>
              <Badge variant="outline">Not Checked In</Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes</p>
              <Input placeholder="Add notes about attendance..." />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAttendanceDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowAttendanceDialog(false)}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Shift Dialog */}
      <Dialog open={showShiftDialog} onOpenChange={setShowShiftDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Shift</DialogTitle>
            <DialogDescription>
              Set shift schedule for {selectedEmployee?.name}.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <p className="text-sm font-medium">Shift Type</p>
              <Select defaultValue="morning">
                <SelectTrigger>
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">Morning (8:00 AM - 4:00 PM)</SelectItem>
                  <SelectItem value="evening">Evening (4:00 PM - 12:00 AM)</SelectItem>
                  <SelectItem value="night">Night (12:00 AM - 8:00 AM)</SelectItem>
                  <SelectItem value="custom">Custom Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Assign Days</p>
              <div className="grid grid-cols-7 gap-2">
                <Button variant="outline" size="sm">Sun</Button>
                <Button variant="outline" size="sm">Mon</Button>
                <Button variant="outline" size="sm">Tue</Button>
                <Button variant="outline" size="sm">Wed</Button>
                <Button variant="outline" size="sm">Thu</Button>
                <Button variant="outline" size="sm">Fri</Button>
                <Button variant="outline" size="sm">Sat</Button>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium">Notes</p>
              <Input placeholder="Add notes about shift..." />
            </div>
          </div>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowShiftDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={() => setShowShiftDialog(false)}>
              Save Shift
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
