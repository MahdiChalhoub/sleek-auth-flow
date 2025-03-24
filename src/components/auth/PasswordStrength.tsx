
import React from "react";

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  const passwordStrength = () => {
    if (!password) return "";
    if (password.length < 8) return "Weak";
    if (/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])/.test(password)) return "Strong";
    return "Medium";
  };

  const getPasswordColor = () => {
    const strength = passwordStrength();
    if (strength === "Weak") return "text-red-500";
    if (strength === "Medium") return "text-yellow-500";
    if (strength === "Strong") return "text-green-500";
    return "";
  };

  if (!password) return null;

  return (
    <div className="mt-1 ml-1 text-xs flex items-center">
      <span className={getPasswordColor()}>
        Password strength: {passwordStrength()}
      </span>
    </div>
  );
};
