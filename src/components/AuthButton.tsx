
import React from "react";
import { cn } from "@/lib/utils";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

const AuthButton: React.FC<AuthButtonProps> = ({
  children,
  className,
  isLoading = false,
  variant = "primary",
  disabled,
  ...props
}) => {
  const baseStyles = "w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 active:scale-[0.98] shadow-md hover:shadow-lg";
  
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    outline: "bg-transparent border border-primary text-primary hover:bg-primary/5"
  };

  return (
    <button
      className={cn(
        baseStyles,
        variantStyles[variant],
        isLoading && "opacity-70 cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed hover:bg-primary",
        className
      )}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Processing...
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default AuthButton;
