interface ImageOptimizationOptions {
    quality?: number;
    format?: 'webp' | 'avif' | 'jpeg';
    width?: number;
    height?: number;
}

export const getOptimizedImageUrl = (src: string, options: ImageOptimizationOptions = {}): string => {
    return src;
};
