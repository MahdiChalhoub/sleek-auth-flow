
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "react-router-dom";
import GeneralLedger from "./accounting/GeneralLedger";
import JournalEntries from "./accounting/JournalEntries";
import AccountsReceivable from "./accounting/AccountsReceivable";
import AccountsPayable from "./accounting/AccountsPayable";
import ProfitLoss from "./accounting/ProfitLoss";

const Ledger = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    // Set the active tab based on the current path
    if (location.pathname === "/accounts-receivable") return "accounts-receivable";
    if (location.pathname === "/accounts-payable") return "accounts-payable";
    if (location.pathname === "/profit-loss") return "profit-loss";
    if (location.pathname === "/journal-entries") return "journal-entries";
    return "general-ledger";
  });

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Comptabilité</h1>
          <p className="text-muted-foreground mt-1">
            Gestion du livre comptable et des journaux
          </p>
        </div>
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-4">
          <TabsTrigger value="general-ledger">Grand Livre</TabsTrigger>
          <TabsTrigger value="journal-entries">Écritures Journal</TabsTrigger>
          <TabsTrigger value="accounts-receivable">Comptes Clients</TabsTrigger>
          <TabsTrigger value="accounts-payable">Comptes Fournisseurs</TabsTrigger>
          <TabsTrigger value="profit-loss">Profit & Pertes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general-ledger">
          <GeneralLedger />
        </TabsContent>
        
        <TabsContent value="journal-entries">
          <JournalEntries />
        </TabsContent>
        
        <TabsContent value="accounts-receivable">
          <AccountsReceivable />
        </TabsContent>
        
        <TabsContent value="accounts-payable">
          <AccountsPayable />
        </TabsContent>
        
        <TabsContent value="profit-loss">
          <ProfitLoss />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Ledger;
