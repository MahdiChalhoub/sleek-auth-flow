
import React from 'react';

/**
 * Helper function to safely render a category that might be a string or an object
 */
export function renderCategory(category: string | { id: string; name: string }): string {
  if (typeof category === 'string') {
    return category;
  }
  
  if (category && typeof category === 'object' && 'name' in category) {
    return category.name;
  }
  
  return 'Unknown';
}

/**
 * Helper function to safely get a category ID that might be from a string or an object
 */
export function getCategoryId(category: string | { id: string; name: string }): string {
  if (typeof category === 'string') {
    return category;
  }
  
  if (category && typeof category === 'object' && 'id' in category) {
    return category.id;
  }
  
  return '';
}

/**
 * Helper function to safely compare categories that might be strings or objects
 */
export function categoriesMatch(
  category1: string | { id: string; name: string } | undefined,
  category2: string | { id: string; name: string } | undefined
): boolean {
  const id1 = category1 ? getCategoryId(category1) : '';
  const id2 = category2 ? getCategoryId(category2) : '';
  
  return id1 === id2;
}
