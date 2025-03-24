
import React, { useState, useEffect } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MapPin } from "lucide-react";
import { mockProducts } from "@/models/product";
import { Branch } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";

interface CreateTransferModalProps {
  onClose?: () => void;
  currentLocation: Branch | null;
  availableLocations: Branch[];
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({ 
  onClose,
  currentLocation,
  availableLocations 
}) => {
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    reason: "",
    notes: ""
  });

  const [items, setItems] = useState<any[]>([
    { productId: "", quantity: 1 }
  ]);

  // Set the current location as the default source
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate that source and destination are different
    if (formData.source === formData.destination && formData.destination !== "N/A") {
      toast.error("Source and destination cannot be the same");
      return;
    }
    
    console.log("Transfer data:", { ...formData, items });
    toast.success("Stock transfer created successfully");
    onClose && onClose();
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

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Create Stock Transfer</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new stock transfer or adjustment.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-6 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="source">Source Location</Label>
            <select
              id="source"
              name="source"
              value={formData.source}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Select Source Location</option>
              {availableLocations.map(location => (
                <option 
                  key={location.id} 
                  value={location.name}
                  disabled={currentLocation && location.name !== currentLocation.name}
                >
                  {location.name} {location.name === currentLocation?.name ? "(Current)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="destination">Destination</Label>
            <select
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Select Destination</option>
              {destinationLocations.map(locationName => (
                <option key={locationName} value={locationName}>
                  {locationName}
                </option>
              ))}
              <option value="N/A">N/A (For adjustments, damage, etc.)</option>
            </select>
          </div>

          <div>
            <Label htmlFor="reason">Reason</Label>
            <select
              id="reason"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              required
            >
              <option value="">Select Reason</option>
              {reasons.map(reason => (
                <option key={reason} value={reason}>{reason}</option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={2}
            />
          </div>
        </div>

        {/* Items */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Transfer Items</Label>
            <Button type="button" variant="outline" size="sm" onClick={addItem}>
              <Plus className="h-4 w-4 mr-1" />
              Add Item
            </Button>
          </div>

          <div className="rounded-md border overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="h-10 px-4 text-left font-medium">Product</th>
                  <th className="h-10 px-4 text-center font-medium w-20">Quantity</th>
                  <th className="h-10 px-4 text-center font-medium w-10"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      <select
                        name="productId"
                        value={item.productId}
                        onChange={(e) => handleItemChange(index, e)}
                        className="w-full rounded-md border-0 bg-transparent focus:ring-0 sm:text-sm"
                        required
                      >
                        <option value="">Select Product</option>
                        {mockProducts.map(p => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        name="quantity"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, e)}
                        min="1"
                        className="h-8 text-center"
                        required
                      />
                    </td>
                    <td className="p-2 text-center">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(index)}
                        className="h-8 w-8 text-destructive"
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            Create Transfer
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default CreateTransferModal;
