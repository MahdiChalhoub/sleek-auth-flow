
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationManagerFieldProps {
  control: Control<any>;
}

export const LocationManagerField: React.FC<LocationManagerFieldProps> = ({
  control
}) => {
  return (
    <FormField
      control={control}
      name="managerId"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Assign Manager (Optional)</FormLabel>
          <Select 
            onValueChange={field.onChange} 
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Select a manager" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="user-manager">Mike Manager</SelectItem>
              <SelectItem value="user-cashier">Cathy Cashier</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
