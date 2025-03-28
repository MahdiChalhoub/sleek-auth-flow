
import React, { useEffect, useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './components/theme-provider';
import AppLayout from './components/layout/AppLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import PurchaseOrders from './pages/PurchaseOrders';
import Suppliers from './pages/Suppliers';
import StockTransfers from './pages/StockTransfers';
import Login from './pages/Login';
import Signup from './pages/Signup';
import NotFound from './pages/NotFound';
import Index from './pages/Index';
import POSSales from './pages/POSSales';
import POSRegister from './pages/POSRegister';
import ForgotPassword from './pages/ForgotPassword';
import Settings from './pages/Settings';
import Categories from './pages/Categories';
import StockAdjustments from './pages/StockAdjustments';
import Contacts from './pages/Contacts';
import ClientsList from './pages/ClientsList';
import ClientProfile from './pages/ClientProfile';
import ClientEditForm from './pages/ClientEditForm';
import { initializeDatabase } from './api/setupDatabase';
import { Skeleton } from './components/ui/skeleton';
import { toast } from 'sonner';

function App() {
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    // Initialize Supabase database functions
    const init = async () => {
      try {
        await initializeDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Error initializing database:', error);
        toast.error('Failed to initialize database. Some features may not work properly.');
      } finally {
        setIsInitializing(false);
      }
    };
    
    init();
  }, []);

  if (isInitializing) {
    return (
      <div className="flex h-screen w-full items-center justify-center flex-col gap-4">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-4 w-48" />
        <p className="text-sm text-muted-foreground">Initializing application...</p>
      </div>
    );
  }

  return (
    <ThemeProvider defaultTheme="light">
      <BrowserRouter>
        <Routes>
          <Route index element={<Index />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          
          <Route path="/" element={<AppLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="categories" element={<Categories />} />
            <Route path="purchase-orders" element={<PurchaseOrders />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="stock-transfers" element={<StockTransfers />} />
            <Route path="stock-adjustments" element={<StockAdjustments />} />
            <Route path="pos/sales" element={<POSSales />} />
            <Route path="pos/register" element={<POSRegister />} />
            <Route path="settings" element={<Settings />} />
            <Route path="contacts" element={<Contacts />} />
            <Route path="clients" element={<ClientsList />} />
            <Route path="clients/:clientId" element={<ClientProfile />} />
            <Route path="clients/:clientId/edit" element={<ClientEditForm />} />
            <Route path="clients/new" element={<ClientEditForm />} />
          </Route>
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
