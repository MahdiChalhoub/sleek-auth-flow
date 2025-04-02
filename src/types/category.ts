
export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  createdAt?: string;
  updatedAt?: string;
  children?: Category[];
}

export default Category;
