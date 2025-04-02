
export interface FinancialYear {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  status: 'active' | 'closed' | 'pending';
  createdBy?: string;
  closedBy?: string;
  closedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FinancialYearFormData {
  name: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'closed' | 'pending';
  createdBy?: string;
}

export const mapToFinancialYear = (data: any): FinancialYear => {
  return {
    id: data.id,
    name: data.name,
    startDate: data.start_date || data.startDate,
    endDate: data.end_date || data.endDate,
    status: data.status || 'pending',
    createdBy: data.created_by || data.createdBy,
    closedBy: data.closed_by || data.closedBy,
    closedAt: data.closed_at || data.closedAt,
    createdAt: data.created_at || data.createdAt,
    updatedAt: data.updated_at || data.updatedAt
  };
};
