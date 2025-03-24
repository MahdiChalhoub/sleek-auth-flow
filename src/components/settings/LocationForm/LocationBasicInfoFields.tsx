
import React from "react";
import { Control } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface LocationBasicInfoFieldsProps {
  control: Control<any>;
}

export const LocationBasicInfoFields: React.FC<LocationBasicInfoFieldsProps> = ({
  control
}) => {
  return (
    <>
      <FormField
        control={control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location Name</FormLabel>
            <FormControl>
              <Input placeholder="Enter location name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Type</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="store">Store</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="pickup">Pickup Point</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={control}
          name="locationCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location Code (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. NYC-001" {...field} />
              </FormControl>
              <FormDescription className="text-xs">
                Unique identifier for this location
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      
      <FormField
        control={control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Address</FormLabel>
            <FormControl>
              <Input placeholder="Full street address" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};
