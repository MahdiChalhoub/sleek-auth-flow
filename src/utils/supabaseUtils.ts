
/**
 * Safely converts an array or null to a mapped array
 * @param data The array to map or null
 * @param mapper The mapping function
 * @returns The mapped array or empty array if data is null
 */
export function safeArray<T, R>(data: T[] | null, mapper: (item: T) => R): R[] {
  if (!data || !Array.isArray(data)) return [];
  return data.map(mapper);
}
