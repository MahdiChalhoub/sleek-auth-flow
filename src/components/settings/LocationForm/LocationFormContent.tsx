
import React from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationBasicInfoFields } from "./LocationBasicInfoFields";
import { LocationContactFields } from "./LocationContactFields";
import { LocationManagerField } from "./LocationManagerField";

interface LocationFormContentProps {
  form: UseFormReturn<any>;
  onSubmit: (values: any) => void;
  onCancel: () => void;
}

export const LocationFormContent: React.FC<LocationFormContentProps> = ({
  form,
  onSubmit,
  onCancel
}) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <LocationBasicInfoFields control={form.control} />
        <LocationContactFields control={form.control} />
        <LocationManagerField control={form.control} />
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Save Location</Button>
        </DialogFooter>
      </form>
    </Form>
  );
};
