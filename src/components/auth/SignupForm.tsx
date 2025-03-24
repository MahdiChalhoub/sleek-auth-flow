
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PasswordStrength } from "./PasswordStrength";

interface SignupFormProps {
  onSubmit?: (data: SignupFormData) => void;
}

export interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export const SignupForm: React.FC<SignupFormProps> = ({ onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SignupFormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, agreeTerms: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match", {
        description: "Please make sure your passwords match.",
      });
      return;
    }
    
    if (!formData.agreeTerms) {
      toast.error("Terms and conditions", {
        description: "Please agree to the terms and conditions to continue.",
      });
      return;
    }
    
    setIsLoading(true);

    try {
      // If there's a custom onSubmit handler, use it
      if (onSubmit) {
        await onSubmit(formData);
        return;
      }

      // Default implementation (simulating API call)
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success toast
      toast.success("Account created successfully!", {
        description: "Please verify your email to continue.",
      });
      
      // Redirect would happen here in a real app
    } catch (error) {
      toast.error("Sign up failed", {
        description: "Please check your details and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <AuthInput
        label="Full Name"
        type="text"
        name="fullName"
        placeholder="John Doe"
        value={formData.fullName}
        onChange={handleChange}
        icon={<User size={18} />}
        required
        autoFocus
      />

      <AuthInput
        label="Email"
        type="email"
        name="email"
        placeholder="your@email.com"
        value={formData.email}
        onChange={handleChange}
        icon={<Mail size={18} />}
        required
      />

      <div>
        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <PasswordStrength password={formData.password} />
      </div>

      <AuthInput
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        placeholder="••••••••"
        value={formData.confirmPassword}
        onChange={handleChange}
        icon={<Lock size={18} />}
        required
      />

      <div className="flex items-center space-x-2 mt-4">
        <Checkbox 
          id="agreeTerms" 
          checked={formData.agreeTerms}
          onCheckedChange={handleCheckboxChange}
          className="auth-checkbox"
        />
        <Label 
          htmlFor="agreeTerms" 
          className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
        >
          I agree to the{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="#" className="auth-link">Terms of Service</Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 text-xs">By using our services, you agree to our Terms of Service and Privacy Policy that outline your rights and responsibilities.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {" "}and{" "}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="#" className="auth-link">Privacy Policy</Link>
              </TooltipTrigger>
              <TooltipContent>
                <p className="w-80 text-xs">Our Privacy Policy explains how we collect, use, and protect your personal information.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      </div>

      <AuthButton type="submit" isLoading={isLoading} className="mt-6">
        Create Account
      </AuthButton>

      <div className="text-center mt-6">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="auth-link font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </form>
  );
};
