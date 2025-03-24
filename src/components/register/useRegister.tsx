
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Register, PaymentMethod, DiscrepancyResolution } from "@/models/transaction";
import { useRegisterSessions } from "@/hooks/useRegisterSessions";

export const useRegister = (initialRegister?: Register) => {
  const {
    registers,
    getRegisterById,
    openRegister: openRegisterInDb,
    closeRegister: closeRegisterInDb,
    resolveDiscrepancy: resolveDiscrepancyInDb,
    isLoading
  } = useRegisterSessions();
  
  const [register, setRegister] = useState<Register | null>(initialRegister || null);
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
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
    not_specified: 0
  });
  
  // Track resolution for discrepancies
  const [discrepancyResolution, setDiscrepancyResolution] = useState<string>('pending');
  const [discrepancyNotes, setDiscrepancyNotes] = useState<string>('');

  // Load the first register from database if no initialRegister is provided
  useEffect(() => {
    if (!initialRegister && registers.length > 0 && !register) {
      setRegister(registers[0]);
      setClosingBalances(registers[0].currentBalance);
    }
  }, [registers, initialRegister, register]);
  
  const handleOpenRegister = async () => {
    if (!register) return;
    
    try {
      const updatedRegister = await openRegisterInDb(
        register.id,
        register.openingBalance,
        "John Admin" // Replace with actual user
      );
      
      setRegister(updatedRegister);
      setIsOpenRegisterDialogOpen(false);
      
      toast.success("Register opened successfully", {
        description: "You have opened the register and can now process transactions.",
      });
    } catch (error) {
      console.error("Error opening register:", error);
      toast.error("Failed to open register");
    }
  };

  const handleCloseRegister = async () => {
    if (!register) return;
    
    try {
      const newDiscrepancies = {
        cash: closingBalances.cash - register.expectedBalance.cash,
        card: closingBalances.card - register.expectedBalance.card,
        bank: closingBalances.bank - register.expectedBalance.bank,
        wave: closingBalances.wave - register.expectedBalance.wave,
        mobile: closingBalances.mobile - register.expectedBalance.mobile,
        not_specified: closingBalances.not_specified - register.expectedBalance.not_specified
      };
      
      setDiscrepancies(newDiscrepancies);
      
      const updatedRegister = await closeRegisterInDb(
        register.id,
        closingBalances,
        register.expectedBalance,
        "John Admin" // Replace with actual user
      );
      
      setRegister(updatedRegister);
      setIsCloseRegisterDialogOpen(false);
      
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
    } catch (error) {
      console.error("Error closing register:", error);
      toast.error("Failed to close register");
    }
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

  const handleDiscrepancyApproval = async () => {
    if (!register) return;
    
    try {
      const updatedRegister = await resolveDiscrepancyInDb(
        register.id,
        discrepancyResolution as DiscrepancyResolution,
        discrepancyNotes,
        "Admin User" // Replace with actual admin user
      );
      
      setRegister(updatedRegister);
      setIsDiscrepancyDialogOpen(false);
      
      toast.success("Discrepancy has been resolved", {
        description: `The discrepancy has been resolved with the ${discrepancyResolution} option.`,
      });
    } catch (error) {
      console.error("Error resolving discrepancy:", error);
      toast.error("Failed to resolve discrepancy");
    }
  };

  const getTotalDiscrepancy = () => {
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };
  
  return {
    register,
    isLoading,
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
