
import { useEffect, useState } from "react";
import { useRegisterSessions } from "@/hooks/useRegisterSessions";
import { Register, DiscrepancyResolution } from "@/models/interfaces/registerInterfaces";
import { PaymentMethod } from "@/models/transaction";
import { openRegister, closeRegister, resolveDiscrepancy } from "@/hooks/register/registerOperations";

export function useRegister(id: string) {
  const { registers, refresh: refreshAll, isLoading: isLoadingAll } = useRegisterSessions();
  
  const [register, setRegister] = useState<Register | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const getRegisterById = async (registerId: string): Promise<Register | null> => {
    const foundRegister = registers.find(reg => reg.id === registerId) || null;
    return foundRegister;
  };

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
  }, [id, registers]);

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
    resolveDiscrepancy: handleResolveDiscrepancy,
    getRegisterById
  };
}
