
import React, { useState } from "react";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertCircle } from "lucide-react";

interface SecurityCodeDialogProps {
  title: string;
  description: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const SecurityCodeDialog: React.FC<SecurityCodeDialogProps> = ({
  title,
  description,
  onConfirm,
  onCancel
}) => {
  const [securityCode, setSecurityCode] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would verify this code against a stored security code
    if (securityCode === "1234") {
      onConfirm();
    } else {
      setError("Invalid security code. Please try again.");
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>

      <form onSubmit={handleSubmit} className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="securityCode">Security Code (4 digits)</Label>
          <Input
            id="securityCode"
            type="password"
            placeholder="Enter 4-digit code"
            maxLength={4}
            pattern="[0-9]{4}"
            value={securityCode}
            onChange={(e) => {
              setSecurityCode(e.target.value);
              setError("");
            }}
            required
          />
          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm mt-1">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            This action requires security verification. Please enter your 4-digit security code.
          </p>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Confirm
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};

export default SecurityCodeDialog;
