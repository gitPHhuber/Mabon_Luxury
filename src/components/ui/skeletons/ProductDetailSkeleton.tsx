import React from 'react';
import { Skeleton } from './Skeleton';

export const ProductDetailSkeleton = () => (
    <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <Skeleton className="aspect-square w-full mb-4" />
                <div className="flex space-x-2">
                    <Skeleton className="w-24 h-24" />
                    <Skeleton className="w-24 h-24" />
                    <Skeleton className="w-24 h-24" />
                </div>
            </div>
            <div className="space-y-4 pt-2">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-8 w-1/4" />
                <div className="pt-4 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-5/6" />
                </div>
                <div className="pt-4">
                    <Skeleton className="h-12 w-1/2" />
                </div>
            </div>
        </div>
    </div>
);