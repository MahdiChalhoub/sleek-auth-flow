
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
          const businesses: Business[] = response.data
            .filter((business): business is object => 
              business !== null && typeof business === 'object')
            .map(business => {
              if (business && 
                  'id' in business && 
                  'name' in business && 
                  'status' in business && 
                  'owner_id' in business) {
                return {
                  id: String(business.id),
                  name: String(business.name),
                  status: String(business.status),
                  ownerId: String(business.owner_id),
                  // Safely include optional properties with null checks
                  address: business.address ? String(business.address) : undefined,
                  phone: business.phone ? String(business.phone) : undefined,
                  email: business.email ? String(business.email) : undefined,
                  taxId: business.tax_id ? String(business.tax_id) : undefined,
                  website: business.website ? String(business.website) : undefined,
                  createdAt: business.created_at ? String(business.created_at) : undefined,
                  updatedAt: business.updated_at ? String(business.updated_at) : undefined,
                  logoUrl: business.logo_url ? String(business.logo_url) : undefined,
                  description: business.description ? String(business.description) : undefined,
                  type: business.type ? String(business.type) : undefined,
                  country: business.country ? String(business.country) : undefined,
                  currency: business.currency ? String(business.currency) : undefined,
                  active: business.active !== undefined ? Boolean(business.active) : undefined,
                  timezone: business.timezone ? String(business.timezone) : undefined
                };
              }
              return null;
            })
            .filter((business): business is Business => business !== null);
          
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
