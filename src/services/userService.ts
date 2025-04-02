import { supabase } from '@/lib/supabase';

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

// Function to get all users
const getAllUsers = async (): Promise<User[]> => {
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
const getUserById = async (userId: string) => {
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
      status: user.status,
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

// Function to update a user's status
const updateUserStatus = async (userId: string, status: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('extended_users')
      .update({ status })
      .eq('id', userId);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error updating user status:', error);
    return false;
  }
};

// Function to delete a user (set is_deleted to true)
const deleteUser = async (userId: string): Promise<boolean> => {
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

export const userService = {
  getAllUsers,
  getUserById,
  updateUserStatus,
  deleteUser,
};
