
import React, { useState, forwardRef } from "react";
import { Eye, EyeClosed } from "lucide-react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ className, type, label, icon, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    return (
      <div className="input-wrapper">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          {label}
        </label>
        <div className="relative">
          <input
            type={isPassword && showPassword ? "text" : type}
            className={cn("auth-input", className)}
            ref={ref}
            {...props}
          />
          {isPassword ? (
            <button
              type="button"
              onClick={toggleShowPassword}
              className="input-icon hover:text-gray-600 dark:hover:text-gray-200 transition-colors focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeClosed size={20} />
              ) : (
                <Eye size={20} />
              )}
            </button>
          ) : icon ? (
            <span className="input-icon">{icon}</span>
          ) : null}
        </div>
      </div>
    );
  }
);

AuthInput.displayName = "AuthInput";

export default AuthInput;
