
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  ArrowLeft, 
  DollarSign, 
  CreditCard, 
  Wallet, 
  History,
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import { mockRegister, Register, PaymentMethod } from "@/models/transaction";
import RegisterBalanceCard from "@/components/RegisterBalanceCard";
import RegisterMetaCard from "@/components/RegisterMetaCard";

const POSRegister = () => {
  const [register, setRegister] = useState<Register>(mockRegister);
  const [isOpenRegisterDialogOpen, setIsOpenRegisterDialogOpen] = useState(false);
  const [isCloseRegisterDialogOpen, setIsCloseRegisterDialogOpen] = useState(false);
  const [discrepancies, setDiscrepancies] = useState<Record<PaymentMethod, number>>({
    cash: 0,
    card: 0,
    bank: 0,
    wave: 0,
    mobile: 0,
  });
  const [closingBalances, setClosingBalances] = useState<Record<PaymentMethod, number>>({
    cash: register.currentBalance.cash,
    card: register.currentBalance.card,
    bank: register.currentBalance.bank,
    wave: register.currentBalance.wave,
    mobile: register.currentBalance.mobile,
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
      discrepancyResolution: discrepancyResolution as any,
      discrepancyApprovedBy: "Admin User",
      discrepancyApprovedAt: new Date().toISOString(),
      discrepancyNotes: discrepancyNotes,
    });
    
    toast.success("Discrepancy has been resolved", {
      description: `The discrepancy has been resolved with the ${discrepancyResolution} option.`,
    });
  };

  const getTotalDiscrepancy = () => {
    return Object.values(discrepancies).reduce((sum, value) => sum + value, 0);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-8">
      <div className="max-w-6xl mx-auto glass-card rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" asChild>
              <Link to="/home">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">POS Register</h1>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/register-sessions">
                <History className="h-4 w-4 mr-1.5" />
                Sessions History
              </Link>
            </Button>
            
            {register.isOpen ? (
              <Button 
                variant="destructive" 
                onClick={() => setIsCloseRegisterDialogOpen(true)}
              >
                Close Register
              </Button>
            ) : (
              <Button 
                onClick={() => setIsOpenRegisterDialogOpen(true)}
              >
                Open Register
              </Button>
            )}
          </div>
        </div>
        
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
        
        {!register.isOpen && register.closedAt && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <h2>Closing Summary</h2>
                  {Object.values(discrepancies).some(value => value !== 0) ? (
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                </CardTitle>
                <CardDescription>
                  Register was closed on {new Date(register.closedAt).toLocaleString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="discrepancies">
                  <TabsList className="mb-4">
                    <TabsTrigger value="discrepancies">Discrepancies</TabsTrigger>
                    <TabsTrigger value="balances">Final Balances</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="discrepancies">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(discrepancies).map(([method, value]) => (
                        <Card key={method} className={`shadow-sm ${value !== 0 ? 'border-yellow-400 dark:border-yellow-600' : 'border-green-400 dark:border-green-600'}`}>
                          <CardContent className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <p className="text-sm font-medium capitalize">{method}</p>
                                <p className={`text-lg font-semibold ${value > 0 ? 'text-green-600' : value < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                                  {value > 0 ? '+' : ''}{value.toFixed(2)}
                                </p>
                              </div>
                              {value !== 0 ? (
                                <AlertTriangle className="h-5 w-5 text-yellow-500" />
                              ) : (
                                <CheckCircle className="h-5 w-5 text-green-500" />
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                    
                    {Object.values(discrepancies).some(value => value !== 0) && !register.discrepancyResolution && (
                      <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-yellow-800 dark:text-yellow-300">Discrepancies detected</p>
                            <p className="text-sm text-yellow-700 dark:text-yellow-400">
                              There are discrepancies between the expected and actual balances.
                              Please review and get approval from an administrator.
                            </p>
                            <Button variant="outline" size="sm" className="mt-2 bg-white dark:bg-transparent" 
                              onClick={() => setIsDiscrepancyDialogOpen(true)}>
                              Request Approval
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {register.discrepancyResolution && (
                      <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                          <div>
                            <p className="font-medium text-green-800 dark:text-green-300">Discrepancy Resolved</p>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              Discrepancy has been resolved with option: <span className="font-medium capitalize">
                                {register.discrepancyResolution === 'deduct_salary' ? 'Deduct from Salary' : 
                                 register.discrepancyResolution === 'ecart_caisse' ? 'Écart de Caisse' : 
                                 register.discrepancyResolution}
                              </span>
                            </p>
                            {register.discrepancyNotes && (
                              <div className="mt-2 p-2 bg-white dark:bg-black/20 rounded text-sm">
                                <p className="font-medium">Note:</p>
                                <p>{register.discrepancyNotes}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="balances">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.entries(closingBalances).map(([method, value]) => (
                        <RegisterBalanceCard 
                          key={method}
                          title={method.charAt(0).toUpperCase() + method.slice(1)} 
                          value={value} 
                          icon={method === 'cash' ? <DollarSign className="h-5 w-5" /> : <Wallet className="h-5 w-5" />}
                          className="border-l-4 border-gray-300"
                        />
                      ))}
                    </div>
                    
                    <div className="mt-6 flex justify-end">
                      <Button variant="outline" className="gap-2" asChild>
                        <Link to="/register-sessions">
                          <FileText className="h-4 w-4" />
                          View All Sessions
                        </Link>
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
      
      {/* Open Register Dialog */}
      <Dialog open={isOpenRegisterDialogOpen} onOpenChange={setIsOpenRegisterDialogOpen}>
        <DialogContent className="max-w-md glass-card">
          <DialogHeader>
            <DialogTitle>Open Register</DialogTitle>
            <DialogDescription>
              Confirm the opening balance before opening the register.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center justify-between">
                <span className="font-medium">Cash Opening Balance:</span>
                <span className="text-lg">${register.openingBalance.cash.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Card Opening Balance:</span>
                <span className="text-lg">${register.openingBalance.card.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Bank Opening Balance:</span>
                <span className="text-lg">${register.openingBalance.bank.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleOpenRegister}>
              Open Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Close Register Dialog */}
      <Dialog open={isCloseRegisterDialogOpen} onOpenChange={setIsCloseRegisterDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto glass-card">
          <DialogHeader>
            <DialogTitle>Close Register</DialogTitle>
            <DialogDescription>
              Please enter the closing balances for all payment methods.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cash Closing Balance:</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={closingBalances.cash.toString()}
                    onChange={(e) => handleBalanceChange('cash', e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected: ${register.expectedBalance.cash.toFixed(2)}</span>
                  <span className={`${closingBalances.cash !== register.expectedBalance.cash ? 'text-yellow-500 font-medium' : ''}`}>
                    Difference: ${(closingBalances.cash - register.expectedBalance.cash).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Closing Balance:</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={closingBalances.card.toString()}
                    onChange={(e) => handleBalanceChange('card', e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected: ${register.expectedBalance.card.toFixed(2)}</span>
                  <span className={`${closingBalances.card !== register.expectedBalance.card ? 'text-yellow-500 font-medium' : ''}`}>
                    Difference: ${(closingBalances.card - register.expectedBalance.card).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Bank Closing Balance:</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={closingBalances.bank.toString()}
                    onChange={(e) => handleBalanceChange('bank', e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected: ${register.expectedBalance.bank.toFixed(2)}</span>
                  <span className={`${closingBalances.bank !== register.expectedBalance.bank ? 'text-yellow-500 font-medium' : ''}`}>
                    Difference: ${(closingBalances.bank - register.expectedBalance.bank).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Wave Closing Balance:</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={closingBalances.wave.toString()}
                    onChange={(e) => handleBalanceChange('wave', e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected: ${register.expectedBalance.wave.toFixed(2)}</span>
                  <span className={`${closingBalances.wave !== register.expectedBalance.wave ? 'text-yellow-500 font-medium' : ''}`}>
                    Difference: ${(closingBalances.wave - register.expectedBalance.wave).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Mobile Closing Balance:</label>
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <Input 
                    type="number" 
                    value={closingBalances.mobile.toString()}
                    onChange={(e) => handleBalanceChange('mobile', e.target.value)}
                    className="glass-input"
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Expected: ${register.expectedBalance.mobile.toFixed(2)}</span>
                  <span className={`${closingBalances.mobile !== register.expectedBalance.mobile ? 'text-yellow-500 font-medium' : ''}`}>
                    Difference: ${(closingBalances.mobile - register.expectedBalance.mobile).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCloseRegisterDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCloseRegister}>
              Close Register
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Discrepancy Resolution Dialog */}
      <Dialog open={register.discrepancies && Object.values(register.discrepancies).some(value => value !== 0) && !register.discrepancyResolution && isDiscrepancyDialogOpen} 
        onOpenChange={setIsDiscrepancyDialogOpen}>
        <DialogContent className="max-w-md glass-card">
          <DialogHeader>
            <DialogTitle>Resolve Discrepancy</DialogTitle>
            <DialogDescription>
              Total discrepancy: ${getTotalDiscrepancy().toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Resolution Method:</label>
                <Select value={discrepancyResolution} onValueChange={handleResolutionChange}>
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Select resolution method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="deduct_salary">Deduct from Salary</SelectItem>
                    <SelectItem value="ecart_caisse">Assign to Écart de Caisse</SelectItem>
                    <SelectItem value="approved">Approve Discrepancy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium">Notes:</label>
                <textarea 
                  className="mt-1.5 w-full px-3 py-2 border border-input rounded-md glass-input h-24"
                  placeholder="Add notes about this discrepancy resolution..."
                  value={discrepancyNotes}
                  onChange={(e) => setDiscrepancyNotes(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDiscrepancyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDiscrepancyApproval}>
              Approve Resolution
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const [isDiscrepancyDialogOpen, setIsDiscrepancyDialogOpen] = useState(false);

export default POSRegister;
