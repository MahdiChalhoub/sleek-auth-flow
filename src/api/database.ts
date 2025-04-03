
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
import { safeArray } from '@/utils/supabaseUtils';
import { fromTable, isDataResponse } from '@/utils/supabaseServiceHelper';

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
  fromTable,
  isDataResponse
};
