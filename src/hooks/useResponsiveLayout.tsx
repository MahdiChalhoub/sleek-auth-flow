
import { useState, useEffect } from 'react';
import { useScreenSize } from './use-mobile';

export interface ResponsiveConfig {
  containerClass: string;
  headerSize: 'sm' | 'md' | 'lg';
  cardLayout: 'grid' | 'list' | 'compact';
  showActions: boolean;
  showFilters: boolean;
}

export function useResponsiveLayout(): ResponsiveConfig {
  const { isMobile, isTablet, isLaptop, isDesktop } = useScreenSize();
  const [config, setConfig] = useState<ResponsiveConfig>({
    containerClass: 'container mx-auto p-6',
    headerSize: 'lg',
    cardLayout: 'grid',
    showActions: true,
    showFilters: true
  });
  
  useEffect(() => {
    if (isMobile) {
      setConfig({
        containerClass: 'p-3 mobile-container',
        headerSize: 'sm',
        cardLayout: 'compact',
        showActions: false,
        showFilters: false
      });
    } else if (isTablet) {
      setConfig({
        containerClass: 'container mx-auto p-4',
        headerSize: 'md',
        cardLayout: 'list',
        showActions: true,
        showFilters: false
      });
    } else if (isLaptop) {
      setConfig({
        containerClass: 'container mx-auto p-5',
        headerSize: 'lg',
        cardLayout: 'grid',
        showActions: true,
        showFilters: true
      });
    } else {
      // Desktop
      setConfig({
        containerClass: 'container mx-auto p-6',
        headerSize: 'lg',
        cardLayout: 'grid',
        showActions: true,
        showFilters: true
      });
    }
  }, [isMobile, isTablet, isLaptop, isDesktop]);
  
  return config;
}
