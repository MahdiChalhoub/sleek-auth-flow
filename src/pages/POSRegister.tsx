
import React, { useState, useEffect } from "react";
import { useRegisterSessions } from "@/hooks/useRegisterSessions";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterMetaCard from "@/components/RegisterMetaCard";
import RegisterBalanceCard from "@/components/RegisterBalanceCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { 
  OpenRegisterDialog, 
  CloseRegisterDialog, 
  DiscrepancyDialog 
} from "@/components/register/dialogs";
import ClosingSummary from "@/components/register/ClosingSummary";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentMethod } from "@/models/transaction";
import { DiscrepancyResolution, Register } from "@/models/interfaces/registerInterfaces";

const POSRegister = () => {
  const { registers, isLoading: registersLoading } = useRegisterSessions();
  const [register, setRegister] = useState<Register | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Dialog states
  const [isOpenRegisterDialogOpen, setIsOpenRegisterDialogOpen] = useState(false);
  const [isCloseRegisterDialogOpen, setIsCloseRegisterDialogOpen] = useState(false);
  const [isDiscrepancyDialogOpen, setIsDiscrepancyDialogOpen] = useState(false);
  
  // Form states
  const [closingBalances, setClosingBalances] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    mobile: 0,
    wave: 0,
    not_specified: 0
  });
  const [discrepancies, setDiscrepancies] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    mobile: 0,
    wave: 0,
    not_specified: 0
  });
  const [discrepancyResolution, setDiscrepancyResolution] = useState<DiscrepancyResolution>('pending');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');

  // Set the first register as the active one when data loads
  useEffect(() => {
    if (registers.length > 0 && !register) {
      setRegister(registers[0]);
      setIsLoading(false);
    }
  }, [registers, register]);

  // If the active register updates in the registers list, update local state
  useEffect(() => {
    if (register && registers.length > 0) {
      const updatedRegister = registers.find(r => r.id === register.id);
      if (updatedRegister) {
        setRegister(updatedRegister);
      }
    }
  }, [registers, register]);

  // Handle opening a register
  const handleOpenRegister = async (openingBalance: Record<PaymentMethod, number>) => {
    try {
      if (!register) return;
      const { openRegister } = useRegisterSessions();
      const updatedRegister = await openRegister(register.id, openingBalance);
      setRegister(updatedRegister);
      setIsOpenRegisterDialogOpen(false);
    } catch (error) {
      console.error("Error opening register:", error);
    }
  };

  // Handle closing a register
  const handleCloseRegister = async () => {
    try {
      if (!register) return;
      const { closeRegister } = useRegisterSessions();
      const updatedRegister = await closeRegister(
        register.id,
        closingBalances,
        register.expectedBalance
      );
      
      // Calculate discrepancies
      const newDiscrepancies: Record<PaymentMethod, number> = {
        cash: closingBalances.cash - register.expectedBalance.cash,
        card: closingBalances.card - register.expectedBalance.card,
        bank: closingBalances.bank - register.expectedBalance.bank,
        mobile: closingBalances.mobile - register.expectedBalance.mobile,
        wave: closingBalances.wave - register.expectedBalance.wave,
        not_specified: closingBalances.not_specified - register.expectedBalance.not_specified
      };
      
      setRegister(updatedRegister);
      setDiscrepancies(newDiscrepancies);
      setIsCloseRegisterDialogOpen(false);
      
      // If there are discrepancies, open the discrepancy dialog
      if (Object.values(newDiscrepancies).some(value => value !== 0)) {
        setIsDiscrepancyDialogOpen(true);
      }
    } catch (error) {
      console.error("Error closing register:", error);
    }
  };

  // Handle balance changes in the closing dialog
  const handleBalanceChange = (method: PaymentMethod, value: string) => {
    setClosingBalances(prev => ({
      ...prev,
      [method]: parseFloat(value) || 0
    }));
  };

  // Handle resolution changes in the discrepancy dialog
  const handleResolutionChange = (value: DiscrepancyResolution) => {
    setDiscrepancyResolution(value);
  };

  // Handle discrepancy approval
  const handleDiscrepancyApproval = async () => {
    try {
      if (!register) return;
      const { resolveDiscrepancy } = useRegisterSessions();
      const updatedRegister = await resolveDiscrepancy(
        register.id,
        discrepancyResolution,
        discrepancyNotes
      );
      setRegister(updatedRegister);
      setIsDiscrepancyDialogOpen(false);
    } catch (error) {
      console.error("Error resolving discrepancy:", error);
    }
  };

  // Calculate total discrepancy
  const getTotalDiscrepancy = () => {
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };

  if (isLoading || registersLoading || !register) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
        <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full lg:col-span-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <RegisterHeader 
          isRegisterOpen={register.isOpen}
          onOpenRegisterClick={() => setIsOpenRegisterDialogOpen(true)}
          onCloseRegisterClick={() => setIsCloseRegisterDialogOpen(true)}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <RegisterMetaCard register={register} />
          
          <div className="lg:col-span-2">
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>
                  Current balance for all payment methods
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <RegisterBalanceCard 
                    title="Cash" 
                    value={register.currentBalance.cash} 
                    icon={<DollarSign className="h-5 w-5 text-green-500" />}
                    className="border-l-4 border-green-500"
                    status="success"
                    showTooltip={true}
                    tooltipContent="Physical cash balance in register"
                  />
                  <RegisterBalanceCard 
                    title="Card" 
                    value={register.currentBalance.card} 
                    icon={<CreditCard className="h-5 w-5 text-blue-500" />}
                    className="border-l-4 border-blue-500"
                    status="info"
                    showTooltip={true}
                    tooltipContent="Credit/debit card transactions"
                  />
                  <RegisterBalanceCard 
                    title="Bank" 
                    value={register.currentBalance.bank} 
                    icon={<Wallet className="h-5 w-5 text-purple-500" />}
                    className="border-l-4 border-purple-500"
                    status="info"
                    showTooltip={true}
                    tooltipContent="Bank transfer transactions"
                  />
                  <RegisterBalanceCard 
                    title="Wave" 
                    value={register.currentBalance.wave} 
                    icon={<Wallet className="h-5 w-5 text-orange-500" />}
                    className="border-l-4 border-orange-500"
                    status="info"
                    showTooltip={true}
                    tooltipContent="Wave mobile money transactions"
                  />
                  <RegisterBalanceCard 
                    title="Mobile" 
                    value={register.currentBalance.mobile} 
                    icon={<Wallet className="h-5 w-5 text-pink-500" />}
                    className="border-l-4 border-pink-500"
                    status="info"
                    showTooltip={true}
                    tooltipContent="Other mobile money transactions"
                  />
                  <RegisterBalanceCard 
                    title="Other" 
                    value={register.currentBalance.not_specified} 
                    icon={<Wallet className="h-5 w-5 text-gray-500" />}
                    className="border-l-4 border-gray-500"
                    status="info"
                    showTooltip={true}
                    tooltipContent="Other payment methods"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ClosingSummary 
          register={register as any}
          discrepancies={discrepancies}
          closingBalances={closingBalances}
          onRequestApproval={() => setIsDiscrepancyDialogOpen(true)}
        />
      </div>
      
      {/* Dialogs */}
      <OpenRegisterDialog 
        isOpen={isOpenRegisterDialogOpen}
        onClose={() => setIsOpenRegisterDialogOpen(false)}
        register={register as any}
        onOpenRegister={handleOpenRegister}
      />
      
      <CloseRegisterDialog 
        isOpen={isCloseRegisterDialogOpen}
        onClose={() => setIsCloseRegisterDialogOpen(false)}
        register={register as any}
        closingBalances={closingBalances}
        handleBalanceChange={handleBalanceChange}
        onCloseRegister={handleCloseRegister}
      />
      
      <DiscrepancyDialog 
        isOpen={register.discrepancies && Object.values(register.discrepancies).some(value => value !== 0) && !register.discrepancyResolution && isDiscrepancyDialogOpen}
        onClose={() => setIsDiscrepancyDialogOpen(false)}
        totalDiscrepancy={getTotalDiscrepancy()}
        discrepancyResolution={discrepancyResolution}
        discrepancyNotes={discrepancyNotes}
        handleResolutionChange={handleResolutionChange}
        setDiscrepancyNotes={setDiscrepancyNotes}
        onApproveResolution={handleDiscrepancyApproval}
      />
    </div>
  );
};

export default POSRegister;
