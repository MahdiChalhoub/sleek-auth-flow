
export interface FinancialYear {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: FinancialYearStatus;
  createdBy?: string;
  closedBy?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define this as an enum to ensure we have consistent values
export enum FinancialYearStatus {
  ACTIVE = 'active',
  CLOSED = 'closed',
  PENDING = 'pending'
}

export interface FinancialYearFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: FinancialYearStatus;
  createdBy?: string;
}

export const mapToFinancialYear = (data: any): FinancialYear => {
  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date || data.startDate,
    endDate: data.end_date || data.endDate,
    status: data.status || FinancialYearStatus.PENDING,
    createdBy: data.created_by || data.createdBy,
    closedBy: data.closed_by || data.closedBy,
    closedAt: data.closed_at || data.closedAt,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt
  };
};
