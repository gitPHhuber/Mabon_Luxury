import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Product } from '../../data/db';
import { ProductCard } from './ProductCard';

const ChevronLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
);

export const InfiniteProductCarousel = ({ products }: { products: Product[] }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const [itemsVisible, setItemsVisible] = useState(4);
    const carouselRef = useRef<HTMLDivElement>(null);
    const carouselInnerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const carouselElement = carouselRef.current;
        if (!carouselElement) return;

        const observer = new ResizeObserver(entries => {
            const [entry] = entries;
            if (!entry) return;
            
            const containerWidth = entry.contentRect.width;
            const firstItem = carouselInnerRef.current?.firstChild as HTMLElement;

            if (firstItem) {
                const newItemWidth = firstItem.offsetWidth;
                setItemWidth(newItemWidth);
                setItemsVisible(Math.max(1, Math.round(containerWidth / newItemWidth)));
            }
        });

        observer.observe(carouselElement);
        return () => observer.disconnect();
    }, [products]);

    const canGoPrev = currentIndex > 0;
    const canGoNext = useMemo(() => {
        if (!products || products.length === 0 || itemWidth === 0) return false;
        return currentIndex < products.length - itemsVisible;
    }, [currentIndex, products.length, itemsVisible, itemWidth]);

    const handlePrev = () => {
        setCurrentIndex(prevIndex => Math.max(0, prevIndex - 1));
    };

    const handleNext = () => {
        setCurrentIndex(prevIndex => Math.min(prevIndex + 1, products.length - itemsVisible));
    };

    return (
        <div ref={carouselRef} className="relative group w-full overflow-hidden mask-gradient">
            <div
                ref={carouselInnerRef}
                className="flex"
                style={{
                    transform: `translateX(-${currentIndex * itemWidth}px)`,
                    transition: 'transform 500ms ease-in-out',
                }}
            >
                {products.map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 px-4">
                       <ProductCard product={product} />
                    </div>
                ))}
            </div>
            
            {/* Navigation Buttons */}
            <button
                onClick={handlePrev}
                disabled={!canGoPrev}
                aria-label="Previous products"
                className="absolute left-0 sm:left-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 text-brown-gray hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronLeftIcon />
            </button>
            <button
                onClick={handleNext}
                disabled={!canGoNext}
                aria-label="Next products"
                className="absolute right-0 sm:right-2 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/60 text-brown-gray hover:bg-white transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
                <ChevronRightIcon />
            </button>
        </div>
    );
};