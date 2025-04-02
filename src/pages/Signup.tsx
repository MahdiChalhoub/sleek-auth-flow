
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import SignupForm, { SignupFormData } from '@/components/auth/SignupForm';
import AuthLinks from '@/components/auth/AuthLinks';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      });
      
      if (authError) throw authError;
      
      if (!authData.user) {
        throw new Error('Failed to create account');
      }
      
      // 2. Create a default business for the user
      const { data: businessData, error: businessError } = await supabase
        .from('businesses')
        .insert({
          name: `${data.fullName}'s Business`,
          owner_id: authData.user.id,
          status: 'active',
          type: 'Retail',
          currency: 'USD',
          active: true,
          description: 'My default business'
        })
        .select()
        .single();
      
      if (businessError) {
        console.error('Error creating business:', businessError);
        // Continue anyway, user can create business later
      }
      
      // 3. Create a default location for the business
      if (businessData) {
        const { error: locationError } = await supabase
          .from('locations')
          .insert({
            name: 'Main Store',
            business_id: businessData.id,
            type: 'retail',
            status: 'active',
            is_default: true
          });
        
        if (locationError) {
          console.error('Error creating location:', locationError);
          // Continue anyway, user can create locations later
        }
      }
      
      toast.success('Account created successfully!', {
        description: 'You can now log in with your credentials.'
      });
      
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Failed to create account', {
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
            <CardTitle className="text-2xl font-bold">Create an Account</CardTitle>
            <CardDescription>
              Fill in your details to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm 
              onSubmit={handleSignup}
              isSubmitting={isSubmitting}
            />
          </CardContent>
          <CardFooter className="flex justify-center">
            <AuthLinks 
              showForgotPassword={false}
              showSignup={false}
              loginText="Already have an account?"
            />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
