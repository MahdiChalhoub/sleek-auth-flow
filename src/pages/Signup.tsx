
import React from "react";
import AuthCard from "@/components/AuthCard";
import { SignupForm } from "@/components/auth/SignupForm";

const Signup = () => {
  return (
    <AuthCard 
      title="Create Account" 
      subtitle="Sign up to get started with our POS system"
    >
      <SignupForm />
    </AuthCard>
  );
};

export default Signup;
