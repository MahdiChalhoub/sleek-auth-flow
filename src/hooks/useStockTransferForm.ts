
import { useState, useEffect } from "react";
import { Location } from "@/types/location";
import { toast } from "sonner";

interface TransferFormData {
  source: string;
  destination: string;
  reason: string;
  notes: string;
}

interface TransferItem {
  productId: string;
  quantity: number;
}

export const useStockTransferForm = (
  currentLocation: Location | null,
  availableLocations: Location[]
) => {
  const [formData, setFormData] = useState<TransferFormData>({
    source: currentLocation?.name || "",
    destination: "",
    reason: "",
    notes: ""
  });

  const [items, setItems] = useState<TransferItem[]>([
    { productId: "", quantity: 1 }
  ]);

  // Set the current location as the default source when it changes
  useEffect(() => {
    if (currentLocation) {
      setFormData(prev => ({
        ...prev,
        source: currentLocation.name
      }));
    }
  }, [currentLocation]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleItemChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [name]: value };
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { productId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const validateForm = () => {
    // Validate that source and destination are different
    if (formData.source === formData.destination && formData.destination !== "N/A") {
      toast.error("Source and destination cannot be the same");
      return false;
    }

    // Validate all form fields
    if (!formData.source) {
      toast.error("Source location is required");
      return false;
    }

    if (!formData.destination) {
      toast.error("Destination location is required");
      return false;
    }

    if (!formData.reason) {
      toast.error("Reason is required");
      return false;
    }

    // Validate all product selections
    for (let i = 0; i < items.length; i++) {
      if (!items[i].productId) {
        toast.error(`Please select a product for item #${i+1}`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent, onClose?: () => void) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Transfer data:", { ...formData, items });
      toast.success("Stock transfer created successfully");
      onClose && onClose();
    }
  };

  // Filter out the current location from destination options
  const destinationLocations = availableLocations
    .filter(loc => loc.name !== formData.source)
    .map(loc => loc.name);

  const reasons = [
    "Regular Restock",
    "Display Units",
    "Damage",
    "Theft",
    "Adjustment",
    "Return to Supplier",
    "Other"
  ];

  return {
    formData,
    items,
    destinationLocations,
    reasons,
    handleChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit
  };
};
