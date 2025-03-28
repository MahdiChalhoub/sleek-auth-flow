
import React, { useState, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  
  // Store the current path as the intended redirect if it's not a public route
  useEffect(() => {
    const from = location.state?.from?.pathname;
    if (from && !['/login', '/signup', '/forgot-password'].includes(from)) {
      localStorage.setItem("intended_redirect", from);
    }
  }, [location]);
  
  // If already logged in, redirect to appropriate page
  if (user) {
    // Check for an intended redirect path or use the default
    const redirectTo = localStorage.getItem("intended_redirect") || "/home";
    localStorage.removeItem("intended_redirect");
    return <Navigate to={redirectTo} replace />;
  }
  
  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      if (!data.businessId || data.businessId.trim() === "") {
        toast.error("Please select a business to continue");
        setIsSubmitting(false);
        return;
      }
      
      await login(data.email, data.password, data.businessId, data.rememberMe);
      toast.success("Login successful");
    } catch (error) {
      console.error(error);
      // Display the actual error message from the authentication process
      toast.error(error instanceof Error ? error.message : "Login failed. Please check your credentials.");
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
