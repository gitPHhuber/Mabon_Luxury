import React, { useState, useRef, useEffect } from 'react';
import { Skeleton } from './skeletons/Skeleton';
import { getOptimizedImageUrl } from '../../utils/imageOptimizer';

interface ImageZoomProps {
    src: string;
    alt: string;
    className?: string;
}

export const ImageZoom = ({ src, alt, className = '' }: ImageZoomProps) => {
    const [zoom, setZoom] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const [isLoading, setIsLoading] = useState(true);
    const optimizedSrc = getOptimizedImageUrl(src);

    useEffect(() => {
        setIsLoading(true);
    }, [src]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            const x = ((e.clientX - left) / width) * 100;
            const y = ((e.clientY - top) / height) * 100;
            setMousePosition({ x, y });
        }
    };

    const handleMouseEnter = () => {
        if (!isLoading) {
            setZoom(true);
        }
    };

    const handleMouseLeave = () => {
        setZoom(false);
    };

    return (
        <div
            ref={containerRef}
            className={`relative overflow-hidden ${isLoading ? 'cursor-wait' : (zoom ? 'cursor-zoom-out' : 'cursor-zoom-in')} ${className}`}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="img"
            aria-label={`${alt} - zoomable image`}
        >
            {isLoading && <Skeleton className="absolute inset-0 w-full h-full" />}
            <img
                src={optimizedSrc}
                alt={alt}
                loading="lazy"
                className={`w-full h-full object-cover transition-all duration-300 ease-out ${isLoading ? 'opacity-0' : 'opacity-100'}`}
                style={{
                    transformOrigin: `${mousePosition.x}% ${mousePosition.y}%`,
                    transform: zoom ? 'scale(2)' : 'scale(1)',
                }}
                onLoad={() => setIsLoading(false)}
                onError={() => setIsLoading(false)}
            />
        </div>
    );
};