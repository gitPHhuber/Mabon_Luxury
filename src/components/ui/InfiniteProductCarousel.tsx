import React, { useState, useRef, useMemo, useLayoutEffect } from 'react';
import { Product } from '../../data/db';
import { ProductCard } from './ProductCard';

export const InfiniteProductCarousel = ({ products }: { products: Product[] }) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [itemsVisible, setItemsVisible] = useState(1);
  const [animationDuration, setAnimationDuration] = useState('30s');

  const carouselRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);


  useLayoutEffect(() => {
    const wrap = carouselRef.current;
    const list = listRef.current;
    if (!wrap || !list) return;

    const ro = new ResizeObserver(() => {
      const wrapW = wrap.getBoundingClientRect().width || 1;
      const first = list.querySelector('li') as HTMLElement | null;
      const itemW = first?.getBoundingClientRect().width || wrapW;
      setItemsVisible(Math.max(1, Math.floor(wrapW / itemW)));

  
      requestAnimationFrame(() => {
        const distance = (list.scrollWidth || 1) / 2;
        const pxPerSec = 120; // scroll speed in pixels per second
        setAnimationDuration(`${distance / pxPerSec}s`);
      });
    });

    ro.observe(wrap);
    ro.observe(list);
    return () => ro.disconnect();
  }, [products]);

  
  const displayProducts = useMemo(() => {
    if (!products?.length || !itemsVisible) return [];
    let buf = products.slice();
 
    while (buf.length > 0 && buf.length < itemsVisible * 2) {
      buf = buf.concat(products);
    }

    return buf.concat(buf);
  }, [products, itemsVisible]);

  if (!displayProducts.length) return null;

  return (
    <div
      ref={carouselRef}
      role="region"
      aria-roledescription="carousel"
      aria-label="Product Carousel"
      className="relative w-full overflow-hidden"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
      onTouchStart={() => setIsInteracting(true)}
      onTouchEnd={() => setIsInteracting(false)}
    >
      <ul
        ref={listRef}
        className="flex whitespace-nowrap animate-continuous-scroll"
        style={{
          animationDuration,
          animationPlayState: isInteracting ? 'paused' : 'running',
        }}
      >
        {displayProducts.map((p, i) => (
          <li
            key={`${p.id}-${i}`}
            className="flex-shrink-0 px-4 basis-[240px] sm:basis-[280px] md:basis-[320px] lg:basis-[360px]"
            role="listitem"
          >
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </div>
  );
};
