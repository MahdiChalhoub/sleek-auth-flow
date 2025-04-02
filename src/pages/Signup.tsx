
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SignupForm from '@/components/auth/SignupForm';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSignup = async (data: { email: string; password: string; fullName: string }) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      });
      
      if (error) throw error;
      
      toast.success('Account created successfully', {
        description: 'Please check your email to verify your account.'
      });
      
    } catch (error: any) {
      toast.error('Error creating account', {
        description: error.message || 'Please try again later.'
      });
      console.error('Signup error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex justify-center items-center min-h-screen bg-muted/40">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>
            Enter your details below to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm
            onSubmit={handleSignup}
            isSubmitting={isSubmitting}
          />
          
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
