
import { Register, DiscrepancyResolution } from '@/models/register';
import { PaymentMethod } from '@/models/transaction';
import { updateRegister } from './registerService';

export async function openRegister(
  id: string, 
  openingBalance: Record<PaymentMethod, number>, 
  openedBy: string = "Current User"
): Promise<Register> {
  return updateRegister(id, {
    isOpen: true,
    openedAt: new Date().toISOString(),
    openedBy,
    openingBalance,
    currentBalance: openingBalance
  });
}

export async function closeRegister(
  id: string,
  closingBalance: Record<PaymentMethod, number>,
  expectedBalance: Record<PaymentMethod, number>,
  closedBy: string = "Current User"
): Promise<Register> {
  const discrepancies: Record<PaymentMethod, number> = {
    cash: closingBalance.cash - expectedBalance.cash,
    card: closingBalance.card - expectedBalance.card,
    bank: closingBalance.bank - expectedBalance.bank,
    wave: closingBalance.wave - expectedBalance.wave,
    mobile: closingBalance.mobile - expectedBalance.mobile,
    not_specified: closingBalance.not_specified - expectedBalance.not_specified
  };

  return updateRegister(id, {
    isOpen: false,
    closedAt: new Date().toISOString(),
    closedBy,
    currentBalance: closingBalance,
    discrepancies
  });
}

export async function resolveDiscrepancy(
  id: string,
  resolution: DiscrepancyResolution,
  notes: string,
  approvedBy: string = "Admin User"
): Promise<Register> {
  return updateRegister(id, {
    discrepancyResolution: resolution,
    discrepancyNotes: notes,
    discrepancyApprovedBy: approvedBy,
    discrepancyApprovedAt: new Date().toISOString()
  });
}
