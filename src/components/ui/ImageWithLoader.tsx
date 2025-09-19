import React, { useState } from 'react';
import { Skeleton } from './skeletons/Skeleton';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface ImageWithLoaderProps {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
}

export const ImageWithLoader = ({ src, alt, className = '', imageClassName = '' }: ImageWithLoaderProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const optimizedSrc = getOptimizedImageUrl(src);

    return (
        <div className={`relative ${className}`}>
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            <img
                src={optimizedSrc}
                alt={alt}
                loading="lazy"
                className={`transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'} ${imageClassName}`}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
};