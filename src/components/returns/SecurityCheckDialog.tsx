
import React, { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface SecurityCheckDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
}

const SecurityCheckDialog: React.FC<SecurityCheckDialogProps> = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm
}) => {
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mock validation - in a real app, this would validate against actual manager codes
    if (securityCode === "1234") {
      setError("");
      onConfirm();
      setSecurityCode("");
    } else {
      setError("Invalid security code. Please try again.");
      toast({
        title: "Security check failed",
        description: "The security code you entered is invalid.",
        variant: "destructive"
      });
    }
  };

  const handleCancel = () => {
    setSecurityCode("");
    setError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="security-code">Manager Security Code</Label>
              <Input
                id="security-code"
                type="password"
                value={securityCode}
                onChange={(e) => setSecurityCode(e.target.value)}
                placeholder="Enter manager code"
                className={error ? "border-destructive" : ""}
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
              <p className="text-xs text-muted-foreground">
                For this demo, use code "1234"
              </p>
            </div>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" type="button" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit">
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SecurityCheckDialog;
