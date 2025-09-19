import React from 'react';
import { Skeleton } from './Skeleton';

export const AuthorCardSkeleton = () => (
    <div className="text-center">
        <Skeleton className="aspect-square rounded-full mx-auto w-32 h-32 md:w-48 md:h-48" />
        <Skeleton className="mt-4 h-6 w-3/4 mx-auto" />
    </div>
);