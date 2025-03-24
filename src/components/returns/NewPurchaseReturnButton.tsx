
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewPurchaseReturnForm } from "@/components/returns/NewPurchaseReturnForm";

export function NewPurchaseReturnButton() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Purchase Return
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Purchase Return</DialogTitle>
          <DialogDescription>
            Process a purchase return to a supplier. Select the purchase order or add items manually.
          </DialogDescription>
        </DialogHeader>
        <NewPurchaseReturnForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
