
import { supabase } from '@/lib/supabase';
import { ProductBatch } from '@/models/productBatch';

interface GetProductBatchesResult {
  data: ProductBatch[];
  count: number;
}

export async function getProductBatches(
  page = 1,
  limit = 10,
  filters: Record<string, any> = {}
): Promise<GetProductBatchesResult> {
  try {
    const { data, error } = await supabase.rpc('get_product_batches', {
      page_number: page,
      page_size: limit,
      filter_options: filters
    }) as any;

    if (error) throw error;

    return data as GetProductBatchesResult;
  } catch (error) {
    console.error('Error fetching product batches:', error);
    return { data: [], count: 0 };
  }
}

export async function getExpiringSoonBatches(daysThreshold = 30): Promise<ProductBatch[]> {
  try {
    const { data, error } = await supabase.rpc('get_expiring_soon_batches', {
      days_threshold: daysThreshold
    }) as any;

    if (error) throw error;

    return data as unknown as ProductBatch[];
  } catch (error) {
    console.error('Error fetching expiring soon batches:', error);
    return [];
  }
}

export async function getExpiredBatches(): Promise<ProductBatch[]> {
  try {
    const { data, error } = await supabase.rpc('get_expired_batches') as any;

    if (error) throw error;

    return data as unknown as ProductBatch[];
  } catch (error) {
    console.error('Error fetching expired batches:', error);
    return [];
  }
}

export async function updateBatchStatus(
  batchId: string,
  status: 'active' | 'expired' | 'disposed' | 'quarantined'
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('update_batch_status', {
      batch_id: batchId,
      new_status: status
    }) as any;

    if (error) throw error;

    return data as unknown as boolean;
  } catch (error) {
    console.error('Error updating batch status:', error);
    return false;
  }
}

export async function disposeBatch(
  batchId: string,
  disposalNotes: string,
  disposedBy: string
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('dispose_batch', {
      batch_id: batchId,
      disposal_notes: disposalNotes,
      disposed_by: disposedBy
    }) as any;

    if (error) throw error;

    return data as unknown as boolean;
  } catch (error) {
    console.error('Error disposing batch:', error);
    return false;
  }
}

// Export as a service object to make it easier to import
export const productBatchService = {
  getProductBatches,
  getExpiringSoonBatches,
  getExpiredBatches,
  updateBatchStatus,
  disposeBatch
};
