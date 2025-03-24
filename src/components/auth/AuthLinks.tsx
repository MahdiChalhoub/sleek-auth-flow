
import React from "react";
import { Link } from "react-router-dom";

interface AuthLinksProps {
  showForgotPassword?: boolean;
  showSignup?: boolean;
}

const AuthLinks: React.FC<AuthLinksProps> = ({ 
  showForgotPassword = true,
  showSignup = true 
}) => {
  return (
    <>
      {showForgotPassword && (
        <div className="text-center text-sm">
          <Link to="/forgot-password" className="text-primary hover:underline">
            Forgot password?
          </Link>
        </div>
      )}
      {showSignup && (
        <div className="text-center text-sm">
          Don't have an account?{" "}
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      )}
    </>
  );
};

export default AuthLinks;
