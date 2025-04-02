
import { supabase } from '@/lib/supabase';
import { User, Role as AuthRole } from '@/types/auth';
import { adaptRoles } from '@/utils/roleAdapter';
import { Role } from '@/models/role';
import { mockRoles } from '@/models/role';

/**
 * User Service - Handle all user-related operations
 */
export const userService = {
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // In a real implementation, fetch extended user data
      // For now, return a mock user
      return {
        id: user.id,
        email: user.email || '',
        fullName: 'Demo User',
        status: 'active',
        role: 'admin',
        permissions: [],
        lastLogin: user.last_sign_in_at,
        createdAt: user.created_at
      };
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  },
  
  async listUsers(): Promise<User[]> {
    try {
      // For development, return mock users
      return [
        {
          id: 'user-1',
          email: 'admin@example.com',
          fullName: 'Admin User',
          status: 'active',
          role: 'admin',
          permissions: [],
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 'user-2',
          email: 'manager@example.com',
          fullName: 'Manager User',
          status: 'active',
          role: 'manager',
          permissions: [],
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z'
        },
        {
          id: 'user-3',
          email: 'cashier@example.com',
          fullName: 'Cashier User',
          status: 'active',
          role: 'cashier',
          permissions: [],
          lastLogin: new Date().toISOString(),
          createdAt: '2023-01-01T00:00:00Z'
        }
      ];
    } catch (error) {
      console.error('Error listing users:', error);
      return [];
    }
  },
  
  // Alias for listUsers for compatibility
  async getAllUsers(): Promise<User[]> {
    return await this.listUsers();
  },
  
  async getUserById(userId: string): Promise<User | null> {
    try {
      const users = await this.listUsers();
      return users.find(user => user.id === userId) || null;
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  },
  
  async getUsersWithRoles(): Promise<(User & { roles: Role[] })[]> {
    try {
      const users = await this.listUsers();
      const roles = mockRoles;
      
      return users.map(user => {
        const userRoles = roles.filter(role => 
          role.name.toLowerCase() === user.role.toLowerCase()
        );
        
        return {
          ...user,
          roles: userRoles
        };
      });
    } catch (error) {
      console.error('Error fetching users with roles:', error);
      return [];
    }
  },
  
  async getRoles(): Promise<Role[]> {
    try {
      return mockRoles;
    } catch (error) {
      console.error('Error fetching roles:', error);
      return [];
    }
  },
  
  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    try {
      // In a real implementation, update the user in the database
      // For now, return a mock updated user
      return {
        id,
        email: userData.email || 'user@example.com',
        fullName: userData.fullName || 'Updated User',
        status: userData.status || 'active',
        role: userData.role || 'cashier',
        permissions: userData.permissions || [],
        lastLogin: new Date().toISOString(),
        createdAt: '2023-01-01T00:00:00Z'
      };
    } catch (error) {
      console.error(`Error updating user with ID ${id}:`, error);
      return null;
    }
  },
  
  async deleteUser(id: string): Promise<boolean> {
    try {
      // In a real implementation, delete the user from the database
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
      return false;
    }
  }
};

// Re-exports for compatibility
export const getAllUsers = userService.getAllUsers.bind(userService);
export const updateUser = userService.updateUser.bind(userService);
export const deleteUser = userService.deleteUser.bind(userService);
