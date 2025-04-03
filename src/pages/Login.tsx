
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
            
            // Ensure required fields exist
            if (!('id' in businessData) || 
                !('name' in businessData) || 
                !('status' in businessData) || 
                !('owner_id' in businessData)) {
              continue;
            }
            
            // Create a valid Business object with the required fields
            const businessItem: Business = {
              id: String(businessData.id),
              name: String(businessData.name),
              status: String(businessData.status),
              ownerId: String(businessData.owner_id),
            };
            
            // Safely add optional properties if they exist
            if (businessData && typeof businessData === 'object' && 'address' in businessData && businessData.address) {
              businessItem.address = String(businessData.address);
            }
            if (businessData && typeof businessData === 'object' && 'phone' in businessData && businessData.phone) {
              businessItem.phone = String(businessData.phone);
            }
            if (businessData && typeof businessData === 'object' && 'email' in businessData && businessData.email) {
              businessItem.email = String(businessData.email);
            }
            if (businessData && typeof businessData === 'object' && 'tax_id' in businessData && businessData.tax_id) {
              businessItem.taxId = String(businessData.tax_id);
            }
            if (businessData && typeof businessData === 'object' && 'website' in businessData && businessData.website) {
              businessItem.website = String(businessData.website);
            }
            if (businessData && typeof businessData === 'object' && 'created_at' in businessData && businessData.created_at) {
              businessItem.createdAt = String(businessData.created_at);
            }
            if (businessData && typeof businessData === 'object' && 'updated_at' in businessData && businessData.updated_at) {
              businessItem.updatedAt = String(businessData.updated_at);
            }
            if (businessData && typeof businessData === 'object' && 'logo_url' in businessData && businessData.logo_url) {
              businessItem.logoUrl = String(businessData.logo_url);
            }
            if (businessData && typeof businessData === 'object' && 'description' in businessData && businessData.description) {
              businessItem.description = String(businessData.description);
            }
            if (businessData && typeof businessData === 'object' && 'type' in businessData && businessData.type) {
              businessItem.type = String(businessData.type);
            }
            if (businessData && typeof businessData === 'object' && 'country' in businessData && businessData.country) {
              businessItem.country = String(businessData.country);
            }
            if (businessData && typeof businessData === 'object' && 'currency' in businessData && businessData.currency) {
              businessItem.currency = String(businessData.currency);
            }
            if (businessData && typeof businessData === 'object' && 'active' in businessData) {
              businessItem.active = Boolean(businessData.active);
            }
            if (businessData && typeof businessData === 'object' && 'timezone' in businessData && businessData.timezone) {
              businessItem.timezone = String(businessData.timezone);
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
