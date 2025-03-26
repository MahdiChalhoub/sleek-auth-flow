
import { useState, useCallback } from 'react';
import { 
  Payment, 
  CreditNote, 
  DebitNote, 
  mockPayments, 
  mockCreditNotes, 
  mockDebitNotes,
  PaymentMethod,
  InvoiceType,
  PaymentStatus
} from '@/models/payment';
import { toast } from 'sonner';

export const usePayments = () => {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [creditNotes, setCreditNotes] = useState<CreditNote[]>(mockCreditNotes);
  const [debitNotes, setDebitNotes] = useState<DebitNote[]>(mockDebitNotes);
  const [isLoading, setIsLoading] = useState(false);

  const getInvoicePayments = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return payments.filter(p => p.invoiceId === invoiceId && p.invoiceType === invoiceType);
  }, [payments]);

  const getInvoiceCreditNotes = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return creditNotes.filter(cn => cn.invoiceId === invoiceId && cn.invoiceType === invoiceType);
  }, [creditNotes]);

  const getInvoiceDebitNotes = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return debitNotes.filter(dn => dn.invoiceId === invoiceId && dn.invoiceType === invoiceType);
  }, [debitNotes]);

  const getTotalPaid = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return payments
      .filter(p => p.invoiceId === invoiceId && p.invoiceType === invoiceType)
      .reduce((sum, payment) => sum + payment.amount, 0);
  }, [payments]);

  const getTotalCreditNotes = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return creditNotes
      .filter(cn => cn.invoiceId === invoiceId && cn.invoiceType === invoiceType && cn.status === 'applied')
      .reduce((sum, cn) => sum + cn.amount, 0);
  }, [creditNotes]);

  const getTotalDebitNotes = useCallback((invoiceId: string, invoiceType: InvoiceType) => {
    return debitNotes
      .filter(dn => dn.invoiceId === invoiceId && dn.invoiceType === invoiceType && dn.status === 'applied')
      .reduce((sum, dn) => sum + dn.amount, 0);
  }, [debitNotes]);

  const getPaymentStatus = useCallback((invoiceId: string, invoiceType: InvoiceType, totalAmount: number): PaymentStatus => {
    const paid = getTotalPaid(invoiceId, invoiceType);
    const credited = getTotalCreditNotes(invoiceId, invoiceType);
    const debited = getTotalDebitNotes(invoiceId, invoiceType);
    
    const finalAmount = totalAmount - credited + debited;
    const balance = finalAmount - paid;
    
    if (balance <= 0) return 'paid';
    if (paid > 0) return 'partially_paid';
    return 'unpaid';
  }, [getTotalPaid, getTotalCreditNotes, getTotalDebitNotes]);

  const getAmountDue = useCallback((invoiceId: string, invoiceType: InvoiceType, totalAmount: number): number => {
    const paid = getTotalPaid(invoiceId, invoiceType);
    const credited = getTotalCreditNotes(invoiceId, invoiceType);
    const debited = getTotalDebitNotes(invoiceId, invoiceType);
    
    return totalAmount - credited + debited - paid;
  }, [getTotalPaid, getTotalCreditNotes, getTotalDebitNotes]);

  const addPayment = useCallback(async (
    invoiceId: string, 
    invoiceType: InvoiceType, 
    amount: number, 
    paymentMethod: PaymentMethod,
    notes?: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPayment: Payment = {
        id: `pay-${Date.now()}`,
        invoiceId,
        invoiceType,
        amount,
        paymentMethod,
        paymentDate: new Date().toISOString(),
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setPayments(prev => [...prev, newPayment]);
      toast.success(`Payment of ${amount.toFixed(2)} recorded successfully`);
      return newPayment;
    } catch (error) {
      toast.error('Failed to record payment');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCreditNote = useCallback(async (
    invoiceId: string,
    invoiceType: InvoiceType,
    amount: number,
    reason: string,
    isRefunded: boolean,
    refundMethod?: PaymentMethod
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCreditNote: CreditNote = {
        id: `cn-${Date.now()}`,
        invoiceId,
        invoiceType,
        amount,
        reason,
        status: 'applied',
        refundMethod,
        isRefunded,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setCreditNotes(prev => [...prev, newCreditNote]);
      toast.success(`Credit note of ${amount.toFixed(2)} created successfully`);
      return newCreditNote;
    } catch (error) {
      toast.error('Failed to create credit note');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addDebitNote = useCallback(async (
    invoiceId: string,
    invoiceType: InvoiceType,
    amount: number,
    reason: string
  ) => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newDebitNote: DebitNote = {
        id: `dn-${Date.now()}`,
        invoiceId,
        invoiceType,
        amount,
        reason,
        status: 'applied',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setDebitNotes(prev => [...prev, newDebitNote]);
      toast.success(`Debit note of ${amount.toFixed(2)} created successfully`);
      return newDebitNote;
    } catch (error) {
      toast.error('Failed to create debit note');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    payments,
    creditNotes,
    debitNotes,
    isLoading,
    getInvoicePayments,
    getInvoiceCreditNotes,
    getInvoiceDebitNotes,
    getTotalPaid,
    getTotalCreditNotes,
    getTotalDebitNotes,
    getPaymentStatus,
    getAmountDue,
    addPayment,
    addCreditNote,
    addDebitNote
  };
};
