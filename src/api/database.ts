
// Re-export all the API services for backward compatibility
import { clientsApi } from './services/clientsApi';
import { suppliersApi } from './services/suppliersApi';
import { stockTransfersApi } from './services/stockTransfersApi';
import { transactionsApi } from './services/transactionsApi';
import { mapDbClientToModel } from './mappers/clientMappers';
import { mapDatabaseStatus, mapToDbStatus } from './mappers/statusMappers';
import { productTypesApi } from './services/productTypesApi';

export {
  clientsApi,
  suppliersApi,
  stockTransfersApi,
  transactionsApi,
  mapDbClientToModel,
  mapDatabaseStatus,
  mapToDbStatus,
  productTypesApi
};
