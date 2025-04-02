
import { supabase } from '@/lib/supabase';
import { User } from '@/types/auth';

// Get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: extendedUsers, error } = await supabase
      .from('extended_users')
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url
        )
      `);
    
    if (error) throw error;
    
    // Map the results to our User interface
    const users = (extendedUsers || []).map(user => {
      return {
        id: user.id,
        fullName: user.profiles?.full_name || '',
        avatarUrl: user.profiles?.avatar_url || '',
        status: user.status,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        email: '', // This will be filled in from auth.users if needed
        role: 'cashier' as const // Default role
      };
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Get a user by ID
export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('extended_users')
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    if (!data) return null;
    
    return {
      id: data.id,
      fullName: data.profiles?.full_name || '',
      avatarUrl: data.profiles?.avatar_url || '',
      status: data.status,
      lastLogin: data.last_login,
      createdAt: data.created_at,
      email: '', // This will be filled in from auth.users if needed
      role: 'cashier' as const, // Default role
      isGlobalAdmin: false
    };
  } catch (error) {
    console.error(`Error fetching user with ID ${id}:`, error);
    return null;
  }
};

// Update a user
export const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
  try {
    // Update base user data in extended_users
    const { error: updateError } = await supabase
      .from('extended_users')
      .update({
        status: userData.status,
      })
      .eq('id', id);
    
    if (updateError) throw updateError;
    
    // Update profile data
    if (userData.fullName || userData.avatarUrl) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: userData.fullName,
          avatar_url: userData.avatarUrl
        })
        .eq('id', id);
      
      if (profileError) throw profileError;
    }
    
    // Fetch the updated user
    return await getUserById(id);
  } catch (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    return null;
  }
};

// Delete a user (soft delete)
export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    // Soft delete by updating the is_deleted flag
    const { error } = await supabase
      .from('extended_users')
      .update({ is_deleted: true })
      .eq('id', id);
    
    if (error) throw error;
    
    return true;
  } catch (error) {
    console.error(`Error deleting user with ID ${id}:`, error);
    return false;
  }
};

// Get users by role
export const getUsersByRole = async (roleId: string): Promise<User[]> => {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select(`
        user_id,
        users:user_id (
          id,
          status,
          last_login,
          created_at,
          profiles:id (
            full_name,
            avatar_url
          )
        )
      `)
      .eq('role_id', roleId);
    
    if (error) throw error;
    
    return (data || []).map(item => ({
      id: item.user_id,
      email: '', // This will be filled in from auth.users if needed
      fullName: item.users?.profiles?.full_name || '',
      avatarUrl: item.users?.profiles?.avatar_url || '',
      status: item.users?.status || 'inactive',
      role: 'cashier', // Default role
      lastLogin: item.users?.last_login,
      createdAt: item.users?.created_at
    }));
  } catch (error) {
    console.error(`Error fetching users by role ${roleId}:`, error);
    return [];
  }
};
