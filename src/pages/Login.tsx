
import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { mockBusinesses } from "@/models/interfaces/businessInterfaces";
import LoginForm, { LoginFormValues } from "@/components/auth/LoginForm";
import DemoAccountsSection from "@/components/auth/DemoAccountsSection";
import AuthLinks from "@/components/auth/AuthLinks";

const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBusinesses, setAvailableBusinesses] = useState(mockBusinesses);
  
  // If already logged in, redirect to appropriate page
  if (user) {
    return <Navigate to="/home" replace />;
  }
  
  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      await login(data.email, data.password, data.businessId);
      toast.success("Login successful");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/40 bg-background/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">POS System Login</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm 
              onSubmit={handleSubmit}
              businesses={availableBusinesses}
              isSubmitting={isSubmitting}
            />
            
            <DemoAccountsSection />
          </CardContent>
          <CardFooter className="flex flex-col space-y-2">
            <AuthLinks 
              showForgotPassword={true}
              showSignup={true}
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
