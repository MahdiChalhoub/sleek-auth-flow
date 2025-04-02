
/**
 * Utility function to convert a Promise<boolean> to a Promise<void>
 * Useful for type compatibility when functions need to return void promises
 */
export const voidPromise = async <T>(promise: Promise<T>): Promise<void> => {
  await promise;
  return;
};

/**
 * Utility function to transform any function that returns Promise<T> to Promise<void>
 */
export const makeVoidFunction = <T extends any[], R>(
  fn: (...args: T) => Promise<R>
): (...args: T) => Promise<void> => {
  return async (...args: T): Promise<void> => {
    await fn(...args);
    return;
  };
};
