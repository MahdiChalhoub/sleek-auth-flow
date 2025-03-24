
import { useState } from "react";
import { toast } from "sonner";
import { Register, PaymentMethod, DiscrepancyResolution } from "@/models/transaction";

export const useRegister = (initialRegister: Register) => {
  const [register, setRegister] = useState<Register>(initialRegister);
  const [isOpenRegisterDialogOpen, setIsOpenRegisterDialogOpen] = useState(false);
  const [isCloseRegisterDialogOpen, setIsCloseRegisterDialogOpen] = useState(false);
  const [isDiscrepancyDialogOpen, setIsDiscrepancyDialogOpen] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
    not_specified: 0
  });
  const [closingBalances, setClosingBalances] = useState<Record<PaymentMethod, number>>({
    cash: initialRegister.currentBalance.cash,
    card: initialRegister.currentBalance.card,
    bank: initialRegister.currentBalance.bank,
    wave: initialRegister.currentBalance.wave,
    mobile: initialRegister.currentBalance.mobile,
    not_specified: 0
  });
  
  // Track resolution for discrepancies
  const [discrepancyResolution, setDiscrepancyResolution] = useState<string>('pending');
  const [discrepancyNotes, setDiscrepancyNotes] = useState<string>('');

  const handleOpenRegister = () => {
    setRegister({
      ...register,
      isOpen: true,
      openedAt: new Date().toISOString(),
      openedBy: "John Admin",
    });
    setIsOpenRegisterDialogOpen(false);
    toast.success("Register opened successfully", {
      description: "You have opened the register and can now process transactions.",
    });
  };

  const handleCloseRegister = () => {
    const newDiscrepancies = {
      cash: closingBalances.cash - register.expectedBalance.cash,
      card: closingBalances.card - register.expectedBalance.card,
      bank: closingBalances.bank - register.expectedBalance.bank,
      wave: closingBalances.wave - register.expectedBalance.wave,
      mobile: closingBalances.mobile - register.expectedBalance.mobile,
      not_specified: 0
    };
    
    setDiscrepancies(newDiscrepancies);
    
    const hasDiscrepancies = Object.values(newDiscrepancies).some(value => value !== 0);
    
    if (hasDiscrepancies) {
      toast.warning("Register closed with discrepancies", {
        description: "There are discrepancies in your closing balance. Please review and get approval.",
      });
    } else {
      toast.success("Register closed successfully", {
        description: "Your register has been closed with no discrepancies.",
      });
    }
    
    setRegister({
      ...register,
      isOpen: false,
      closedAt: new Date().toISOString(),
      closedBy: "John Admin",
      currentBalance: closingBalances,
      discrepancies: newDiscrepancies,
      discrepancyResolution: hasDiscrepancies ? 'pending' : undefined,
    });
    
    setIsCloseRegisterDialogOpen(false);
  };

  const handleBalanceChange = (method: PaymentMethod, value: string) => {
    const numValue = parseFloat(value) || 0;
    setClosingBalances({
      ...closingBalances,
      [method]: numValue,
    });
  };

  const handleResolutionChange = (value: string) => {
    setDiscrepancyResolution(value);
  };

  const handleDiscrepancyApproval = () => {
    setRegister({
      ...register,
      discrepancyResolution: discrepancyResolution as DiscrepancyResolution,
      discrepancyApprovedBy: "Admin User",
      discrepancyApprovedAt: new Date().toISOString(),
      discrepancyNotes: discrepancyNotes,
    });
    
    toast.success("Discrepancy has been resolved", {
      description: `The discrepancy has been resolved with the ${discrepancyResolution} option.`,
    });
    
    setIsDiscrepancyDialogOpen(false);
  };

  const getTotalDiscrepancy = () => {
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };
  
  return {
    register,
    isOpenRegisterDialogOpen,
    setIsOpenRegisterDialogOpen,
    isCloseRegisterDialogOpen,
    setIsCloseRegisterDialogOpen,
    isDiscrepancyDialogOpen,
    setIsDiscrepancyDialogOpen,
    discrepancies,
    closingBalances,
    discrepancyResolution,
    discrepancyNotes,
    setDiscrepancyNotes,
    handleOpenRegister,
    handleCloseRegister,
    handleBalanceChange,
    handleResolutionChange,
    handleDiscrepancyApproval,
    getTotalDiscrepancy
  };
};
