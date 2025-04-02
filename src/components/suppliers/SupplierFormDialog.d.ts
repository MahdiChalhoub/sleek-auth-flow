
export interface SupplierFormDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: {
    name?: string;
    address?: string;
    email?: string;
    notes?: string;
    phone?: string;
    contact_person?: string;
  }) => Promise<void>;
  supplier?: any;
}
