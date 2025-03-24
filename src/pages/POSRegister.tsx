
import React from "react";
import { mockRegister } from "@/models/transaction";
import { useRegister } from "@/components/register/useRegister";
import RegisterHeader from "@/components/register/RegisterHeader";
import RegisterMetaCard from "@/components/RegisterMetaCard";
import RegisterBalanceCard from "@/components/RegisterBalanceCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { 
  OpenRegisterDialog, 
  CloseRegisterDialog, 
  DiscrepancyDialog 
} from "@/components/register/RegisterDialogs";
import ClosingSummary from "@/components/register/ClosingSummary";

const POSRegister = () => {
  const {
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
  } = useRegister(mockRegister);

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
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <ClosingSummary 
          register={register}
          discrepancies={discrepancies}
          closingBalances={closingBalances}
          onRequestApproval={() => setIsDiscrepancyDialogOpen(true)}
        />
      </div>
      
      {/* Dialogs */}
      <OpenRegisterDialog 
        isOpen={isOpenRegisterDialogOpen}
        onClose={() => setIsOpenRegisterDialogOpen(false)}
        register={register}
        onOpenRegister={handleOpenRegister}
      />
      
      <CloseRegisterDialog 
        isOpen={isCloseRegisterDialogOpen}
        onClose={() => setIsCloseRegisterDialogOpen(false)}
        register={register}
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
