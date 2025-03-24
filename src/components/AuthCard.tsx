
import React from "react";
import { cn } from "@/lib/utils";

interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  titleClassName?: string;
}

const AuthCard: React.FC<AuthCardProps> = ({
  children,
  title,
  subtitle,
  className,
  titleClassName,
}) => {
  return (
    <div className="auth-container">
      <div className={cn("form-container", className)}>
        <h1 className={cn("auth-heading", titleClassName)}>{title}</h1>
        {subtitle && <p className="auth-subheading">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
};

export default AuthCard;
