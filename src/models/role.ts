
import { UserPermission } from "@/types/auth";

export interface Role {
  id: string;
  name: string;
  description: string;
  permissions: UserPermission[];
  createdAt?: string;
  updatedAt?: string;
  created_at?: string;  // Used for compatibility with database fields
  updated_at?: string;  // Used for compatibility with database fields
}

// Helper for converting between different role formats
export const adaptRole = (role: any): Role => {
  const createdAt = role.createdAt || role.created_at || new Date().toISOString();
  const updatedAt = role.updatedAt || role.updated_at || new Date().toISOString();
  
  return {
    id: role.id,
    name: role.name,
    description: role.description || "",
    permissions: role.permissions || [],
    createdAt,
    updatedAt,
    created_at: createdAt,
    updated_at: updatedAt
  };
};
