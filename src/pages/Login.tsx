
import React, { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Business } from "@/models/interfaces/businessInterfaces";
import LoginForm, { LoginFormValues } from "@/components/auth/LoginForm";
import DemoAccountsSection from "@/components/auth/DemoAccountsSection";
import AuthLinks from "@/components/auth/AuthLinks";
import { fromTable, isDataResponse } from "@/utils/supabaseServiceHelper";

const Login: React.FC = () => {
  const { user, login, isLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [availableBusinesses, setAvailableBusinesses] = useState<Business[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Fetch available businesses when page loads
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const response = await fromTable('businesses')
          .select('*')
          .eq('status', 'active')
          .limit(10);
          
        if (isDataResponse(response) && Array.isArray(response.data)) {
          // Filter and map business data
          const businesses: Business[] = [];
          
          for (const businessData of response.data) {
            // Skip null or non-object entries
            if (!businessData || typeof businessData !== 'object') continue;
            
            // Type assertion to help TypeScript
            const typedBusinessData = businessData as Record<string, unknown>;
            
            // Ensure required fields exist
            if (!('id' in typedBusinessData) || 
                !('name' in typedBusinessData) || 
                !('status' in typedBusinessData) || 
                !('owner_id' in typedBusinessData)) {
              continue;
            }
            
            // Create a valid Business object with the required fields
            const businessItem: Business = {
              id: String(typedBusinessData.id),
              name: String(typedBusinessData.name),
              status: String(typedBusinessData.status),
              ownerId: String(typedBusinessData.owner_id),
            };
            
            // Safely add optional properties if they exist
            if ('address' in typedBusinessData && typedBusinessData.address !== null) {
              businessItem.address = String(typedBusinessData.address);
            }
            
            if ('phone' in typedBusinessData && typedBusinessData.phone !== null) {
              businessItem.phone = String(typedBusinessData.phone);
            }
            
            if ('email' in typedBusinessData && typedBusinessData.email !== null) {
              businessItem.email = String(typedBusinessData.email);
            }
            
            if ('tax_id' in typedBusinessData && typedBusinessData.tax_id !== null) {
              businessItem.taxId = String(typedBusinessData.tax_id);
            }
            
            if ('website' in typedBusinessData && typedBusinessData.website !== null) {
              businessItem.website = String(typedBusinessData.website);
            }
            
            if ('created_at' in typedBusinessData && typedBusinessData.created_at !== null) {
              businessItem.createdAt = String(typedBusinessData.created_at);
            }
            
            if ('updated_at' in typedBusinessData && typedBusinessData.updated_at !== null) {
              businessItem.updatedAt = String(typedBusinessData.updated_at);
            }
            
            if ('logo_url' in typedBusinessData && typedBusinessData.logo_url !== null) {
              businessItem.logoUrl = String(typedBusinessData.logo_url);
            }
            
            if ('description' in typedBusinessData && typedBusinessData.description !== null) {
              businessItem.description = String(typedBusinessData.description);
            }
            
            if ('type' in typedBusinessData && typedBusinessData.type !== null) {
              businessItem.type = String(typedBusinessData.type);
            }
            
            if ('country' in typedBusinessData && typedBusinessData.country !== null) {
              businessItem.country = String(typedBusinessData.country);
            }
            
            if ('currency' in typedBusinessData && typedBusinessData.currency !== null) {
              businessItem.currency = String(typedBusinessData.currency);
            }
            
            if ('active' in typedBusinessData) {
              businessItem.active = Boolean(typedBusinessData.active);
            }
            
            if ('timezone' in typedBusinessData && typedBusinessData.timezone !== null) {
              businessItem.timezone = String(typedBusinessData.timezone);
            }
            
            businesses.push(businessItem);
          }
          
          setAvailableBusinesses(businesses);
        } else {
          console.error('Could not fetch businesses:', response.error);
          setAvailableBusinesses([]);
        }
      } catch (error) {
        console.error('Error fetching businesses:', error);
        setAvailableBusinesses([]);
      }
    };
    
    fetchBusinesses();
  }, []);
  
  // Store the current path as the intended redirect if it's not a public route
  useEffect(() => {
    const from = location.state?.from?.pathname;
    if (from && !['/login', '/signup', '/forgot-password'].includes(from)) {
      localStorage.setItem("intended_redirect", from);
    }
  }, [location]);
  
  // If already logged in, redirect to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  const handleSubmit = async (data: LoginFormValues) => {
    setIsSubmitting(true);
    try {
      // Ensure a business is selected
      if (!data.businessId) {
        throw new Error("Please select a business to continue");
      }
      
      // Login with the selected business
      await login(data.email, data.password, data.businessId, data.rememberMe);
      
      // Redirect to dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
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
              requireBusinessSelection={true}
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
