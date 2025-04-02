
import { supabase } from '@/lib/supabase';
import { UserStatus } from '@/types/auth';

export interface User {
  id: string;
  status: string;
  isDeleted: boolean;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
  fullName: string;
  avatarUrl: string | null;
}

export interface UpdateUserData {
  fullName?: string;
  roleId?: string;
  status?: UserStatus;
}

// Function to get all users
export const getAllUsers = async (): Promise<User[]> => {
  try {
    const { data: users, error } = await supabase
      .from('extended_users')
      .select(`
        *,
        profiles:id(full_name, avatar_url)
      `);

    if (error) throw error;

    return users.map(user => {
      const profileData = user.profiles || {};
      return {
        id: user.id,
        status: user.status,
        isDeleted: user.is_deleted,
        lastLogin: user.last_login,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        fullName: profileData.full_name || 'Unknown User',
        avatarUrl: profileData.avatar_url || null
      };
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

// Function to get a user by ID
export const getUserById = async (userId: string) => {
  try {
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    const { data: user, error } = await supabase
      .from('extended_users')
      .select(`
        *,
        profiles:id(full_name, avatar_url)
      `)
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    if (!user) {
      return null;
    }
    
    // Safely access profile data
    const profileData = user.profiles || {};
    
    return {
      id: userId,
      status: user.status as UserStatus,
      isDeleted: user.is_deleted,
      lastLogin: user.last_login,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      fullName: profileData.full_name || 'Unknown User',
      avatarUrl: profileData.avatar_url || null
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Function to create a new user
export const createUser = async (
  email: string, 
  password: string, 
  fullName: string, 
  roleId: string
): Promise<boolean> => {
  try {
    // You'd typically create a user with Supabase Auth first, 
    // then assign the role in a separate table
    // This is a simplified mock version
    console.log('Creating user:', { email, fullName, roleId });
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    return false;
  }
};

// Function to update a user's data
export const updateUser = async (userId: string, data: UpdateUserData): Promise<boolean> => {
  try {
    // Update user in extended_users table
    if (data.status) {
      const { error } = await supabase
        .from('extended_users')
        .update({ status: data.status })
        .eq('id', userId);

      if (error) throw error;
    }

    // Update user profile if fullName is provided
    if (data.fullName) {
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: data.fullName })
        .eq('id', userId);

      if (error) throw error;
    }

    // Update user role if roleId is provided
    if (data.roleId) {
      // First check if user already has a role
      const { data: existingRole, error: roleCheckError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (roleCheckError && roleCheckError.code !== 'PGRST116') {
        throw roleCheckError;
      }

      if (existingRole) {
        // Update existing role
        const { error } = await supabase
          .from('user_roles')
          .update({ role_id: data.roleId })
          .eq('user_id', userId);

        if (error) throw error;
      } else {
        // Create new role assignment
        const { error } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role_id: data.roleId });

        if (error) throw error;
      }
    }

    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    return false;
  }
};

// Function to delete a user (set is_deleted to true)
export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('extended_users')
      .update({ is_deleted: true })
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};

// Function to check if a user can be deleted
export const canDeleteUser = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('can_delete_user', { user_id: userId });
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error checking if user can be deleted:', error);
    return false;
  }
};

export const userService = {
  getAllUsers,
  getUserById,
  updateUserStatus: (userId: string, status: UserStatus) => updateUser(userId, { status }),
  deleteUser,
  createUser,
  updateUser,
  canDeleteUser
};
