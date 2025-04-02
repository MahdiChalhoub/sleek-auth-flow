
import { supabase } from '@/lib/supabase';
import { Role, UserPermission } from '@/types/auth';
import { toast } from 'sonner';

// Fetch all roles with their permissions
export async function getAllRoles(): Promise<Role[]> {
  try {
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('*');
    
    if (rolesError) throw rolesError;
    
    if (!roles) return [];
    
    // Get role permissions
    const { data: rolePermissions, error: permissionsError } = await supabase
      .from('role_permissions')
      .select('*, permission:permissions(*)');
    
    if (permissionsError) throw permissionsError;
    
    // Get all permissions for mapping
    const { data: allPermissions, error: allPermError } = await supabase
      .from('permissions')
      .select('*');
    
    if (allPermError) throw allPermError;
    
    // Map and combine the data
    const formattedRoles: Role[] = roles.map(role => {
      const permissions: UserPermission[] = allPermissions.map(perm => {
        const rolePermission = rolePermissions?.find(
          rp => rp.role_id === role.id && rp.permission_id === perm.id
        );
        
        return {
          id: perm.id,
          name: perm.name,
          description: perm.description,
          category: perm.category,
          enabled: rolePermission ? rolePermission.enabled : false
        };
      });
      
      return {
        id: role.id,
        name: role.name,
        description: role.description,
        permissions,
        createdAt: role.created_at,
        updatedAt: role.updated_at
      };
    });
    
    return formattedRoles;
  } catch (error) {
    console.error('Error fetching roles:', error);
    toast.error('Failed to fetch roles');
    return [];
  }
}

// Get all permissions
export async function getAllPermissions(): Promise<UserPermission[]> {
  try {
    const { data, error } = await supabase
      .from('permissions')
      .select('*');
    
    if (error) throw error;
    
    if (!data) return [];
    
    return data.map(perm => ({
      id: perm.id,
      name: perm.name,
      description: perm.description,
      category: perm.category,
      enabled: false // Default value
    }));
  } catch (error) {
    console.error('Error fetching permissions:', error);
    toast.error('Failed to fetch permissions');
    return [];
  }
}

// Create a new role
export async function createRole(name: string, description: string, permissions: {id: string, enabled: boolean}[]): Promise<boolean> {
  try {
    // Create role
    const { data: role, error: roleError } = await supabase
      .from('roles')
      .insert({ name, description })
      .select()
      .single();
    
    if (roleError) throw roleError;
    
    // Add permissions
    if (permissions && permissions.length > 0) {
      const rolePermissions = permissions
        .filter(p => p.enabled)
        .map(p => ({
          role_id: role.id,
          permission_id: p.id,
          enabled: p.enabled
        }));
      
      if (rolePermissions.length > 0) {
        const { error: permError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);
        
        if (permError) throw permError;
      }
    }
    
    toast.success('Role created successfully');
    return true;
  } catch (error) {
    console.error('Error creating role:', error);
    toast.error(`Failed to create role: ${error.message}`);
    return false;
  }
}

// Update a role
export async function updateRole(id: string, data: { name?: string; description?: string; permissions?: {id: string, enabled: boolean}[] }): Promise<boolean> {
  try {
    // Update role details if provided
    if (data.name || data.description) {
      const updateData: any = {};
      if (data.name) updateData.name = data.name;
      if (data.description) updateData.description = data.description;
      
      const { error } = await supabase
        .from('roles')
        .update(updateData)
        .eq('id', id);
      
      if (error) throw error;
    }
    
    // Update permissions if provided
    if (data.permissions && data.permissions.length > 0) {
      // Delete existing permissions for this role
      const { error: deleteError } = await supabase
        .from('role_permissions')
        .delete()
        .eq('role_id', id);
      
      if (deleteError) throw deleteError;
      
      // Add new permissions
      const rolePermissions = data.permissions
        .filter(p => p.enabled)
        .map(p => ({
          role_id: id,
          permission_id: p.id,
          enabled: p.enabled
        }));
      
      if (rolePermissions.length > 0) {
        const { error: insertError } = await supabase
          .from('role_permissions')
          .insert(rolePermissions);
        
        if (insertError) throw insertError;
      }
    }
    
    toast.success('Role updated successfully');
    return true;
  } catch (error) {
    console.error('Error updating role:', error);
    toast.error('Failed to update role');
    return false;
  }
}

// Delete a role
export async function deleteRole(id: string): Promise<boolean> {
  try {
    // Check if role is in use
    const { data: userRoles, error: checkError } = await supabase
      .from('user_roles')
      .select('count')
      .eq('role_id', id);
    
    if (checkError) throw checkError;
    
    if (userRoles && userRoles.length > 0) {
      toast.error('Cannot delete role: It is assigned to users');
      return false;
    }
    
    // Delete role
    const { error } = await supabase
      .from('roles')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    
    toast.success('Role deleted successfully');
    return true;
  } catch (error) {
    console.error('Error deleting role:', error);
    toast.error('Failed to delete role');
    return false;
  }
}
