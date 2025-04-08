
import { useState, useEffect } from 'react';
import { useScreenSize } from './use-mobile';

export interface ResponsiveConfig {
  containerClass: string;
  headerSize: 'sm' | 'md' | 'lg';
  cardLayout: 'grid' | 'list' | 'compact';
  showActions: boolean;
  showFilters: boolean;
  mainContentPadding: string;
}

export function useResponsiveLayout(): ResponsiveConfig {
  const { isMobile, isTablet, isLaptop, isDesktop } = useScreenSize();
  const [config, setConfig] = useState<ResponsiveConfig>({
    containerClass: 'container mx-auto p-6',
    headerSize: 'lg',
    cardLayout: 'grid',
    showActions: true,
    showFilters: true,
    mainContentPadding: 'p-6'
  });
  
  useEffect(() => {
    if (isMobile) {
      setConfig({
        containerClass: 'p-3 mobile-container',
        headerSize: 'sm',
        cardLayout: 'compact',
        showActions: false,
        showFilters: false,
        mainContentPadding: 'p-3'
      });
    } else if (isTablet) {
      setConfig({
        containerClass: 'container mx-auto p-4',
        headerSize: 'md',
        cardLayout: 'grid', // Changed from 'list' to 'grid' for better tablet experience
        showActions: true,
        showFilters: true,
        mainContentPadding: 'p-4'
      });
    } else if (isLaptop) {
      setConfig({
        containerClass: 'container mx-auto p-5 max-w-6xl',
        headerSize: 'lg',
        cardLayout: 'grid',
        showActions: true,
        showFilters: true,
        mainContentPadding: 'p-5'
      });
    } else {
      // Desktop
      setConfig({
        containerClass: 'container mx-auto p-6 max-w-7xl',
        headerSize: 'lg',
        cardLayout: 'grid',
        showActions: true,
        showFilters: true,
        mainContentPadding: 'p-6'
      });
    }
  }, [isMobile, isTablet, isLaptop, isDesktop]);
  
  return config;
}
