
import React, { useState, useEffect } from "react";
import { useRegister } from "@/components/register/useRegister";
import { Register, PaymentMethod, DiscrepancyResolution } from "@/models/register";
import OpenRegisterDialog from "@/components/register/dialogs/OpenRegisterDialog";
import CloseRegisterDialog from "@/components/register/dialogs/CloseRegisterDialog";
import DiscrepancyDialog from "@/components/register/dialogs/DiscrepancyDialog";
import RegisterHeader from "@/components/register/RegisterHeader";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const POSRegister: React.FC = () => {
  // Replace original useRegister hook values with our own state management
  const { 
    register, 
    isLoading, 
    error, 
    refresh, 
    openRegister: apiOpenRegister, 
    closeRegister: apiCloseRegister, 
    resolveDiscrepancy: apiResolveDiscrepancy 
  } = useRegister("reg1"); // Using a default register ID for demo purposes

  // State variables for dialog control
  const [isOpenRegisterDialogOpen, setIsOpenRegisterDialogOpen] = useState(false);
  const [isCloseRegisterDialogOpen, setIsCloseRegisterDialogOpen] = useState(false);
  const [isDiscrepancyDialogOpen, setIsDiscrepancyDialogOpen] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<Record<PaymentMethod, number> | undefined>(undefined);
  const [closingBalances, setClosingBalances] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
    not_specified: 0
  });
  const [discrepancyResolution, setDiscrepancyResolution] = useState<DiscrepancyResolution>('pending');
  const [discrepancyNotes, setDiscrepancyNotes] = useState('');

  const handleOpenRegister = () => {
    const openingBalance = {
      cash: 0,
      card: 0,
      bank: 0,
      wave: 0,
      mobile: 0,
      not_specified: 0
    };
    
    apiOpenRegister(openingBalance)
      .then(() => {
        toast.success("Register opened successfully");
        setIsOpenRegisterDialogOpen(false);
      })
      .catch(err => {
        toast.error("Failed to open register");
        console.error(err);
      });
  };

  const handleCloseRegister = () => {
    if (!register) return;
    
    apiCloseRegister(closingBalances, register.expectedBalance)
      .then(() => {
        toast.success("Register closed successfully");
        setIsCloseRegisterDialogOpen(false);
        
        // Check for discrepancies
        const newDiscrepancies: Record<PaymentMethod, number> = {} as Record<PaymentMethod, number>;
        let hasDiscrepancy = false;
        
        Object.keys(closingBalances).forEach(method => {
          const paymentMethod = method as PaymentMethod;
          const expected = register.expectedBalance[paymentMethod];
          const actual = closingBalances[paymentMethod];
          const diff = actual - expected;
          
          newDiscrepancies[paymentMethod] = diff;
          
          if (diff !== 0) {
            hasDiscrepancy = true;
          }
        });
        
        if (hasDiscrepancy) {
          setDiscrepancies(newDiscrepancies);
          setIsDiscrepancyDialogOpen(true);
        }
      })
      .catch(err => {
        toast.error("Failed to close register");
        console.error(err);
      });
  };

  const handleBalanceChange = (method: PaymentMethod, value: string) => {
    const numValue = parseFloat(value) || 0;
    setClosingBalances(prev => ({
      ...prev,
      [method]: numValue
    }));
  };

  const handleResolutionChange = (value: DiscrepancyResolution) => {
    setDiscrepancyResolution(value);
  };

  const handleDiscrepancyApproval = () => {
    if (discrepancies) {
      apiResolveDiscrepancy(discrepancyResolution, discrepancyNotes)
        .then(() => {
          toast.success("Discrepancy resolved successfully");
          setIsDiscrepancyDialogOpen(false);
        })
        .catch(err => {
          toast.error("Failed to resolve discrepancy");
          console.error(err);
        });
    }
  };

  const getTotalDiscrepancy = (): number => {
    if (!discrepancies) return 0;
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };

  useEffect(() => {
    refresh();
  }, []);

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading register data...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4">Error loading register: {error.message}</div>;
  }

  if (!register) {
    return <div className="container mx-auto p-4">Register not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <RegisterHeader 
        isRegisterOpen={register.isOpen}
        onOpenRegisterClick={() => setIsOpenRegisterDialogOpen(true)}
        onCloseRegisterClick={() => setIsCloseRegisterDialogOpen(true)}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Register Information</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-500">Name:</span>
              <span className="font-medium">{register.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status:</span>
              <span className={`font-medium ${register.isOpen ? 'text-green-500' : 'text-red-500'}`}>
                {register.isOpen ? 'Open' : 'Closed'}
              </span>
            </div>
            {register.openedAt && (
              <div className="flex justify-between">
                <span className="text-gray-500">Opened At:</span>
                <span className="font-medium">{new Date(register.openedAt).toLocaleString()}</span>
              </div>
            )}
            {register.openedBy && (
              <div className="flex justify-between">
                <span className="text-gray-500">Opened By:</span>
                <span className="font-medium">{register.openedBy}</span>
              </div>
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Current Balance</h2>
          <div className="space-y-2">
            {Object.entries(register.currentBalance).map(([method, balance]) => (
              <div key={method} className="flex justify-between">
                <span className="text-gray-500">{method.charAt(0).toUpperCase() + method.slice(1)}:</span>
                <span className="font-medium">${balance.toFixed(2)}</span>
              </div>
            ))}
            <div className="flex justify-between border-t pt-2 mt-4">
              <span className="text-gray-500 font-medium">Total:</span>
              <span className="font-bold">
                ${Object.values(register.currentBalance).reduce((sum, val) => sum + val, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Register Dialogs */}
      {isOpenRegisterDialogOpen && (
        <OpenRegisterDialog
          isOpen={isOpenRegisterDialogOpen}
          onClose={() => setIsOpenRegisterDialogOpen(false)}
          register={register}
          onOpenRegister={handleOpenRegister}
        />
      )}
      
      {isCloseRegisterDialogOpen && (
        <CloseRegisterDialog
          isOpen={isCloseRegisterDialogOpen}
          onClose={() => setIsCloseRegisterDialogOpen(false)}
          register={register}
          closingBalances={closingBalances}
          handleBalanceChange={handleBalanceChange}
          onCloseRegister={handleCloseRegister}
        />
      )}
      
      {isDiscrepancyDialogOpen && discrepancies && (
        <DiscrepancyDialog
          isOpen={isDiscrepancyDialogOpen}
          onClose={() => setIsDiscrepancyDialogOpen(false)}
          totalDiscrepancy={getTotalDiscrepancy()}
          discrepancyResolution={discrepancyResolution}
          discrepancyNotes={discrepancyNotes}
          handleResolutionChange={handleResolutionChange}
          setDiscrepancyNotes={setDiscrepancyNotes}
          onApproveResolution={handleDiscrepancyApproval}
        />
      )}
    </div>
  );
};

export default POSRegister;
