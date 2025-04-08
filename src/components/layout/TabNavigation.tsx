
import React, { useState } from 'react';
import { useTabs } from '@/contexts/tabs';
import {
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

const TabNavigation = () => {
  const { tabs, activeTabId, closeTab, activateTab, openTab } = useTabs();
  const [scrollPosition, setScrollPosition] = useState(0);
  const scrollAreaRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollAreaRef.current) {
      const scrollAmount = 200;
      const newScrollPosition =
        direction === 'left'
          ? Math.max(0, scrollPosition - scrollAmount)
          : scrollPosition + scrollAmount;
      
      scrollAreaRef.current.scrollTo({
        left: newScrollPosition,
        behavior: 'smooth',
      });
      
      setScrollPosition(newScrollPosition);
    }
  };

  // Only show the navigation if there are tabs
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="border-b bg-background flex w-full h-12 sticky top-0 z-10">
      <div className="flex items-center px-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleScroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>

      <div 
        ref={scrollAreaRef}
        className="flex overflow-x-auto hide-scrollbar min-w-0 h-full"
        style={{ height: '100vh' }} 
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`
              flex items-center min-w-[180px] max-w-[220px] px-4 h-full 
              border-r border-b-2 shrink-0 transition-colors group
              ${activeTabId === tab.id 
                ? 'border-b-primary bg-background text-foreground' 
                : 'border-b-transparent hover:bg-accent/50 text-muted-foreground'
              }
            `}
            onClick={() => activateTab(tab.id)}
          >
            <div className="truncate flex-1 text-left">{tab.title}</div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
              }}
            >
              <X className="h-3 w-3" />
            </Button>
          </button>
        ))}

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-full px-2 border-r"
              onClick={() => openTab({ 
                title: 'New Tab', 
                path: '/dashboard',
                icon: 'Plus'
              })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add new tab</TooltipContent>
        </Tooltip>
      </div>

      <div className="flex items-center px-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handleScroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TabNavigation;
