
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import Index from "./pages/Index";
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
import Settings from "./pages/Settings";
import Returns from "./pages/Returns";
import Dashboard from "./pages/Dashboard";
import StaffFinance from "./pages/StaffFinance";
import Loyalty from "./pages/Loyalty";

// Layout
import AppLayout from "./components/layout/AppLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Protected routes - wrapped in AppLayout */}
            <Route element={<AppLayout />}>
              <Route path="/home" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roles" element={<RoleManagement />} />
              <Route path="/register" element={<POSRegister />} />
              <Route path="/register-sessions" element={<RegisterSessions />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transaction-permissions" element={<TransactionPermissions />} />
              <Route path="/pos-sales" element={<POSSales />} />
              <Route path="/staff-finance" element={<StaffFinance />} />
              <Route path="/loyalty" element={<Loyalty />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/purchase-orders" element={<PurchaseOrders />} />
              <Route path="/stock-transfers" element={<StockTransfers />} />
              <Route path="/returns" element={<Returns />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            
            {/* Root path - redirect to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* 404 catch all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
