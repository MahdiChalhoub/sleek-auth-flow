
export interface Category {
  id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export const emptyCategory: Category = {
  id: '',
  name: ''
};
