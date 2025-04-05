
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Shield, FileText } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

const StaffFinance: React.FC = () => {
  const { hasPermission } = useAuth();
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Staff Finance</h1>
          <p className="text-muted-foreground">Manage employee payroll, expenses, and benefits</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Staff Management
            </CardTitle>
            <CardDescription>Manage employee information and documents</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              View and manage employee profiles, documents, and attendance records.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/staff-management">
                View Employees
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Payroll
            </CardTitle>
            <CardDescription>Process and manage employee payroll</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Run payroll, view pay history, and generate reports for accounting.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/payroll">
                Manage Payroll
              </Link>
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-md transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Staff Roles & Permissions
            </CardTitle>
            <CardDescription>Manage finance staff access and permissions</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm mb-4">
              Define who can access financial data and what actions they can perform.
            </p>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/staff-finance-roles">
                View Finance Roles
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {hasPermission('manage_payroll') && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Recent Payroll Activity</CardTitle>
            <CardDescription>Recent payroll processing and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Payroll activity will be displayed here. This feature is in development.
              </p>
              <Button className="mt-4">Process New Payroll</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StaffFinance;
