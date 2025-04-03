
import { User, UserRole, UserStatus } from '@/types/auth';

/**
 * Convert a Supabase auth user to our internal User type
 */
export function mapAuthUserToUser(authUser: any, additionalData: { role?: UserRole, status?: UserStatus } = {}): User {
  if (!authUser) return null as unknown as User;
  
  const email = authUser.email || '';
  const displayName = authUser.user_metadata?.name || 
                       authUser.user_metadata?.full_name || 
                       email.split('@')[0];
  
  return {
    id: authUser.id,
    email,
    fullName: displayName,
    name: displayName, // Add name property for backward compatibility
    avatarUrl: authUser.user_metadata?.avatar_url,
    avatar_url: authUser.user_metadata?.avatar_url,
    status: additionalData.status || 'active' as UserStatus,
    role: additionalData.role || 'cashier',
    lastLogin: authUser.last_sign_in_at,
    createdAt: authUser.created_at,
    isGlobalAdmin: false // Default value
  };
}

/**
 * Get the appropriate name for display from a user object
 */
export function getUserDisplayName(user: User | null): string {
  if (!user) return 'Guest';
  return user.fullName || user.name || user.email.split('@')[0] || 'User';
}

/**
 * Check if a user has a specific role
 */
export function hasRole(user: User | null, role: string): boolean {
  if (!user) return false;
  return user.role === role || (role !== 'admin' && user.role === 'admin');
}

/**
 * Check if the user is an administrator
 */
export function isAdmin(user: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || !!user.isGlobalAdmin;
}
