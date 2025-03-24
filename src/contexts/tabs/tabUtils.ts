
import { Tab } from "./types";

/**
 * Check if a path matches a pattern, supporting dynamic segments
 */
export const isPathMatch = (patternPath: string, actualPath: string): boolean => {
  const patternSegments = patternPath.split('/').filter(Boolean);
  const actualSegments = actualPath.split('/').filter(Boolean);
  
  if (patternSegments.length !== actualSegments.length) return false;
  
  return patternSegments.every((segment, i) => {
    // If the segment starts with ':', it's a parameter
    if (segment.startsWith(':')) return true;
    return segment === actualSegments[i];
  });
};

/**
 * Find a tab by path, supporting exact matches and pattern matching
 */
export const findTabByPath = (tabs: Tab[], path: string): Tab | undefined => {
  // Check for exact path match first
  let tab = tabs.find(t => t.path === path);
  
  if (!tab) {
    // Check for pattern matching (for dynamic routes)
    tab = tabs.find(t => isPathMatch(t.path, path));
  }
  
  return tab;
};
