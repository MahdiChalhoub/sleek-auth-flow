
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

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
              <Skeleton className="h-8 w-1/3"/>
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20"/>
                    <Skeleton className="h-8 w-full"/>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20"/>
                    <Skeleton className="h-8 w-full"/>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20"/>
                    <Skeleton className="h-8 w-full"/>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-20"/>
                    <Skeleton className="h-8 w-full"/>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div className="border rounded-lg p-6 space-y-4 h-full">
              <Skeleton className="h-8 w-1/2"/>
              <div className="space-y-4">
                <Skeleton className="h-16 w-full"/>
                <Skeleton className="h-16 w-full"/>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border rounded-lg p-6 space-y-4">
          <Skeleton className="h-8 w-1/3"/>
          <Skeleton className="h-64 w-full"/>
        </div>
      </div>
    );
  }
  
  if (type === 'form') {
    return (
      <div className="border rounded-lg p-6 space-y-4">
        <Skeleton className="h-8 w-1/3"/>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20"/>
              <Skeleton className="h-10 w-full"/>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20"/>
              <Skeleton className="h-10 w-full"/>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-20"/>
              <Skeleton className="h-10 w-full"/>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20"/>
              <Skeleton className="h-10 w-full"/>
            </div>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-24 w-full"/>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Skeleton className="h-10 w-24"/>
            <Skeleton className="h-10 w-24"/>
          </div>
        </div>
      </div>
    );
  }
  
  // Default list loading skeleton
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-28"/>
        <Skeleton className="h-10 w-32"/>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <div className="h-12 border-b bg-muted/20 px-4 flex items-center">
          <div className="grid grid-cols-6 w-full">
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-20"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-4 w-24"/>
            <Skeleton className="h-4 w-16"/>
            <Skeleton className="h-4 w-8"/>
          </div>
        </div>
        <div className="divide-y">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="px-4 py-3">
              <div className="grid grid-cols-6 w-full">
                <Skeleton className="h-5 w-28"/>
                <Skeleton className="h-5 w-32"/>
                <Skeleton className="h-5 w-16"/>
                <Skeleton className="h-5 w-24"/>
                <Skeleton className="h-5 w-16"/>
                <Skeleton className="h-8 w-8 ml-auto"/>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Skeleton className="h-8 w-64"/>
      </div>
    </div>
  );
};
