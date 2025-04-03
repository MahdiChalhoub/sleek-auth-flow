
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';
import { saveSetupStatus } from '@/services/setupService';

interface BusinessFormData {
  name: string;
  type: string;
  phone: string;
  email: string;
  address: string;
}

interface LocationFormData {
  name: string;
  type: string;
  address: string;
}

const SetupWizard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('business');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [businessData, setBusinessData] = useState<BusinessFormData>({
    name: '',
    type: 'Retail',
    phone: '',
    email: '',
    address: ''
  });
  
  const [locationData, setLocationData] = useState<LocationFormData>({
    name: 'Main Store',
    type: 'retail',
    address: ''
  });
  
  const handleBusinessChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBusinessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessData.name.trim()) {
      toast.error('Business name is required');
      return;
    }
    
    setActiveTab('location');
  };
  
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!locationData.name.trim()) {
      toast.error('Location name is required');
      return;
    }
    
    handleFinalSubmit();
  };
  
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('You must be logged in to complete setup');
      }
      
      // Check if business exists with same name
      const businessNameCheck = await fromTable('businesses')
        .select('id')
        .eq('name', businessData.name)
        .maybeSingle();
        
      if (isDataResponse(businessNameCheck) && businessNameCheck.data) {
        throw new Error('A business with this name already exists. Please choose a different name.');
      }
      
      // Check phone if provided
      if (businessData.phone) {
        const phoneCheck = await fromTable('businesses')
          .select('id')
          .eq('phone', businessData.phone)
          .maybeSingle();
          
        if (isDataResponse(phoneCheck) && phoneCheck.data) {
          throw new Error('A business with this phone number already exists.');
        }
      }
      
      // Create business with better error handling
      const businessResult = await fromTable('businesses')
        .insert({
          name: businessData.name,
          type: businessData.type,
          phone: businessData.phone,
          email: businessData.email,
          address: businessData.address,
          owner_id: userData.user.id,
          status: 'active',
          active: true
        })
        .select();
      
      if (!isDataResponse(businessResult)) {
        console.error('Business creation error:', businessResult.error);
        throw new Error(`Failed to create business: ${businessResult.error?.message || 'Unknown error'}`);
      }
      
      if (!businessResult.data || businessResult.data.length === 0) {
        throw new Error('No business data returned from database');
      }
      
      const businessObj = businessResult.data[0];
      
      // Add better type safety
      if (!businessObj || typeof businessObj !== 'object') {
        throw new Error('Invalid business data returned from database');
      }

      // Get business ID
      const typedBusinessObj = businessObj as Record<string, unknown>;
      
      if (!('id' in typedBusinessObj)) {
        throw new Error('Business ID not found in response');
      }
      
      const businessId = String(typedBusinessObj.id);
      
      if (!businessId) {
        throw new Error('Could not retrieve business ID');
      }
      
      // Create location with better error handling
      try {
        const locationResult = await fromTable('locations')
          .insert({
            name: locationData.name,
            type: locationData.type,
            address: locationData.address,
            business_id: businessId,
            status: 'active',
            is_default: true
          })
          .select();
        
        if (!isDataResponse(locationResult)) {
          console.error('Location creation error:', locationResult.error);
          throw new Error(`Failed to create location: ${locationResult.error?.message || 'Unknown error'}`);
        }
      } catch (locationError) {
        console.error('Failed to create location:', locationError);
        // Continue with setup even if location creation fails
      }
      
      // Save setup status as complete
      await saveSetupStatus(true);
      
      toast.success('Setup completed successfully!');
      
      // Navigate to dashboard after setup completes
      navigate('/dashboard', { replace: true });
    } catch (error) {
      console.error('Setup error:', error);
      toast.error('Setup failed', {
        description: error instanceof Error ? error.message : 'Please try again or contact support.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted/50 p-4">
      <div className="w-full max-w-md">
        <Card className="border-border/40 bg-background/80 backdrop-blur">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Setup Your Business</CardTitle>
            <CardDescription>
              Complete the setup to start using the POS system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="business">Business</TabsTrigger>
                <TabsTrigger value="location">Location</TabsTrigger>
              </TabsList>
              
              <TabsContent value="business">
                <form onSubmit={handleBusinessSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Business Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="name" 
                      name="name" 
                      value={businessData.name} 
                      onChange={handleBusinessChange} 
                      placeholder="Your Business Name" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="type">Business Type</Label>
                    <Input 
                      id="type" 
                      name="type" 
                      value={businessData.type} 
                      onChange={handleBusinessChange} 
                      placeholder="Retail, Restaurant, etc." 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone" 
                      name="phone" 
                      value={businessData.phone} 
                      onChange={handleBusinessChange} 
                      placeholder="Business Phone" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Business Email</Label>
                    <Input 
                      id="email" 
                      name="email" 
                      type="email" 
                      value={businessData.email} 
                      onChange={handleBusinessChange} 
                      placeholder="business@example.com" 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Business Address</Label>
                    <Input 
                      id="address" 
                      name="address" 
                      value={businessData.address} 
                      onChange={handleBusinessChange} 
                      placeholder="123 Main St, City, Country" 
                    />
                  </div>
                  
                  <Button type="submit" className="w-full">
                    Continue to Location
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="location">
                <form onSubmit={handleLocationSubmit} className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Location Name <span className="text-destructive">*</span></Label>
                    <Input 
                      id="locationName" 
                      name="name" 
                      value={locationData.name} 
                      onChange={handleLocationChange} 
                      placeholder="Main Store" 
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locationType">Location Type</Label>
                    <Input 
                      id="locationType" 
                      name="type" 
                      value={locationData.type} 
                      onChange={handleLocationChange} 
                      placeholder="retail, warehouse, etc." 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="locationAddress">Location Address</Label>
                    <Input 
                      id="locationAddress" 
                      name="address" 
                      value={locationData.address} 
                      onChange={handleLocationChange} 
                      placeholder="123 Main St, City, Country" 
                    />
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-1/2" 
                      onClick={() => setActiveTab('business')}
                    >
                      Back
                    </Button>
                    <Button 
                      type="submit" 
                      className="w-1/2" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Setting up...' : 'Complete Setup'}
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="text-sm text-muted-foreground">
            <p>You can add more locations and customize your business later.</p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default SetupWizard;
