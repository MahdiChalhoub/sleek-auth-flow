
import { useState, useEffect } from 'react';
import { useScreenSize } from './use-mobile';

export interface ResponsiveConfig {
  containerClass: string;
  headerSize: 'sm' | 'md' | 'lg';
  cardLayout: 'grid' | 'list' | 'compact';
  gridColumns: string;
  cardWidth: string;
  cardHeight: string;
  showActions: boolean;
  showFilters: boolean;
}

export function useResponsiveLayout(): ResponsiveConfig {
  const { isMobile, isTablet, isLaptop, isDesktop } = useScreenSize();
  const [config, setConfig] = useState<ResponsiveConfig>({
    containerClass: 'container mx-auto p-6',
    headerSize: 'lg',
    cardLayout: 'grid',
    gridColumns: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    cardWidth: 'w-full',
    cardHeight: 'h-full',
    showActions: true,
    showFilters: true
  });
  
  useEffect(() => {
    if (isMobile) {
      setConfig({
        containerClass: 'p-3 mobile-container',
        headerSize: 'sm',
        cardLayout: 'compact',
        gridColumns: 'grid-cols-1',
        cardWidth: 'w-full',
        cardHeight: 'h-auto',
        showActions: false,
        showFilters: false
      });
    } else if (isTablet) {
      setConfig({
        containerClass: 'container mx-auto p-4',
        headerSize: 'md',
        cardLayout: 'grid',
        gridColumns: 'grid-cols-2',
        cardWidth: 'w-full',
        cardHeight: 'h-full',
        showActions: true,
        showFilters: true
      });
    } else if (isLaptop) {
      setConfig({
        containerClass: 'container mx-auto p-5 max-w-6xl',
        headerSize: 'lg',
        cardLayout: 'grid',
        gridColumns: 'grid-cols-3',
        cardWidth: 'w-full',
        cardHeight: 'h-full',
        showActions: true,
        showFilters: true
      });
    } else {
      // Desktop
      setConfig({
        containerClass: 'container mx-auto p-6 max-w-7xl',
        headerSize: 'lg',
        cardLayout: 'grid',
        gridColumns: 'grid-cols-4',
        cardWidth: 'w-full',
        cardHeight: 'h-full',
        showActions: true,
        showFilters: true
      });
    }
  }, [isMobile, isTablet, isLaptop, isDesktop]);
  
  return config;
}
