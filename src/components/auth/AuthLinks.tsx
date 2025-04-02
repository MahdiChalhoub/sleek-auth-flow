
import React from 'react';
import { Link } from 'react-router-dom';

export interface AuthLinksProps {
  showSignup?: boolean;
  showForgotPassword?: boolean;
  loginText?: string;
  signupText?: string;
  forgotPasswordText?: string;
}

const AuthLinks: React.FC<AuthLinksProps> = ({
  showSignup = true,
  showForgotPassword = true,
  loginText = "Already have an account?",
  signupText = "Don't have an account?",
  forgotPasswordText = "Forgot your password?"
}) => {
  return (
    <div className="flex flex-col items-center space-y-2 text-sm">
      {showSignup && (
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">{signupText}</span>
          <Link to="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      )}

      {!showSignup && (
        <div className="flex items-center space-x-1">
          <span className="text-muted-foreground">{loginText}</span>
          <Link to="/login" className="text-primary hover:underline">
            Log in
          </Link>
        </div>
      )}

      {showForgotPassword && (
        <Link to="/forgot-password" className="text-primary hover:underline">
          {forgotPasswordText}
        </Link>
      )}
    </div>
  );
};

export default AuthLinks;
