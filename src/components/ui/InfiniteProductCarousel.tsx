import React, { useState, useRef, useMemo, useLayoutEffect, useEffect } from 'react';
import { Product } from '../../data/db';
import { ProductCard } from './ProductCard';

const ChevronLeftIcon = () => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
);

const ChevronRightIcon = () => (
    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
);

export const InfiniteProductCarousel = ({ products }: { products: Product[] }) => {

    const [currentIndex, setCurrentIndex] = useState(0);
    const [itemWidth, setItemWidth] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [startX, setStartX] = useState(0);
    const [drag, setDrag] = useState(0);

    const [isInteracting, setIsInteracting] = useState(false);


    const [liveRegionText, setLiveRegionText] = useState('');


    const [itemsVisible, setItemsVisible] = useState(4);
    const carouselRef = useRef<HTMLDivElement>(null);
    const carouselInnerRef = useRef<HTMLDivElement>(null);
    const carouselInnerId = useMemo(() => `carousel-inner-${Math.random().toString(36).substr(2, 9)}`, []);

    const isContinuousScroll = useMemo(() => itemsVisible <= 1, [itemsVisible]);

    useLayoutEffect(() => {
        const carouselElement = carouselRef.current;
        if (!carouselElement) return;

        const observer = new ResizeObserver(entries => {
            const [entry] = entries;
            if (!entry) return;
            
            const containerWidth = entry.contentRect.width;
            const firstItem = carouselInnerRef.current?.firstChild as HTMLElement | null;

            if (firstItem && firstItem.offsetWidth > 0) {
                const newItemWidth = firstItem.offsetWidth;
                setItemWidth(newItemWidth);
                setItemsVisible(Math.max(1, Math.floor(containerWidth / newItemWidth)));
            }
        });

        observer.observe(carouselElement);
        return () => observer.disconnect();
    }, [products]);

    useEffect(() => {
        if (!isContinuousScroll && products.length > 0) {
            const start = currentIndex + 1;
            const end = Math.min(currentIndex + itemsVisible, products.length);
            setLiveRegionText(`Showing products ${start} to ${end} of ${products.length}`);
        }
    }, [currentIndex, itemsVisible, products.length, isContinuousScroll]);


    const maxScrollIndex = useMemo(() => Math.max(0, products.length - itemsVisible), [products.length, itemsVisible]);
    const canGoPrev = currentIndex > 0;
    const canGoNext = currentIndex < maxScrollIndex;

    const handlePrev = () => {
        const newIndex = Math.max(0, currentIndex - itemsVisible);
        setCurrentIndex(newIndex);
    };

    const handleNext = () => {
        const newIndex = Math.min(currentIndex + itemsVisible, maxScrollIndex);
        setCurrentIndex(newIndex);
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        setIsDragging(true);
        setStartX(e.touches[0].clientX);
        setDrag(0);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isDragging) return;
        const currentX = e.touches[0].clientX;
        setDrag(currentX - startX);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);
        const threshold = itemWidth / 4;
        if (drag > threshold && canGoPrev) {
            setCurrentIndex(currentIndex - 1);
        } else if (drag < -threshold && canGoNext) {
            setCurrentIndex(currentIndex + 1);
        }
        setDrag(0);
    };

    const displayProducts = isContinuousScroll ? [...products, ...products] : products;
    const animationDuration = isContinuousScroll ? `${products.length * 5}s` : '0s'; // 5s per item for a smoother scroll

    return (
        <div 
            ref={carouselRef} 
            role="region"
            aria-roledescription="carousel"
            aria-label="Product Carousel"
            className="relative group w-full overflow-hidden mask-gradient"
            onMouseEnter={isContinuousScroll ? () => setIsInteracting(true) : undefined}
            onMouseLeave={isContinuousScroll ? () => setIsInteracting(false) : undefined}
        >
            {!isContinuousScroll && (
                <div aria-live="polite" aria-atomic="true" className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]">
                    {liveRegionText}
                </div>
            )}
            <div
                id={carouselInnerId}
                ref={carouselInnerRef}
                className={`flex ${isContinuousScroll ? 'animate-continuous-scroll' : ''}`}
                style={isContinuousScroll ? {
                    animationDuration,
                    animationPlayState: isInteracting ? 'paused' : 'running',
                } : {
                    transform: `translateX(calc(-${currentIndex * itemWidth}px + ${drag}px))`,
                    transition: isDragging ? 'none' : 'transform 500ms ease-in-out',
                }}
                onTouchStart={isContinuousScroll ? () => setIsInteracting(true) : handleTouchStart}
                onTouchMove={!isContinuousScroll ? handleTouchMove : undefined}
                onTouchEnd={isContinuousScroll ? () => setIsInteracting(false) : handleTouchEnd}
            >
                {displayProducts.map((product, index) => (
                    <div key={`${product.id}-${index}`} className="flex-shrink-0 w-3/4 sm:w-1/2 md:w-1/3 lg:w-1/4 px-4">
                       <ProductCard product={product} />
                    </div>
                ))}
            </div>
            
            {/* Navigation Buttons for Desktop */}
            {!isContinuousScroll && (
                <>
                    <button
                        onClick={handlePrev}
                        disabled={!canGoPrev}
                        aria-label="Previous products"
                        aria-controls={carouselInnerId}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/80 text-brown-gray hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-100"
                    >
                        <ChevronLeftIcon />
                    </button>
                    <button
                        onClick={handleNext}
                        disabled={!canGoNext}
                        aria-label="Next products"
                        aria-controls={carouselInnerId}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-4 rounded-full bg-white/80 text-brown-gray hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-100"
                    >
                        <ChevronRightIcon />
                    </button>
                </>
            )}
        </div>
    );
};
