
import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface SecurityCheckDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  actionType: 'delete' | 'discount';
}

const SecurityCheckDialog = ({ isOpen, onClose, onConfirm, actionType }: SecurityCheckDialogProps) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  
  // In a real app, this would check against a database or API
  const validateCode = () => {
    const validCode = "1234"; // Demo purposes only
    if (code === validCode) {
      onConfirm();
      onClose();
      setCode("");
      setError(false);
      toast.success(`Access granted for ${actionType} action`);
    } else {
      setError(true);
      toast.error("Invalid security code");
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      validateCode();
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        setCode("");
        setError(false);
      }
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Security Verification Required
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <p className="text-muted-foreground mb-4">
            Please enter your security code to {actionType === 'delete' ? 'remove this item' : 'apply a discount'}.
          </p>
          
          <div className={`flex relative ${error ? 'animate-shake' : ''}`}>
            <Input
              type="password"
              placeholder="Enter security code"
              value={code}
              onChange={(e) => {
                setCode(e.target.value);
                if (error) setError(false);
              }}
              onKeyDown={handleKeyDown}
              className={error ? "border-red-500 pr-10" : ""}
              autoFocus
            />
            {error && (
              <AlertCircle className="absolute right-3 top-2.5 h-5 w-5 text-red-500" />
            )}
          </div>
          
          {error && (
            <p className="text-red-500 text-sm mt-1">Invalid security code. Please try again.</p>
          )}
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={validateCode}>
            Verify
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityCheckDialog;
