
// Re-export all the API services for backward compatibility
import { clientsApi } from './services/clientsApi';
import { suppliersApi } from './services/suppliersApi';
import { stockTransfersApi } from './services/stockTransfersApi';
import { transactionsApi } from './services/transactionsApi';
import { mapDbClientToModel } from './mappers/clientMappers';
import { mapDatabaseStatus, mapToDbStatus } from './mappers/statusMappers';
import { productTypesApi } from './services/productTypesApi';

// Re-export utility functions from typeUtils
import { assertType, hasProperty, safeGet, hasRequiredProperties } from '@/utils/typeUtils';

// Re-export Supabase utility functions
import { 
  safeArray, 
  rpcParams, 
  tableSource, 
  formatSupabaseError, 
  settleAll, 
  safeQuery, 
  safeTransaction 
} from '@/utils/supabaseUtils';

export {
  // API services
  clientsApi,
  suppliersApi,
  stockTransfersApi,
  transactionsApi,
  productTypesApi,
  
  // Mappers
  mapDbClientToModel,
  mapDatabaseStatus,
  mapToDbStatus,
  
  // Type utilities
  assertType,
  hasProperty,
  safeGet,
  hasRequiredProperties,
  
  // Supabase utilities
  safeArray,
  rpcParams,
  tableSource,
  formatSupabaseError,
  settleAll,
  safeQuery,
  safeTransaction
};
