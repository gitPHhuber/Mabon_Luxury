import React from 'react';
import { Skeleton } from './Skeleton';

export const CollectionCardSkeleton = () => (
    <div className="group relative block aspect-square overflow-hidden">
        <Skeleton className="w-full h-full" />
    </div>
);