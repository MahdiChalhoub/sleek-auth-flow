
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
import { useAuth } from "@/contexts/AuthContext";

interface SecurityCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'delete' | 'discount' | 'lock' | 'verify' | 'close_register';
  requiredPermission?: string;
}

const SecurityCheckDialog = ({
  isOpen,
  onClose,
  onConfirm,
  actionType,
  requiredPermission
}: SecurityCheckDialogProps) => {
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState(false);
  const { user, hasPermission } = useAuth();
  
  // Reset state when dialog opens
  React.useEffect(() => {
    if (isOpen) {
      setSecurityCode("");
      setError(false);
    }
  }, [isOpen]);
  
  // Handle verify button click
  const handleVerify = () => {
    // Check if user has required permission first
    if (requiredPermission && !hasPermission(requiredPermission)) {
      setError(true);
      return;
    }
    
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
  const getDialogContent = () => {
    switch (actionType) {
      case 'delete':
        return {
          title: "Confirm Item Removal",
          description: "Please enter your security code to remove this item from the cart.",
          icon: <ShieldAlert className="h-5 w-5 text-destructive" />
        };
      case 'discount':
        return {
          title: "Apply Discount",
          description: "Please enter your security code to apply a discount to this item.",
          icon: <ShieldCheck className="h-5 w-5 text-primary" />
        };
      case 'lock':
        return {
          title: "Lock Transaction",
          description: "Please enter your security code to lock this transaction from further edits.",
          icon: <ShieldCheck className="h-5 w-5 text-blue-500" />
        };
      case 'verify':
        return {
          title: "Verify Transaction",
          description: "Please enter your security code to verify this transaction as accurate.",
          icon: <ShieldCheck className="h-5 w-5 text-green-500" />
        };
      case 'close_register':
        return {
          title: "Close Register with Discrepancies",
          description: "An admin code is required to approve closing a register with discrepancies.",
          icon: <ShieldAlert className="h-5 w-5 text-yellow-500" />
        };
      default:
        return {
          title: "Security Check",
          description: "Please enter your security code to continue.",
          icon: <ShieldCheck className="h-5 w-5 text-primary" />
        };
    }
  };
  
  const content = getDialogContent();
  
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass-card">
        <AlertDialogHeader>
          <div className="flex items-center gap-2">
            {content.icon}
            <AlertDialogTitle>{content.title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription>
            {content.description}
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
              <p className="text-sm text-destructive">
                {requiredPermission && !hasPermission(requiredPermission)
                  ? "You don't have permission to perform this action."
                  : "Invalid security code. Please try again."}
              </p>
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
