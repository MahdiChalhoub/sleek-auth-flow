
import { useEffect, useState } from "react";
import { useRegisterSessions } from "@/hooks/useRegisterSessions";
import { Register, DiscrepancyResolution } from "@/models/register";
import { PaymentMethod } from "@/models/transaction";

export function useRegister(id: string) {
  const { 
    getRegisterById, 
    refresh, 
    openRegister,
    closeRegister,
    resolveDiscrepancy,
    isLoading: isLoadingAll 
  } = useRegisterSessions();
  
  const [register, setRegister] = useState<Register | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadRegister = async () => {
    setIsLoading(true);
    try {
      const data = await getRegisterById(id);
      setRegister(data);
      setError(null);
    } catch (err) {
      console.error(`Error loading register ${id}:`, err);
      setError(err instanceof Error ? err : new Error(`Failed to load register ${id}`));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRegister();
  }, [id]);

  const handleOpenRegister = async (openingBalance: Record<PaymentMethod, number>) => {
    try {
      if (!register) return null;
      const updatedRegister = await openRegister(register.id, openingBalance);
      setRegister(updatedRegister);
      return updatedRegister;
    } catch (error) {
      console.error("Error opening register:", error);
      throw error;
    }
  };

  const handleCloseRegister = async (
    closingBalance: Record<PaymentMethod, number>,
    expectedBalance: Record<PaymentMethod, number>
  ) => {
    try {
      if (!register) return null;
      const updatedRegister = await closeRegister(register.id, closingBalance, expectedBalance);
      setRegister(updatedRegister);
      return updatedRegister;
    } catch (error) {
      console.error("Error closing register:", error);
      throw error;
    }
  };

  const handleResolveDiscrepancy = async (
    resolution: DiscrepancyResolution,
    notes: string
  ) => {
    try {
      if (!register) return null;
      const updatedRegister = await resolveDiscrepancy(register.id, resolution, notes);
      setRegister(updatedRegister);
      return updatedRegister;
    } catch (error) {
      console.error("Error resolving discrepancy:", error);
      throw error;
    }
  };

  return {
    register,
    isLoading: isLoading || isLoadingAll,
    error,
    refresh: loadRegister,
    openRegister: handleOpenRegister,
    closeRegister: handleCloseRegister,
    resolveDiscrepancy: handleResolveDiscrepancy
  };
}
