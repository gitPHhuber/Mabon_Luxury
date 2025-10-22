import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductCardSkeleton = () => (
    <div>
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="mt-4 space-y-2">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-5 w-1/4 mx-auto" />
        </div>
    </div>
);