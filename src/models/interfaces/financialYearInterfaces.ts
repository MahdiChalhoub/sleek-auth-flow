
export interface FinancialYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  closedBy?: string;
  closedAt?: string;
}

export type FinancialYearStatus = 'open' | 'closed' | 'active';

export interface FinancialYearFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  createdBy: string;
}
