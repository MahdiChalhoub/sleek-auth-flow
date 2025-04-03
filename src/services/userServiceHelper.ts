
import { User, UserRole } from '@/types/auth';

/**
 * Maps database user object to User interface
 */
export function mapDBUserToUser(dbUser: any): User {
  if (!dbUser) return null as unknown as User;
  
  return {
    id: dbUser.id || '',
    email: dbUser.email || '',
    fullName: dbUser.fullName || dbUser.full_name || '',
    name: dbUser.fullName || dbUser.full_name || '', // For backward compatibility
    avatar_url: dbUser.avatar_url || null,
    avatarUrl: dbUser.avatar_url || null, // For backward compatibility
    role: dbUser.role as UserRole || 'user',
    status: dbUser.status || 'pending',
    lastLogin: dbUser.last_login || dbUser.lastLogin || null,
    createdAt: dbUser.created_at || dbUser.createdAt || '',
    updatedAt: dbUser.updated_at || dbUser.updatedAt || ''
  };
}

/**
 * Maps User interface to database object
 */
export function mapUserToDB(user: Partial<User>): Record<string, any> {
  const dbUser: Record<string, any> = {};
  
  if (user.email !== undefined) dbUser.email = user.email;
  if (user.fullName !== undefined) dbUser.fullName = user.fullName;
  if (user.avatar_url !== undefined) dbUser.avatar_url = user.avatar_url;
  if (user.role !== undefined) dbUser.role = user.role;
  if (user.status !== undefined) dbUser.status = user.status;
  
  return dbUser;
}
