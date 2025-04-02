
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { SignupForm, SignupFormData } from "@/components/auth/SignupForm";
import { supabase } from "@/lib/supabase";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

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
        setIsSubmitting(false);
        return;
      }
      
      // Register with Supabase
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName
          }
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Account registration successful!", {
        description: "Your account is pending approval. You'll be notified when approved.",
      });
      
      // Navigate to waiting page
      navigate("/waiting-approval");
      
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
          <CardContent className="space-y-4">
            <Alert className="mb-4">
              <InfoIcon className="h-4 w-4" />
              <AlertDescription>
                New accounts require administrator approval before they can be used.
              </AlertDescription>
            </Alert>
            
            <SignupForm onSubmit={handleSignup} isSubmitting={isSubmitting} />
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <a href="/login" className="text-primary hover:underline">
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
