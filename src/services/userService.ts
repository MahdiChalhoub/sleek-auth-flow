
import { supabase } from '@/lib/supabase';
import { User, UserStatus } from '@/types/auth';

// Type for user data returned from the database
interface DbUser {
  id: string;
  email: string;
  status: UserStatus;
  role?: string;
  full_name?: string;
  avatar_url?: string;
  last_login?: string;
  created_at?: string;
  is_deleted?: boolean;
  is_global_admin?: boolean;
}

// Get all users from the database
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('extended_users')
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching users:', error);
      throw error;
    }

    return (users || []).map((user: any) => ({
      id: user.id,
      status: user.status,
      email: user.email || '',
      role: user.role || 'user',
      fullName: user.profiles?.full_name || '',
      avatarUrl: user.profiles?.avatar_url || '',
      lastLogin: user.last_login,
      createdAt: user.created_at,
      isDeleted: user.is_deleted || false,
      isGlobalAdmin: user.is_global_admin || false
    }));
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    return [];
  }
};

// Create a new user
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    // Handle user creation logic here
    return null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

// Update a user's information
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('extended_users')
      .update({
        status: userData.status,
        role: userData.role,
        is_deleted: userData.isDeleted,
        is_global_admin: userData.isGlobalAdmin
      })
      .eq('id', id)
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error(`Error updating user ${id}:`, error);
      throw error;
    }

    return {
      id: data.id,
      status: data.status as UserStatus,
      email: data.email || '',
      role: data.role || 'user',
      fullName: data.profiles?.full_name || '',
      avatarUrl: data.profiles?.avatar_url || '',
      lastLogin: data.last_login,
      createdAt: data.created_at,
      isDeleted: data.is_deleted || false,
      isGlobalAdmin: data.is_global_admin || false
    };
  } catch (error) {
    console.error(`Error updating user ${id}:`, error);
    return null;
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // First check if user can be deleted
    const canDelete = await canDeleteUser(id);
    
    if (!canDelete) {
      throw new Error("User cannot be deleted because they have associated records");
    }
    
    const { error } = await supabase
      .from('extended_users')
      .update({ is_deleted: true })
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error(`Error deleting user ${id}:`, error);
    return false;
  }
};

// Check if a user can be deleted
export const canDeleteUser = async (id: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('can_delete_user', { user_id: id });
    
    if (error) throw error;
    return data || false;
  } catch (error) {
    console.error(`Error checking if user ${id} can be deleted:`, error);
    return false;
  }
};

export type { User };
