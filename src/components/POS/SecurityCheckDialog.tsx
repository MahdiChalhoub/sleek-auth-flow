
import React, { useState } from "react";
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter,
  AlertDialogCancel
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShieldAlert, ShieldCheck } from "lucide-react";

interface SecurityCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'delete' | 'discount';
}

const SecurityCheckDialog = ({
  isOpen,
  onClose,
  onConfirm,
  actionType
}: SecurityCheckDialogProps) => {
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState(false);
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSecurityCode("");
      setError(false);
    }
  }, [isOpen]);
  
  // Handle verify button click
  const handleVerify = () => {
    // In a real app, this would check the security code against an API or database
    // For this demo, we're using a simple hardcoded check
    if (securityCode === "1234") {
      setError(false);
      onConfirm();
      onClose();
    } else {
      setError(true);
    }
  };
  
  // Get title and description based on action type
  const title = actionType === 'delete' ? "Confirm Item Removal" : "Apply Discount";
  const description = actionType === 'delete' 
    ? "Please enter your security code to remove this item from the cart."
    : "Please enter your security code to apply a discount to this item.";
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {actionType === 'delete' ? (
              <ShieldAlert className="h-5 w-5 text-destructive" />
            ) : (
              <ShieldCheck className="h-5 w-5 text-primary" />
            )}
            <AlertDialogTitle>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-3">
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Enter security code"
              value={securityCode}
              onChange={(e) => {
                setSecurityCode(e.target.value);
                setError(false);
              }}
              className={error ? "border-destructive" : ""}
            />
            
            {error && (
              <p className="text-sm text-destructive">Invalid security code. Please try again.</p>
            )}
          </div>
        </div>
        
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <Button 
            variant={actionType === 'delete' ? "destructive" : "default"} 
            onClick={handleVerify}
          >
            Verify
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SecurityCheckDialog;
