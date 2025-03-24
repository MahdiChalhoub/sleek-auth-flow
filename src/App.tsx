
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import RoleManagement from "./pages/RoleManagement";
import POSRegister from "./pages/POSRegister";
import RegisterSessions from "./pages/RegisterSessions";
import Transactions from "./pages/Transactions";
import TransactionPermissions from "./pages/TransactionPermissions";
import POSSales from "./pages/POSSales";
import Inventory from "./pages/Inventory";
import Suppliers from "./pages/Suppliers";
import PurchaseOrders from "./pages/PurchaseOrders";
import StockTransfers from "./pages/StockTransfers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Index />} />
          <Route path="/roles" element={<RoleManagement />} />
          <Route path="/register" element={<POSRegister />} />
          <Route path="/register-sessions" element={<RegisterSessions />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/transaction-permissions" element={<TransactionPermissions />} />
          <Route path="/pos-sales" element={<POSSales />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/suppliers" element={<Suppliers />} />
          <Route path="/purchase-orders" element={<PurchaseOrders />} />
          <Route path="/stock-transfers" element={<StockTransfers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
