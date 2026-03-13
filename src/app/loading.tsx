import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

export default function Loading() {
  return (
    <div className='p-10'>
      <Skeleton className='h-10 w-64 mb-8' />
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {[...Array(8)].map((_, i) => (
          <div key={i} className='space-y-4 border p-4 rounded-lg'>
            <Skeleton className='h-64 w-full rounded-md' />
            <Skeleton className='h-6 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </div>
        ))}
      </div>
    </div>
  );
}