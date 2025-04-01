
// Re-export all the API services for backward compatibility
export { clientsApi } from './services/clientsApi';
export { suppliersApi } from './services/suppliersApi';
export { stockTransfersApi } from './services/stockTransfersApi';
export { transactionsApi } from './services/transactionsApi';
export { mapDbClientToModel } from './mappers/clientMappers';
export { mapDatabaseStatus, mapToDbStatus } from './mappers/statusMappers';
