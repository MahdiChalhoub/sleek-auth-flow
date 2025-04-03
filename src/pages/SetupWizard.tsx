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
  
  // Business form state
  const [businessData, setBusinessData] = useState<BusinessFormData>({
    name: '',
    type: 'Retail',
    phone: '',
    email: '',
    address: ''
  });
  
  // Location form state
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
    
    // Basic validation
    if (!businessData.name.trim()) {
      toast.error('Business name is required');
      return;
    }
    
    // Move to next tab
    setActiveTab('location');
  };
  
  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!locationData.name.trim()) {
      toast.error('Location name is required');
      return;
    }
    
    // Submit both forms
    handleFinalSubmit();
  };
  
  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get current user
      const { data: userData, error: userError } = await supabase.auth.getUser();
      
      if (userError || !userData.user) {
        throw new Error('You must be logged in to complete setup');
      }
      
      // Check if business name already exists
      const businessNameCheck = await fromTable('businesses')
        .select('id')
        .eq('name', businessData.name)
        .maybeSingle();
        
      if (isDataResponse(businessNameCheck) && businessNameCheck.data) {
        throw new Error('A business with this name already exists. Please choose a different name.');
      }
      
      // Check if phone already exists (if provided)
      if (businessData.phone) {
        const phoneCheck = await fromTable('businesses')
          .select('id')
          .eq('phone', businessData.phone)
          .maybeSingle();
          
        if (isDataResponse(phoneCheck) && phoneCheck.data) {
          throw new Error('A business with this phone number already exists.');
        }
      }
      
      // 1. Create business
      const businessResponse = await fromTable('businesses')
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
      
      if (!isDataResponse(businessResponse)) {
        throw new Error('Failed to create business');
      }
      
      // Verify business data exists and has the proper shape
      if (!businessResponse.data || businessResponse.data.length === 0) {
        throw new Error('No business data returned');
      }
      
      const businessObj = businessResponse.data[0];
      
      if (businessObj && typeof businessObj === 'object' && 'id' in businessObj) {
        // Safe type assertion after validation
        const businessId = (businessObj as { id: string }).id;
        
        try {
          // 2. Create location
          const locationResponse = await fromTable('locations')
            .insert({
              name: locationData.name,
              type: locationData.type,
              address: locationData.address,
              business_id: businessId,
              status: 'active',
              is_default: true
            });
          
          if (!isDataResponse(locationResponse)) {
            console.error('Error creating location:', locationResponse);
            // Continue anyway, user can create locations later
          }
        } catch (locationError) {
          console.error('Failed to create location:', locationError);
          // Continue anyway, user can create locations later
        }
      } else {
        console.warn('Invalid business data returned from database');
      }
      
      // 3. Mark setup as complete
      await saveSetupStatus(true);
      
      toast.success('Setup completed successfully!');
      
      // 4. Navigate to dashboard
      navigate('/dashboard');
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
