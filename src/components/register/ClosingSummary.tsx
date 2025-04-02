
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AlertTriangle, CheckCircle, FileText, DollarSign, Wallet } from "lucide-react";
import { PaymentMethod } from "@/models/types/transactionTypes";
import { Register, DiscrepancyResolution } from "@/models/interfaces/registerInterfaces";
import RegisterBalanceCard from "@/components/RegisterBalanceCard";

interface ClosingSummaryProps {
  register: Register;
  discrepancies: Record<PaymentMethod, number>;
  closingBalances: Record<PaymentMethod, number>;
  onRequestApproval: () => void;
}

const ClosingSummary: React.FC<ClosingSummaryProps> = ({
  register,
  discrepancies,
  closingBalances,
  onRequestApproval
}) => {
  if (register.isOpen || !register.closedAt) return null;

  return (
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
                        onClick={onRequestApproval}>
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
  );
};

export default ClosingSummary;
