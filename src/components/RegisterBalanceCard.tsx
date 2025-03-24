
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface RegisterBalanceCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  className?: string;
  description?: string;
  status?: 'default' | 'success' | 'warning' | 'error' | 'info';
  showTooltip?: boolean;
  tooltipContent?: React.ReactNode;
  onClick?: () => void;
}

const RegisterBalanceCard = ({ 
  title, 
  value, 
  icon, 
  className, 
  description,
  status = 'default',
  showTooltip = false,
  tooltipContent,
  onClick
}: RegisterBalanceCardProps) => {
  // Define status-based styling
  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-green-500';
      case 'warning':
        return 'border-l-4 border-yellow-500';
      case 'error':
        return 'border-l-4 border-red-500';
      case 'info':
        return 'border-l-4 border-blue-500';
      default:
        return className?.includes('border-l-4') ? '' : 'border-l-4 border-gray-300';
    }
  };

  return (
    <Card 
      className={cn(
        "shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md", 
        getStatusStyles(),
        onClick && "cursor-pointer hover:translate-y-[-2px]",
        className
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium">{title}</p>
              {showTooltip && tooltipContent && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="h-3.5 w-3.5 text-muted-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[200px]">
                      {tooltipContent}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>
            <p className="text-xl font-semibold">${value.toFixed(2)}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          <div className={cn(
            "p-2 rounded-full",
            status === 'success' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
            status === 'warning' ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
            status === 'error' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
            status === 'info' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' :
            'bg-primary/10'
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RegisterBalanceCard;
