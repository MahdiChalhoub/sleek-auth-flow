
// This file re-exports all transaction-related types and interfaces for backward compatibility

// Re-export types
export * from './types/transactionTypes';

// Re-export interfaces
export * from './interfaces/transactionInterfaces';
export * from './interfaces/registerInterfaces';
export * from './interfaces/permissionInterfaces';
// Exclude Branch from branchInterfaces to avoid conflicts with businessInterfaces
export * from './interfaces/backupInterfaces';
// Explicitly import and re-export businessInterfaces to ensure no conflicts
export { Business, UserBusinessAssignment, Branch } from './interfaces/businessInterfaces';

// Re-export mock data
export * from './mockData/transactionMockData';
export * from './mockData/registerMockData';
export * from './mockData/miscMockData';
// Import only what's needed from businessInterfaces to avoid duplicate exports
export { mockBusinesses, mockBranches, mockUserBusinessAssignments } from './interfaces/businessInterfaces';
