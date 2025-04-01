
import { supabase } from '@/lib/supabase';
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

type EventCallback = (payload: RealtimePostgresChangesPayload<any>) => void;
type EventHandler = { id: string; callback: EventCallback };

/**
 * Simple event system for Supabase realtime events
 * Allows components to subscribe to database changes
 */
class SupabaseEventEmitter {
  private handlers: Record<string, EventHandler[]> = {};
  private channels: Record<string, any> = {};
  
  /**
   * Subscribe to changes on a specific table
   * @param table Table name to subscribe to
   * @param event Event type ('INSERT', 'UPDATE', 'DELETE', '*')
   * @param callback Function to call when event occurs
   * @returns Unique handler ID for unsubscribing
   */
  subscribe(table: string, event: 'INSERT' | 'UPDATE' | 'DELETE' | '*', callback: EventCallback): string {
    const eventKey = `${table}:${event}`;
    const handlerId = Math.random().toString(36).substring(2, 9);
    
    if (!this.handlers[eventKey]) {
      this.handlers[eventKey] = [];
    }
    
    this.handlers[eventKey].push({ id: handlerId, callback });
    
    // Set up channel if not already listening
    if (!this.channels[table]) {
      const channel = supabase
        .channel(`table-changes-${table}`)
        .on(
          'postgres_changes' as any,
          {
            event: event === '*' ? undefined : event,
            schema: 'public',
            table
          }, 
          (payload) => {
            const eventType = payload.eventType as 'INSERT' | 'UPDATE' | 'DELETE';
            this.emit(`${table}:${eventType}`, payload);
            this.emit(`${table}:*`, payload);
          }
        )
        .subscribe();
      
      this.channels[table] = channel;
    }
    
    return handlerId;
  }
  
  /**
   * Unsubscribe from an event using handler ID
   * @param table Table that was subscribed to
   * @param event Event type that was subscribed to
   * @param handlerId Handler ID returned from subscribe
   */
  unsubscribe(table: string, event: 'INSERT' | 'UPDATE' | 'DELETE' | '*', handlerId: string): void {
    const eventKey = `${table}:${event}`;
    
    if (this.handlers[eventKey]) {
      this.handlers[eventKey] = this.handlers[eventKey].filter(
        handler => handler.id !== handlerId
      );
      
      // If no handlers left for this table, remove channel
      if (this.noHandlersForTable(table)) {
        if (this.channels[table]) {
          supabase.removeChannel(this.channels[table]);
          delete this.channels[table];
        }
      }
    }
  }
  
  /**
   * Check if there are any handlers for a table
   * @param table Table name to check
   * @returns Whether there are any handlers
   */
  private noHandlersForTable(table: string): boolean {
    return !Object.keys(this.handlers).some(key => key.startsWith(`${table}:`));
  }
  
  /**
   * Emit an event to all subscribers
   * @param eventKey Event key in format 'table:event'
   * @param payload Event data
   */
  private emit(eventKey: string, payload: any): void {
    const handlers = this.handlers[eventKey];
    
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler.callback(payload);
        } catch (err) {
          console.error('Error in Supabase event handler:', err);
        }
      });
    }
  }
}

export const supabaseEvents = new SupabaseEventEmitter();
