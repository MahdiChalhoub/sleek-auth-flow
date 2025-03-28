
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { Business } from "@/models/interfaces/businessInterfaces";

// Define form schema with zod
const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  businessId: z.string().min(1, { message: "Please select a business" }),
  rememberMe: z.boolean().default(true)
});

export type LoginFormValues = z.infer<typeof formSchema>;

interface LoginFormProps {
  onSubmit: (data: LoginFormValues) => void;
  businesses: Business[];
  isSubmitting: boolean;
}

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  businesses,
  isSubmitting
}) => {
  // Get localStorage remember me preference if it exists
  const savedRememberMe = localStorage.getItem("auth_remember_me");
  const initialRememberMe = savedRememberMe === null ? true : savedRememberMe === "true";
  
  // Retrieve last used email if remember me was checked
  const lastUsedEmail = initialRememberMe ? localStorage.getItem("auth_last_email") || "" : "";
  
  const [showPassword, setShowPassword] = useState(false);
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: lastUsedEmail,
      password: "",
      businessId: businesses.length > 0 ? businesses[0].id : "",
      rememberMe: initialRememberMe
    }
  });

  // Update the businessId when businesses change
  useEffect(() => {
    if (businesses.length > 0 && !form.getValues().businessId) {
      form.setValue('businessId', businesses[0].id);
    }
  }, [businesses, form]);
  
  const handleSubmit = (data: LoginFormValues) => {
    // Store remember me preference and email if checked
    localStorage.setItem("auth_remember_me", String(data.rememberMe));
    
    if (data.rememberMe) {
      localStorage.setItem("auth_last_email", data.email);
    } else {
      localStorage.removeItem("auth_last_email");
    }
    
    onSubmit(data);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="your.email@example.com" {...field} />
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
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="••••••••" 
                    {...field} 
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </Button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="businessId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Business</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select business" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {businesses.map(business => (
                    <SelectItem key={business.id} value={business.id}>
                      {business.name}
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
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md p-4 shadow">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Remember me
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                  Keep me logged in on this device
                </p>
              </div>
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Log In"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default LoginForm;
