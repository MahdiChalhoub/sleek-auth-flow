
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface LocationContactFieldsProps {
  control: Control<any>;
}

export const LocationContactFields: React.FC<LocationContactFieldsProps> = ({
  control
}) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="+1 (555) 123-4567" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email (Optional)</FormLabel>
            <FormControl>
              <Input placeholder="location@business.com" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
