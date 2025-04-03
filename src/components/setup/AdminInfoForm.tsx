
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface AdminData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface AdminInfoFormProps {
  data: AdminData;
  onChange: (data: AdminData) => void;
}

const AdminInfoForm: React.FC<AdminInfoFormProps> = ({ data, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (field: keyof AdminData, value: string) => {
    onChange({ ...data, [field]: value });
  };

  const passwordsMatch = data.password === data.confirmPassword;
  const passwordTooShort = data.password.length > 0 && data.password.length < 6;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-4">Super Admin Account</h2>
        <p className="text-muted-foreground mb-6">
          Create your Super Admin account. This account will have full access to manage your POS system.
        </p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="fullName"
              placeholder="Your full name"
              value={data.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={data.email}
              onChange={(e) => handleChange('email', e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a secure password"
                value={data.password}
                onChange={(e) => handleChange('password', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {passwordTooShort && (
              <p className="text-sm text-destructive mt-1">Password must be at least 6 characters</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={data.confirmPassword}
                onChange={(e) => handleChange('confirmPassword', e.target.value)}
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            {data.confirmPassword && !passwordsMatch && (
              <p className="text-sm text-destructive mt-1">Passwords do not match</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminInfoForm;
