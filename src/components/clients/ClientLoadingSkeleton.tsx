
import React from 'react';

interface ClientLoadingSkeletonProps {
  type?: 'list' | 'profile' | 'form';
}

export const ClientLoadingSkeleton: React.FC<ClientLoadingSkeletonProps> = ({ 
  type = 'list' 
}) => {
  if (type === 'profile') {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <div className="border rounded-lg p-6 space-y-4">
              <div className="h-8 w-1/3 bg-muted animate-pulse rounded-md"></div>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
                    <div className="h-8 w-full bg-muted animate-pulse rounded-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded-lg p-6 space-y-4 h-full">
              <div className="h-8 w-1/2 bg-muted animate-pulse rounded-md"></div>
              <div className="space-y-4">
                <div className="h-16 w-full bg-muted animate-pulse rounded-md"></div>
                <div className="h-16 w-full bg-muted animate-pulse rounded-md"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 space-y-4">
          <div className="h-8 w-1/3 bg-muted animate-pulse rounded-md"></div>
          <div className="h-64 w-full bg-muted animate-pulse rounded-md"></div>
        </div>
      </div>
    );
  }
  
  if (type === 'form') {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <div className="h-8 w-1/3 bg-muted animate-pulse rounded-md"></div>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
              <div className="h-10 w-full bg-muted animate-pulse rounded-md"></div>
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
            <div className="h-24 w-full bg-muted animate-pulse rounded-md"></div>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }
  
  // Default list loading skeleton
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="h-8 w-28 bg-muted animate-pulse rounded-md"></div>
        <div className="h-10 w-32 bg-muted animate-pulse rounded-md"></div>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="h-12 border-b bg-muted/20 px-4 flex items-center">
          <div className="grid grid-cols-6 w-full">
            <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-20 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-24 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-16 bg-muted animate-pulse rounded-md"></div>
            <div className="h-4 w-8 bg-muted animate-pulse rounded-md"></div>
          </div>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3">
              <div className="grid grid-cols-6 w-full">
                <div className="h-5 w-28 bg-muted animate-pulse rounded-md"></div>
                <div className="h-5 w-32 bg-muted animate-pulse rounded-md"></div>
                <div className="h-5 w-16 bg-muted animate-pulse rounded-md"></div>
                <div className="h-5 w-24 bg-muted animate-pulse rounded-md"></div>
                <div className="h-5 w-16 bg-muted animate-pulse rounded-md"></div>
                <div className="h-8 w-8 bg-muted animate-pulse rounded-md ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <div className="h-8 w-64 bg-muted animate-pulse rounded-md"></div>
      </div>
    </div>
  );
};
