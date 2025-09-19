interface ImageOptimizationOptions {
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
    width?: number;
    height?: number;
}

/**
 * 
 * 
 * 
 * @param src 
 * @param options 
 * @returns 
 */
export const getOptimizedImageUrl = (src: string, options: ImageOptimizationOptions = {}): string => {
    
    
    return src;
};
