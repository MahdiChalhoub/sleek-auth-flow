
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LocationFormContent } from "./LocationForm/LocationFormContent";
import { Branch } from "@/models/interfaces/businessInterfaces";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Branch) => void;
}

// Make sure the schema matches the Branch interface type requirements
const locationSchema = z.object({
  name: z.string().min(2, { message: "Location name must be at least 2 characters" }),
  type: z.enum(["store", "warehouse", "pickup"]),
  address: z.string().min(5, { message: "Please enter a valid address" }),
  phone: z.string().optional(),
  email: z.string().email({ message: "Please enter a valid email" }).optional().or(z.literal("")),
  managerId: z.string().optional(),
  locationCode: z.string().optional(),
  openingHours: z.object({
    monday: z.string(),
    tuesday: z.string(),
    wednesday: z.string(),
    thursday: z.string(),
    friday: z.string(),
    saturday: z.string(),
    sunday: z.string(),
  }).optional(),
});

export const AddLocationModal: React.FC<AddLocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
}) => {
  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      name: "",
      type: "store",
      address: "",
      phone: "",
      email: "",
      managerId: "",
      locationCode: "",
      openingHours: {
        monday: "9:00-18:00",
        tuesday: "9:00-18:00",
        wednesday: "9:00-18:00",
        thursday: "9:00-18:00",
        friday: "9:00-18:00",
        saturday: "10:00-16:00",
        sunday: "closed",
      },
    },
  });

  const handleSubmit = (values: z.infer<typeof locationSchema>) => {
    // Create the new location object
    const newLocation: Branch = {
      id: `branch-${Date.now()}`,
      name: values.name,
      type: values.type,
      address: values.address,
      phone: values.phone,
      email: values.email,
      managerId: values.managerId,
      locationCode: values.locationCode,
      openingHours: values.openingHours,
      businessId: "", // This will be set by the parent component
      status: "active",
    };
    
    onSave(newLocation);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add New Location</DialogTitle>
          <DialogDescription>
            Create a new location for this business
          </DialogDescription>
        </DialogHeader>
        
        <LocationFormContent form={form} onSubmit={handleSubmit} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  );
};
