
import { useContext } from 'react';
import { LocationContext, useLocationContext } from '@/contexts/LocationContext';

export function useLocation() {
  return useLocationContext();
}
