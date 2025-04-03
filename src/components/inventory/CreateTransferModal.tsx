
import React from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Location } from "@/types/location";
import { useStockTransferForm } from "@/hooks/useStockTransferForm";
import TransferLocationForm from "./TransferLocationForm";
import TransferItemsTable from "./TransferItemsTable";

interface CreateTransferModalProps {
  onClose?: () => void;
  currentLocation: Location | null;
  availableLocations: Location[];
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({ 
  onClose,
  currentLocation,
  availableLocations 
}) => {
  const {
    formData,
    items,
    destinationLocations,
    reasons,
    handleChange,
    handleItemChange,
    addItem,
    removeItem,
    handleSubmit
  } = useStockTransferForm(currentLocation, availableLocations);

  return (
    <DialogContent className="sm:max-w-[700px]">
      <DialogHeader>
        <DialogTitle>Create Stock Transfer</DialogTitle>
        <DialogDescription>
          Fill in the details to create a new stock transfer or adjustment.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={(e) => handleSubmit(e, onClose)} className="space-y-6 py-4">
        <TransferLocationForm 
          formData={formData}
          destinationLocations={destinationLocations}
          availableLocations={availableLocations}
          reasons={reasons}
          currentLocation={currentLocation}
          onChange={handleChange}
        />

        <TransferItemsTable 
          items={items}
          onItemChange={handleItemChange}
          onAddItem={addItem}
          onRemoveItem={removeItem}
        />

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
