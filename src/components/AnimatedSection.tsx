import React from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';


export const AnimatedSection = ({ children, className = '' }: React.PropsWithChildren<{ className?: string }>) => {
    const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    return (
        <div
            ref={ref as React.Ref<HTMLDivElement>}
            className={`${className} opacity-0 ${isVisible ? 'fade-in-up' : ''}`}
        >
            {children}
        </div>
    );
};