
/**
 * Convert a Promise<T> to Promise<void> by ignoring the result.
 * Useful when TypeScript complains about Promise<boolean> vs Promise<void>.
 */
export const voidPromise = <T>(promise: Promise<T>): Promise<void> => {
  return promise.then(() => {});
};

/**
 * Convert a Promise<T> to Promise<void> with a callback.
 * Useful when TypeScript complains about Promise<boolean> vs Promise<void>.
 */
export const voidPromiseWithCallback = <T>(
  promise: Promise<T>,
  callback?: (result: T) => void
): Promise<void> => {
  return promise.then((result) => {
    if (callback) {
      callback(result);
    }
  });
};

/**
 * Creates a safe version of a function that returns a promise.
 * It handles errors and shows a toast notification.
 */
export const safeAsyncFunction = <T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  onSuccess?: (result: T) => void,
  onError?: (error: any) => void
) => {
  return async (...args: Args): Promise<T | null> => {
    try {
      const result = await fn(...args);
      if (onSuccess) {
        onSuccess(result);
      }
      return result;
    } catch (error) {
      console.error('Error in async function:', error);
      if (onError) {
        onError(error);
      }
      return null;
    }
  };
};
