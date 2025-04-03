import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, ArrowRight, Building, Check, MapPin, User } from 'lucide-react';
import BusinessInfoForm from '@/components/setup/BusinessInfoForm';
import LocationInfoForm from '@/components/setup/LocationInfoForm';
import AdminInfoForm from '@/components/setup/AdminInfoForm';
import { supabase } from '@/lib/supabase';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';
import { saveSetupStatus } from '@/services/setupService';

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessData, setBusinessData] = useState({
    name: '',
    type: 'Retail',
    currency: 'USD',
    country: '',
    logoUrl: '',
    description: ''
  });
  
  const [locationData, setLocationData] = useState({
    name: 'Main Store',
    type: 'retail',
    address: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    phone: '',
    email: '',
    isDefault: true
  });
  
  const [adminData, setAdminData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleStepChange = (step: string) => {
    if (activeStep === 'business' && step === 'location') {
      if (!businessData.name || !businessData.type || !businessData.currency) {
        toast.error('Please fill in all required business information');
        return;
      }
    } else if (activeStep === 'location' && step === 'admin') {
      if (!locationData.name || !locationData.type) {
        toast.error('Please fill in all required location information');
        return;
      }
    }
    
    setActiveStep(step);
  };
  
  const completedSteps = {
    business: !!businessData.name && !!businessData.type && !!businessData.currency,
    location: !!locationData.name && !!locationData.type,
    admin: !!adminData.fullName && !!adminData.email && !!adminData.password && 
           adminData.password === adminData.confirmPassword && adminData.password.length >= 6
  };

  const handleSubmit = async () => {
    if (!completedSteps.business || !completedSteps.location || !completedSteps.admin) {
      toast.error('Please complete all steps before submitting');
      return;
    }
    
    if (adminData.password !== adminData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (adminData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
        options: {
          data: {
            full_name: adminData.fullName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create admin account');
      }
      
      const businessResponse = await fromTable('businesses')
        .insert({
          name: businessData.name,
          type: businessData.type,
          currency: businessData.currency,
          country: businessData.country,
          logo_url: businessData.logoUrl,
          description: businessData.description,
          owner_id: authData.user.id,
          status: 'active',
          active: true
        })
        .select();
      
      if (!isDataResponse(businessResponse)) {
        throw new Error('Failed to create business');
      }
      
      if (!businessResponse.data || businessResponse.data.length === 0) {
        throw new Error('No business data returned');
      }
      
      const businessObj = businessResponse.data[0];
      
      // TypeScript null check - guarantee businessObj exists and has required properties
      if (!businessObj || typeof businessObj !== 'object' || !('id' in businessObj)) {
        throw new Error('Invalid business data returned from database');
      }
      
      // Type assertion to make TypeScript happy
      const businessId = businessObj.id as string;
      
      const locationResponse = await fromTable('locations')
        .insert({
          name: locationData.name,
          type: locationData.type,
          address: locationData.address,
          business_id: businessId,
          phone: locationData.phone,
          email: locationData.email,
          timezone: locationData.timezone,
          status: 'active',
          is_default: locationData.isDefault
        })
        .select();
        
      if (!isDataResponse(locationResponse)) {
        throw new Error('Failed to create location');
      }
      
      await fromTable('extended_users')
        .update({ status: 'active' })
        .eq('id', authData.user.id);
        
      const roleResponse = await fromTable('roles')
        .select()
        .eq('name', 'SuperAdmin')
        .maybeSingle();
      
      if (isDataResponse(roleResponse) && !roleResponse.data) {
        await fromTable('roles')
          .insert({
            name: 'SuperAdmin',
            description: 'System SuperAdmin with full access'
          });
      }
      
      await saveSetupStatus(true);
      
      toast.success('Setup complete! You can now log in to your POS system.');
      
      await supabase.auth.signOut();
      
      navigate('/login');
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Setup failed: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-4xl">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">POS System Setup</CardTitle>
            <CardDescription>
              Welcome to your new POS system. Let's get everything set up for your business.
            </CardDescription>
          </CardHeader>

          <Tabs value={activeStep} onValueChange={setActiveStep}>
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="business" disabled={isSubmitting} className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span className="hidden sm:inline">Business Info</span>
                  {completedSteps.business && <Check className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="location" disabled={isSubmitting} className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="hidden sm:inline">Location Info</span>
                  {completedSteps.location && <Check className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
                <TabsTrigger value="admin" disabled={isSubmitting} className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Admin Setup</span>
                  {completedSteps.admin && <Check className="h-4 w-4 text-green-500 ml-1" />}
                </TabsTrigger>
              </TabsList>
            </div>

            <CardContent className="p-6">
              <TabsContent value="business" className="mt-0">
                <BusinessInfoForm 
                  data={businessData}
                  onChange={setBusinessData}
                />
              </TabsContent>
              
              <TabsContent value="location" className="mt-0">
                <LocationInfoForm 
                  data={locationData}
                  onChange={setLocationData}
                />
              </TabsContent>
              
              <TabsContent value="admin" className="mt-0">
                <AdminInfoForm 
                  data={adminData}
                  onChange={setAdminData}
                />
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex justify-between border-t p-6">
              {activeStep === 'business' ? (
                <div></div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => handleStepChange(activeStep === 'location' ? 'business' : 'location')}
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              )}
              
              {activeStep === 'admin' ? (
                <Button 
                  onClick={handleSubmit} 
                  disabled={isSubmitting || !completedSteps.business || !completedSteps.location || !completedSteps.admin}
                >
                  {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                </Button>
              ) : (
                <Button 
                  onClick={() => handleStepChange(activeStep === 'business' ? 'location' : 'admin')}
                  disabled={isSubmitting || (activeStep === 'business' && !completedSteps.business) || (activeStep === 'location' && !completedSteps.location)}
                >
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </CardFooter>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
