
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm, SignupFormData } from "@/components/auth/SignupForm";
import { supabase } from "@/lib/supabase";

const Signup: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (data: SignupFormData) => {
    setIsSubmitting(true);
    
    try {
      // Check if passwords match
      if (data.password !== data.confirmPassword) {
        toast.error("Passwords don't match", {
          description: "Please make sure your passwords match.",
        });
        return;
      }
      
      // Register with Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.fullName
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account created successfully!", {
        description: "Please check your email to verify your account.",
      });
      
      // Navigate to login page
      navigate("/login");
      
    } catch (error: any) {
      toast.error("Sign up failed", {
        description: error.message || "Please check your details and try again.",
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
              Enter your information to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignupForm onSubmit={handleSignup} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
