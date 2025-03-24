
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import AuthCard from "@/components/AuthCard";
import AuthInput from "@/components/AuthInput";
import AuthButton from "@/components/AuthButton";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulating API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Success toast
      toast.success("Login successful!", {
        description: "Redirecting to dashboard...",
      });
      
      // Redirect would happen here in a real app
    } catch (error) {
      toast.error("Login failed", {
        description: "Please check your credentials and try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard 
      title="Welcome Back" 
      subtitle="Sign in to your account to continue"
    >
      <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
        <AuthInput
          label="Email"
          type="email"
          name="email"
          placeholder="your@email.com"
          value={formData.email}
          onChange={handleChange}
          icon={<Mail size={18} />}
          required
          autoFocus
        />

        <AuthInput
          label="Password"
          type="password"
          name="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="rememberMe" 
              checked={formData.rememberMe}
              onCheckedChange={handleCheckboxChange}
              className="auth-checkbox"
            />
            <Label 
              htmlFor="rememberMe" 
              className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer"
            >
              Remember me
            </Label>
          </div>

          <Link to="/forgot-password" className="auth-link">
            Forgot Password?
          </Link>
        </div>

        <AuthButton type="submit" isLoading={isLoading}>
          Sign In
        </AuthButton>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Link to="/signup" className="auth-link font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default Login;
