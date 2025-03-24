
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { Business } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";

const formSchema = z.object({
  businessId: z.string({
    required_error: "Please select a business",
  }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => Promise<void>;
  businesses: Business[];
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, businesses, isSubmitting }) => {
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessId: "",
      email: "",
      password: "",
    },
  });
  
  // Preselect first business if there's only one
  React.useEffect(() => {
    if (businesses.length === 1) {
      form.setValue("businessId", businesses[0].id);
    }
  }, [businesses, form]);
  
  const handleSubmit = async (data: LoginFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Please check your credentials.");
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="businessId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Select Business</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
                disabled={isSubmitting}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a business" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businesses.map((business) => (
                    <SelectItem 
                      key={business.id} 
                      value={business.id}
                      className="flex items-center gap-2"
                    >
                      <div className="flex items-center gap-2">
                        {business.logoUrl ? (
                          <img 
                            src={business.logoUrl} 
                            alt={business.name} 
                            className="h-5 w-5 rounded-full"
                          />
                        ) : (
                          <Building className="h-5 w-5" />
                        )}
                        {business.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  placeholder="your.email@example.com" 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="********" 
                  {...field} 
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Logging in..." : "Login"}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
