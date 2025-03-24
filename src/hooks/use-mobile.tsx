
import * as React from "react"

// Define breakpoints for different screen sizes
export const BREAKPOINTS = {
  mobile: 640,    // Small phones
  tablet: 768,    // Tablets and large phones
  laptop: 1024,   // Small laptops
  desktop: 1280,  // Desktops and large laptops
}

/**
 * Hook to determine the current screen size category
 * @returns An object with boolean flags for different screen sizes
 */
export function useScreenSize() {
  const [screenSize, setScreenSize] = React.useState<{
    isMobile: boolean
    isTablet: boolean
    isLaptop: boolean
    isDesktop: boolean
  }>({
    isMobile: false,
    isTablet: false,
    isLaptop: false,
    isDesktop: false
  })

  React.useEffect(() => {
    // Initial check
    handleResize()
    
    // Set up resize listener
    const handleResizeDebounced = debounce(handleResize, 250)
    window.addEventListener("resize", handleResizeDebounced)
    
    // Cleanup
    return () => window.removeEventListener("resize", handleResizeDebounced)
    
    function handleResize() {
      const width = window.innerWidth
      setScreenSize({
        isMobile: width < BREAKPOINTS.mobile,
        isTablet: width >= BREAKPOINTS.mobile && width < BREAKPOINTS.laptop,
        isLaptop: width >= BREAKPOINTS.laptop && width < BREAKPOINTS.desktop,
        isDesktop: width >= BREAKPOINTS.desktop
      })
    }
  }, [])

  return screenSize
}

/**
 * Legacy hook for backward compatibility
 * @returns Boolean indicating if the screen is mobile-sized
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${BREAKPOINTS.tablet - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.tablet)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < BREAKPOINTS.tablet)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}

// Simple debounce function to prevent excessive resize calculations
function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null
  
  return function executedFunction(...args: any[]) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

