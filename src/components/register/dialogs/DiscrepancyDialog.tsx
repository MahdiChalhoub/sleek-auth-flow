
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
import { useAuth } from "@/contexts/AuthContext";
import { AlertTriangle } from "lucide-react";
import { DiscrepancyResolution } from "@/models/register";

interface DiscrepancyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalDiscrepancy: number;
  discrepancyResolution: DiscrepancyResolution;
  discrepancyNotes: string;
  handleResolutionChange: (value: DiscrepancyResolution) => void;
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
  const { hasPermission } = useAuth();
  const canApproveDiscrepancy = hasPermission?.("can_approve_discrepancy") || false;
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md glass-card">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-500" />
            <DialogTitle>Resolve Discrepancy</DialogTitle>
          </div>
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
            
            {!canApproveDiscrepancy && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 rounded-md">
                <p className="text-sm text-yellow-700 dark:text-yellow-400 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" />
                  You need manager or admin privileges to approve discrepancy resolutions.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={onApproveResolution} 
            disabled={!canApproveDiscrepancy}
          >
            Approve Resolution
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DiscrepancyDialog;
