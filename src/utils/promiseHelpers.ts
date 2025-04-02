
/**
 * Convert a Promise<boolean> to a Promise<void> by ignoring the result
 */
export function voidPromise<T>(promise: Promise<T>): Promise<void> {
  return promise.then(() => {});
}

/**
 * Ensure a function accepts a parameter and returns a Promise<boolean>
 */
export function ensureParameterFunction<T>(
  fn: (...args: any[]) => Promise<boolean>,
  defaultParam?: T
): (param?: T) => Promise<boolean> {
  return (param?: T) => {
    return fn(param !== undefined ? param : defaultParam);
  };
}
