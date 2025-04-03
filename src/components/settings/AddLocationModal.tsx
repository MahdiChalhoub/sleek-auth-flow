
import React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { LocationFormContent } from "./LocationForm/LocationFormContent";
import { Location } from "@/types/location";

interface AddLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (location: Location) => void;
}

// Make sure the schema matches the Branch interface type requirements
const locationSchema = z.object({
  name: z.string().min(2, { message: "Location name must be at least 2 characters" }),
  type: z.enum(["retail", "warehouse", "office", "other"]),
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
  }),
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
      type: "retail",
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
    const newLocation: Location = {
      id: `branch-${Date.now()}`,
      name: values.name,
      type: values.type,
      address: values.address,
      phone: values.phone || "",
      email: values.email || "",
      businessId: "", // This will be set by the parent component
      status: "active",
      isDefault: false,
      locationCode: values.locationCode || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      openingHours: values.openingHours
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
