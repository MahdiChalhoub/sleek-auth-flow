
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
          
          for (const business of response.data) {
            // Skip null or non-object entries
            if (!business || typeof business !== 'object') continue;
            
            // Ensure required fields exist
            if (!('id' in business) || 
                !('name' in business) || 
                !('status' in business) || 
                !('owner_id' in business)) {
              continue;
            }
            
            // Create a valid Business object with the required fields
            const businessItem: Business = {
              id: String(business.id),
              name: String(business.name),
              status: String(business.status),
              ownerId: String(business.owner_id),
            };
            
            // Safely add optional properties if they exist
            if ('address' in business && business.address) businessItem.address = String(business.address);
            if ('phone' in business && business.phone) businessItem.phone = String(business.phone);
            if ('email' in business && business.email) businessItem.email = String(business.email);
            if ('tax_id' in business && business.tax_id) businessItem.taxId = String(business.tax_id);
            if ('website' in business && business.website) businessItem.website = String(business.website);
            if ('created_at' in business && business.created_at) businessItem.createdAt = String(business.created_at);
            if ('updated_at' in business && business.updated_at) businessItem.updatedAt = String(business.updated_at);
            if ('logo_url' in business && business.logo_url) businessItem.logoUrl = String(business.logo_url);
            if ('description' in business && business.description) businessItem.description = String(business.description);
            if ('type' in business && business.type) businessItem.type = String(business.type);
            if ('country' in business && business.country) businessItem.country = String(business.country);
            if ('currency' in business && business.currency) businessItem.currency = String(business.currency);
            if ('active' in business) businessItem.active = Boolean(business.active);
            if ('timezone' in business && business.timezone) businessItem.timezone = String(business.timezone);
            
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
