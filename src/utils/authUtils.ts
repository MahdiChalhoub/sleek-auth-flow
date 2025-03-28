
import { User } from "@/types/auth";
import { mockUserBusinessAssignments } from "@/models/interfaces/businessInterfaces";
import { toast } from "sonner";

// Create a unique ID based on the email for consistency
export const generateUserId = (email: string): string => {
  return `user-${email.split("@")[0].toLowerCase()}`;
};

// Generate mock user based on email
export const generateMockUser = (email: string, role: User["role"], isGlobalAdmin: boolean): User => {
  const userId = generateUserId(email);
  
  return {
    id: userId,
    name: email.split("@")[0],
    email,
    role,
    avatarUrl: `https://avatar.vercel.sh/${email}`,
    isGlobalAdmin,
    isAdmin: isGlobalAdmin || role === 'admin',
  };
};

// Check if user has access to selected business
export const checkBusinessAccess = (userId: string, businessId: string): boolean => {
  // For development/demo purposes, allow all users access to all businesses
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  
  const userAssignments = mockUserBusinessAssignments.filter(
    assignment => assignment.userId === userId
  );
  
  // If no assignments found but we're in development, allow access
  if (userAssignments.length === 0 && process.env.NODE_ENV === 'development') {
    console.warn('No business assignments found for user, but allowing access in development mode');
    return true;
  }
  
  const userBusinessIds = userAssignments.map(a => a.businessId);
  
  return userBusinessIds.includes(businessId);
};

// Handle login storage based on remember me setting
export const setAuthStorage = (user: User, businessId: string, rememberMe: boolean): void => {
  try {
    // Use appropriate storage based on rememberMe setting
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem("pos_user", JSON.stringify(user));
    storage.setItem("pos_current_business", businessId);
    
    // Store the storage type preference
    localStorage.setItem("auth_storage_type", rememberMe ? "local" : "session");
    
    console.log(`User data stored in ${rememberMe ? 'localStorage' : 'sessionStorage'}`);
  } catch (error) {
    console.error("Error storing auth data:", error);
    toast.error("Failed to save login information");
  }
};

// Clear auth data from storage
export const clearAuthStorage = (): void => {
  try {
    // Get the storage type that was used for login
    const storageType = localStorage.getItem("auth_storage_type") || "local";
    const storage = storageType === "local" ? localStorage : sessionStorage;
    
    // Clear auth data from the appropriate storage
    storage.removeItem("pos_user");
    storage.removeItem("pos_current_business");
    
    // Also clear from the other storage type to be safe
    if (storageType === "local") {
      sessionStorage.removeItem("pos_user");
      sessionStorage.removeItem("pos_current_business");
    } else {
      localStorage.removeItem("pos_user");
      localStorage.removeItem("pos_current_business");
    }
    
    // Clear storage type preference
    localStorage.removeItem("auth_storage_type");
    localStorage.removeItem("intended_redirect");
    
    console.log("Auth storage cleared");
    toast.info("You have been logged out");
  } catch (error) {
    console.error("Error clearing auth storage:", error);
  }
};
