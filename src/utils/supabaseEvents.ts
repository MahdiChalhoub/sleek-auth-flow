import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type ChangeHandler<T> = (payload: RealtimePostgresChangesPayload<T>) => void;
type BroadcastHandler = (payload: any) => void;

interface SubscriptionConfig<T> {
  table: string;
  schema?: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
}

// Store for active subscriptions
const activeSubscriptions: Map<string, RealtimeChannel> = new Map();

/**
 * Subscribe to real-time changes on a table
 */
export function subscribeToChanges<T = any>(
  config: SubscriptionConfig<T>,
  handler: ChangeHandler<T>
): () => void {
  const { table, schema = 'public', event = '*', filter } = config;
  
  // Create safe channel config for postgres_changes
  const channelConfig = {
    event,
    schema,
    table,
    filter
  };
  
  const channel = supabase
    .channel(`table-db-changes-${table}`)
    .on(
      'postgres_changes' as any,
      channelConfig,
      (payload) => handler(payload as RealtimePostgresChangesPayload<T>)
    )
    .subscribe();

  const channelId = `${schema}.${table}.${event}.${filter || ''}`;
  activeSubscriptions.set(channelId, channel);

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
    activeSubscriptions.delete(channelId);
  };
}

/**
 * Subscribe to a broadcast channel
 */
export function subscribeToBroadcast(
  channelName: string,
  event: string,
  handler: BroadcastHandler
): () => void {
  const channel = supabase
    .channel(channelName)
    .on('broadcast', { event }, (payload) => {
      handler(payload.payload);
    })
    .subscribe();

  const channelId = `broadcast.${channelName}.${event}`;
  activeSubscriptions.set(channelId, channel);

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel);
    activeSubscriptions.delete(channelId);
  };
}

/**
 * Send a broadcast message
 */
export async function broadcast(channelName: string, event: string, payload: any): Promise<void> {
  await supabase.channel(channelName).send({
    type: 'broadcast',
    event,
    payload
  });
}

/**
 * Unsubscribe from all active subscriptions
 */
export function unsubscribeAll(): void {
  activeSubscriptions.forEach((channel) => {
    supabase.removeChannel(channel);
  });
  activeSubscriptions.clear();
}
