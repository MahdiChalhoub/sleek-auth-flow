
/**
 * A utility function that returns a void promise for use in places
 * where a promise returning void is expected but we don't need to do anything
 */
export function voidPromise(): Promise<void> {
  return Promise.resolve();
}

/**
 * Wraps an async function to ensure it returns a Promise<void>
 * Useful for event handlers that expect void promises
 */
export function safeAsyncFunction<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<void> {
  return async (...args: any[]) => {
    try {
      await fn(...args);
    } catch (error) {
      console.error('Error in async function:', error);
    }
  };
}
