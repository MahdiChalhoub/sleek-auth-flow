
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { NewSalesReturnForm } from "@/components/returns/NewSalesReturnForm";

export function NewSalesReturnButton() {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Sales Return
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Sales Return</DialogTitle>
          <DialogDescription>
            Process a sales return for a customer. Select the invoice or add items manually.
          </DialogDescription>
        </DialogHeader>
        <NewSalesReturnForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
