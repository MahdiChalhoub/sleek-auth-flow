
import { supabase } from '@/lib/supabase';
import { User, UserStatus, Role, UserPermission } from '@/types/auth';
import { toast } from 'sonner';
import { rpcParams } from '@/utils/supabaseTypes';

// Fetch all users with their roles
export async function getAllUsers(): Promise<User[]> {
  try {
    // Get all users from auth.users
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    if (!authUsers) return [];
    
    // Get extended user info from our custom tables
    const { data: extendedUsers, error: extendedError } = await supabase
      .from('extended_users')
      .select('*');
    
    if (extendedError) throw extendedError;
    
    // Get user profiles
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*');
    
    if (profilesError) throw profilesError;
    
    // Get user roles
    const { data: userRoles, error: rolesError } = await supabase
      .from('user_roles')
      .select('*, role:roles(*)');
    
    if (rolesError) throw rolesError;
    
    // Map and combine the data
    const users: User[] = authUsers.users.map(authUser => {
      const extended = extendedUsers?.find(eu => eu.id === authUser.id);
      const profile = profiles?.find(p => p.id === authUser.id);
      const userRole = userRoles?.find(ur => ur.user_id === authUser.id);
      
      return {
        id: authUser.id,
        email: authUser.email || '',
        fullName: profile?.full_name || authUser.email?.split('@')[0] || '',
        avatarUrl: profile?.avatar_url || `https://avatar.vercel.sh/${authUser.email}`,
        status: (extended?.status as UserStatus) || 'pending',
        role: userRole?.role?.name as 'admin' | 'manager' | 'cashier' || 'cashier',
        isDeleted: extended?.is_deleted || false,
        lastLogin: authUser.last_sign_in_at,
        createdAt: authUser.created_at
      };
    });
    
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    toast.error('Failed to fetch users');
    return [];
  }
}

// Get pending users
export async function getPendingUsers(): Promise<User[]> {
  try {
    const { data: extendedUsers, error } = await supabase
      .from('extended_users')
      .select('*, profile:profiles(*)')
      .eq('status', 'pending');
    
    if (error) throw error;
    
    if (!extendedUsers || extendedUsers.length === 0) return [];
    
    // Get auth users for the pending users
    const pendingIds = extendedUsers.map(user => user.id);
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
    
    if (authError) throw authError;
    
    // Map to our User type
    const pendingUsers: User[] = extendedUsers.map(extended => {
      const authUser = authUsers?.users.find(u => u.id === extended.id);
      
      return {
        id: extended.id,
        email: authUser?.email || '',
        fullName: extended.profile?.full_name || authUser?.email?.split('@')[0] || '',
        avatarUrl: extended.profile?.avatar_url || `https://avatar.vercel.sh/${authUser?.email}`,
        status: extended.status as UserStatus,
        role: 'cashier', // Default role
        isDeleted: extended.is_deleted || false,
        lastLogin: authUser?.last_sign_in_at,
        createdAt: extended.created_at
      };
    });
    
    return pendingUsers;
  } catch (error) {
    console.error('Error fetching pending users:', error);
    toast.error('Failed to fetch pending users');
    return [];
  }
}

// Approve a user
export async function approveUser(userId: string, roleId: string): Promise<boolean> {
  try {
    // Update user status
    const { error: statusError } = await supabase
      .from('extended_users')
      .update({ status: 'active' })
      .eq('id', userId);
    
    if (statusError) throw statusError;
    
    // Assign role to user
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: userId, role_id: roleId });
    
    if (roleError) throw roleError;
    
    toast.success('User approved successfully');
    return true;
  } catch (error) {
    console.error('Error approving user:', error);
    toast.error('Failed to approve user');
    return false;
  }
}

// Deny a user
export async function denyUser(userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('extended_users')
      .update({ status: 'denied' })
      .eq('id', userId);
    
    if (error) throw error;
    
    toast.success('User denied successfully');
    return true;
  } catch (error) {
    console.error('Error denying user:', error);
    toast.error('Failed to deny user');
    return false;
  }
}

// Check if user can be deleted (no associated records)
export async function canDeleteUser(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .rpc('can_delete_user', rpcParams({ user_id: userId }));
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error checking if user can be deleted:', error);
    return false;
  }
}

// Delete a user
export async function deleteUser(userId: string): Promise<boolean> {
  try {
    const canDelete = await canDeleteUser(userId);
    
    if (canDelete) {
      // Delete from auth
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) throw error;
      
      toast.success('User deleted successfully');
      return true;
    } else {
      // Mark as inactive instead
      const { error } = await supabase
        .from('extended_users')
        .update({ status: 'inactive', is_deleted: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast.success('User marked as inactive (cannot be fully deleted due to associated records)');
      return true;
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    toast.error('Failed to delete user');
    return false;
  }
}

// Create a new user
export async function createUser(email: string, password: string, fullName: string, roleId: string): Promise<boolean> {
  try {
    // Create user in Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: fullName }
    });
    
    if (error) throw error;
    
    // User creation triggers our database function to create profile and extended_user entries
    
    // Assign role
    const { error: roleError } = await supabase
      .from('user_roles')
      .insert({ user_id: data.user.id, role_id: roleId });
    
    if (roleError) throw roleError;
    
    // Set status to active (bypass approval for admin-created users)
    const { error: statusError } = await supabase
      .from('extended_users')
      .update({ status: 'active' })
      .eq('id', data.user.id);
    
    if (statusError) throw statusError;
    
    toast.success('User created successfully');
    return true;
  } catch (error) {
    console.error('Error creating user:', error);
    toast.error(`Failed to create user: ${error.message}`);
    return false;
  }
}

// Update a user
export async function updateUser(
  userId: string, 
  data: { fullName?: string; roleId?: string; status?: UserStatus }
): Promise<boolean> {
  try {
    // Update profile if fullName is provided
    if (data.fullName) {
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: data.fullName })
        .eq('id', userId);
      
      if (profileError) throw profileError;
    }
    
    // Update role if roleId is provided
    if (data.roleId) {
      // Check if user already has a role
      const { data: existingRoles, error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId);
      
      if (checkError) throw checkError;
      
      if (existingRoles && existingRoles.length > 0) {
        // Update existing role
        const { error: updateError } = await supabase
          .from('user_roles')
          .update({ role_id: data.roleId })
          .eq('user_id', userId);
        
        if (updateError) throw updateError;
      } else {
        // Insert new role
        const { error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId, role_id: data.roleId });
        
        if (insertError) throw insertError;
      }
    }
    
    // Update status if provided
    if (data.status) {
      const { error: statusError } = await supabase
        .from('extended_users')
        .update({ status: data.status })
        .eq('id', userId);
      
      if (statusError) throw statusError;
    }
    
    toast.success('User updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating user:', error);
    toast.error('Failed to update user');
    return false;
  }
}
