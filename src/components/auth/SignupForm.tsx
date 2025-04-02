
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
}

export interface SignupFormProps {
  onSubmit: (data: SignupFormData) => Promise<void>;
  isSubmitting?: boolean;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSubmit, isSubmitting = false }) => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  const password = watch('password');

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input
          placeholder="Full Name"
          {...register('fullName', { required: 'Full name is required' })}
        />
        {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
      </div>
      
      <div>
        <Input
          type="email"
          placeholder="Email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      
      <div>
        <Input
          type="password"
          placeholder="Password"
          {...register('password', { 
            required: 'Password is required',
            minLength: { value: 8, message: 'Password must be at least 8 characters' }
          })}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      
      <div>
        <Input
          type="password"
          placeholder="Confirm Password"
          {...register('confirmPassword', {
            required: 'Please confirm your password',
            validate: value => value === password || 'Passwords do not match'
          })}
        />
        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
      </div>
      
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Sign Up'}
      </Button>
    </form>
  );
};

export default SignupForm;
