
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { PostgrestError } from '@supabase/supabase-js';
import { formatSupabaseError } from '@/utils/supabaseUtils';

interface SupabaseQueryOptions<T> {
  queryFn: () => Promise<{ data: T | null; error: PostgrestError | null }>;
  onSuccess?: (data: T) => void;
  onError?: (error: PostgrestError) => void;
  showToastOnError?: boolean;
  errorMessage?: string;
  dependencies?: any[];
}

/**
 * Custom hook for handling Supabase queries with consistent error handling
 */
export function useSupabaseQuery<T = any>({
  queryFn,
  onSuccess,
  onError,
  showToastOnError = true,
  errorMessage = 'Error loading data',
  dependencies = []
}: SupabaseQueryOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<PostgrestError | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await queryFn();
      
      if (error) {
        setError(error);
        if (onError) onError(error);
        if (showToastOnError) {
          toast.error(`${errorMessage}: ${formatSupabaseError(error)}`);
        }
        return;
      }
      
      setData(data);
      if (onSuccess && data) onSuccess(data);
    } catch (err) {
      console.error('Unexpected error in useSupabaseQuery:', err);
      if (showToastOnError) {
        toast.error(`${errorMessage}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies);

  const refetch = () => fetchData();

  return { data, isLoading, error, refetch };
}
