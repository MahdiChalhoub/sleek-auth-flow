
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Check } from "lucide-react";
import { toast } from "sonner";
import AuthCard from "@/components/AuthCard";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
      
      toast.success("Reset link sent", {
        description: "Please check your email for the password reset link.",
      });
    } catch (error) {
      toast.error("Failed to send reset link", {
        description: "Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title={submitted ? "Check Your Email" : "Forgot Password"} 
      subtitle={submitted 
        ? "We've sent a password reset link to your email" 
        : "Enter your email and we'll send you a link to reset your password"
      }
    >
      {!submitted ? (
        <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
          <AuthInput
            label="Email"
            type="email"
            name="email"
            placeholder="your@email.com"
            value={email}
            onChange={handleChange}
            icon={<Mail size={18} />}
            required
            autoFocus
          />

          <AuthButton type="submit" isLoading={isLoading} className="mt-6">
            Send Reset Link
          </AuthButton>

          <div className="text-center mt-6">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/90 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Link>
          </div>
        </form>
      ) : (
        <div className="animate-scale-in">
          <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          
          <p className="text-sm text-center text-gray-600 dark:text-gray-300 mb-6">
            We've sent a password reset link to <span className="font-medium">{email}</span>.
            Please check your inbox and follow the instructions to reset your password.
          </p>
          
          <AuthButton 
            onClick={() => setSubmitted(false)} 
            variant="outline" 
            className="mb-4"
          >
            Try another email
          </AuthButton>
          
          <div className="text-center mt-2">
            <Link 
              to="/login" 
              className="inline-flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary/90 transition-colors"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Login
            </Link>
          </div>
        </div>
      )}
    </AuthCard>
  );
};

export default ForgotPassword;
