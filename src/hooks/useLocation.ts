
import { useContext } from 'react';
import { useLocationContext } from '@/contexts/LocationContext';

export function useLocation() {
  return useLocationContext();
}
