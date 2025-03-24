
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface DiscrepancyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalDiscrepancy: number;
  discrepancyResolution: string;
  discrepancyNotes: string;
  handleResolutionChange: (value: string) => void;
  setDiscrepancyNotes: (notes: string) => void;
  onApproveResolution: () => void;
}

export const DiscrepancyDialog: React.FC<DiscrepancyDialogProps> = ({
  isOpen,
  onClose,
  totalDiscrepancy,
  discrepancyResolution,
  discrepancyNotes,
  handleResolutionChange,
  setDiscrepancyNotes,
  onApproveResolution
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <DialogTitle>Resolve Discrepancy</DialogTitle>
          <DialogDescription>
            Total discrepancy: ${totalDiscrepancy.toFixed(2)}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Resolution Method:</label>
              <Select value={discrepancyResolution} onValueChange={handleResolutionChange}>
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="Select resolution method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="deduct_salary">Deduct from Salary</SelectItem>
                  <SelectItem value="ecart_caisse">Assign to Écart de Caisse</SelectItem>
                  <SelectItem value="approved">Approve Discrepancy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium">Notes:</label>
              <textarea 
                className="mt-1.5 w-full px-3 py-2 border border-input rounded-md glass-input h-24"
                placeholder="Add notes about this discrepancy resolution..."
                value={discrepancyNotes}
                onChange={(e) => setDiscrepancyNotes(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onApproveResolution}>
            Approve Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscrepancyDialog;
