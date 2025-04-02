import { supabase } from '@/lib/supabase';
import { User, Role as AuthRole } from '@/types/auth';
import { adaptRoles } from '@/utils/roleAdapter';
import { Role } from '@/models/role';
import { mapUserData, mapRoleData, methodAdapters, safeGet } from './userServiceHelper';

/**
 * User Service - Handle all user-related operations
 */
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Get extended user data
      const { data: extendedUser, error } = await supabase
        .from('extended_users')
        .select('*, profiles:id(*)')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching extended user data:', error);
        return null;
      }
      
      return mapUserData({
        id: user.id,
        email: user.email,
        role: extendedUser?.role || 'employee',
        is_global_admin: extendedUser?.is_global_admin || false,
        profiles: extendedUser?.profiles,
        status: extendedUser?.status || 'active',
        last_login: user.last_sign_in_at,
        created_at: user.created_at,
        updated_at: user.updated_at,
        permissions: extendedUser?.permissions || []
      });
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  async listUsers(): Promise<User[]> {
    try {
      // Get user data
      const { data, error } = await supabase
        .from('extended_users')
        .select(`
          id,
          email,
          role,
          is_global_admin,
          profiles:id(full_name, avatar_url),
          status,
          permissions,
          last_login,
          created_at,
          updated_at
        `);
      
      if (error) {
        console.error('Error fetching users:', error);
        return [];
      }
      
      // Map data safely
      return methodAdapters.listUsers(data || []);
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  },
  
  async getAllUsers(): Promise<User[]> {
    return await userService.listUsers();
  },
  
  async getUserById(userId: string): Promise<User | null> {
    try {
      // Query for the specific user
      const { data, error } = await supabase
        .from('extended_users')
        .select(`
          id,
          email,
          role,
          is_global_admin,
          profiles:id(full_name, avatar_url),
          status,
          permissions,
          last_login,
          created_at,
          updated_at
        `)
        .eq('id', userId)
        .single();
      
      if (error || !data) {
        console.error('Error fetching user by ID:', error);
        return null;
      }
      
      // Map to User type safely
      return mapUserData(data);
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },
  
  async getUsersWithRoles(): Promise<(User & { roles: Role[] })[]> {
    try {
      // Get user data with roles
      const { data, error } = await supabase
        .from('user_roles')
        .select(`
          users:user_id(
            id,
            email,
            role,
            is_global_admin,
            profiles:profile_id(full_name, avatar_url),
            status,
            permissions,
            last_login,
            created_at
          ),
          roles:role_id(
            id,
            name,
            description,
            permissions,
            created_at,
            updated_at
          )
        `);
      
      if (error) {
        console.error('Error fetching users with roles:', error);
        return [];
      }
      
      // Group roles by user
      const usersMap = new Map<string, { user: any; roles: Role[] }>();
      
      data.forEach(record => {
        if (!record.users || !record.roles) return;
        
        const userId = record.users.id;
        
        if (!usersMap.has(userId)) {
          usersMap.set(userId, {
            user: record.users,
            roles: []
          });
        }
        
        // Add role if it doesn't exist
        const userEntry = usersMap.get(userId)!;
        if (!userEntry.roles.some(r => r.id === record.roles.id)) {
          userEntry.roles.push({
            id: record.roles.id,
            name: record.roles.name,
            description: record.roles.description || '',
            permissions: record.roles.permissions || [],
            createdAt: record.roles.created_at,
            updatedAt: record.roles.updated_at
          });
        }
      });
      
      // Convert map to array
      return Array.from(usersMap.values()).map(({ user, roles }) => {
        const userData = {
          id: user.id,
          email: user.email || '',
          role: user.role || 'employee',
          isGlobalAdmin: user.is_global_admin || false,
          fullName: user.profiles?.full_name || user.email?.split('@')[0] || '',
          avatarUrl: user.profiles?.avatar_url || '',
          status: (user.status as any) || 'active',
          permissions: user.permissions || [],
          lastLogin: (user.last_login as any) || null,
          createdAt: (user.created_at as any) || null,
          updatedAt: user.updated_at || null,
          roles: adaptRoles(roles)
        };
        
        return userData;
      });
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      return [];
    }
  },
  
  async getRoles(): Promise<Role[]> {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*');
      
      if (error) {
        console.error('Error fetching roles:', error);
        return [];
      }
      
      return data.map(role => mapRoleData({
        id: role.id,
        name: role.name,
        description: role.description || '',
        permissions: role.permissions || [],
        created_at: role.created_at,
        updated_at: role.updated_at
      }));
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
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
      return await this.getUserById(id);
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null;
    }
  },
  
  async deleteUser(id: string): Promise<boolean> {
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
  },
  
  async getUsersByRole(roleId: string): Promise<User[]> {
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
      
      return (data || []).map(item => {
        const userData = item.users || {};
        const profileData = userData.profiles || {};
        
        return {
          id: item.user_id,
          email: '', // This will be filled in from auth.users if needed
          fullName: typeof profileData === 'object' ? profileData.full_name || '' : '',
          avatarUrl: typeof profileData === 'object' ? profileData.avatar_url || '' : '',
          status: typeof userData === 'object' ? userData.status || 'inactive' : 'inactive',
          role: 'cashier', // Default role
          lastLogin: typeof userData === 'object' ? userData.last_login : null,
          createdAt: typeof userData === 'object' ? userData.created_at : null
        };
      });
    } catch (error) {
      console.error(`Error fetching users by role ${roleId}:`, error);
      return [];
    }
  }
};
