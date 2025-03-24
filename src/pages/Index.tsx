
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Users, LogOut } from "lucide-react";

const Index = () => {
  const handleLogout = () => {
    toast.success("Logged out successfully", {
      description: "You have been logged out of your account.",
    });
    // In a real app, this would clear auth tokens and redirect
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-lg mx-auto p-8 rounded-2xl glass-card">
        <h1 className="text-3xl font-semibold mb-4 text-center">POS Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-8">
          Welcome to your POS system. You are now logged in.
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
            asChild
          >
            <Link to="/roles">
              <Users className="h-6 w-6" />
              <span>Manage Roles</span>
            </Link>
          </Button>
          
          <Button
            className="p-6 h-auto flex flex-col items-center gap-3"
            variant="outline"
          >
            <Users className="h-6 w-6" />
            <span>Manage Users</span>
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button
            className="px-8 py-2"
            variant="outline"
            onClick={handleLogout}
            asChild
          >
            <Link to="/login">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Link>
          </Button>
          
          <Button
            className="px-8 py-2"
            variant="default"
            asChild
          >
            <Link to="/home">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
