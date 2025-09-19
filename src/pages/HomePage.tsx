import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AnimatedSection } from '../components/AnimatedSection';
import { CollectionCard } from '../components/ui/CollectionCard';
import { AuthorCard } from '../components/ui/AuthorCard';
import { InfiniteProductCarousel } from '../components/ui/InfiniteProductCarousel';
import { ProductCardSkeleton } from '../components/ui/skeletons/ProductCardSkeleton';
import { AuthorCardSkeleton } from '../components/ui/skeletons/AuthorCardSkeleton';
import { CollectionCardSkeleton } from '../components/ui/skeletons/CollectionCardSkeleton';
import { useData } from '../context/DataContext';
import { Product, Author } from '../data/db';
import { ProductCard } from '../components/ui/ProductCard';

export const HomePage = () => {
    const { products, authors, collections } = useData();
    const [loading, setLoading] = useState(true);
    const [homeData, setHomeData] = useState<{
        collections: { name: string; imageUrl: string }[];
        newProducts: Product[];
        authors: Author[];
        featuredProducts: Product[];
    }>({
        collections: [],
        newProducts: [],
        authors: [],
        featuredProducts: [],
    });
    const [offsetY, setOffsetY] = useState(0);
    
    const memoizedCollections = useMemo(() => collections, [collections]);

    useEffect(() => {
        const handleScroll = () => {
            setOffsetY(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            setHomeData({
                collections: memoizedCollections.slice(0, 3),
                newProducts: [...products].sort((a, b) => parseInt(b.id.replace('p', '')) - parseInt(a.id.replace('p', ''))).slice(0, 8),
                authors: authors.slice(0, 3),
                featuredProducts: products.filter(p => p.isFeatured).slice(0, 4),
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [products, authors, memoizedCollections]);
    
    return (
    <>
        <section className="relative h-[80vh] min-h-[500px] flex items-center justify-center text-white text-center fade-in">
            <div className="absolute inset-0 overflow-hidden">
                 <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1617991504905-f379101d24a1?q=80&w=1800&fit=crop"
                    src="https://videos.pexels.com/video-files/5771899/5771899-hd_1920_1080_25fps.mp4"
                    style={{ transform: `translateY(${offsetY * 0.4}px)` }}
                >
                    Ваш браузер не поддерживает видео тег.
                </video>
            </div>
            <div className="absolute inset-0 bg-brown-gray opacity-50"></div>
            <div className="relative z-10 p-6 animate-slide-in-up font-sans">
                <h1 className="text-5xl md:text-7xl font-bold tracking-wider">Гармония Наследия и Инноваций</h1>
                <p className="mt-4 max-w-2xl mx-auto text-lg">Фарфор, который превращает повседневность в искусство.</p>
                <Link to="/collections" className="mt-8 btn btn-inverted">
                    Изучить коллекции
                </Link>
            </div>
        </section>

        <AnimatedSection className="py-24">
            <div className="container mx-auto px-6">
                <h2 className="text-center font-sans text-4xl text-brown-gray">Избранные коллекции</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {loading ? (
                         Array.from({ length: 3 }).map((_, i) => <CollectionCardSkeleton key={i} />)
                    ) : (
                        homeData.collections.map(c => <CollectionCard key={c.name} collection={c} />)
                    )}
                </div>
            </div>
        </AnimatedSection>
        
        {(loading || homeData.featuredProducts.length > 0) && (
            <AnimatedSection className="py-24">
                <div className="container mx-auto px-6">
                    <h2 className="text-center font-sans text-4xl text-brown-gray">Рекомендованные товары</h2>
                    <p className="text-center mt-2 max-w-2xl mx-auto text-lg">Отобранные вручную шедевры, олицетворяющие суть мастерства и элегантности Mabon.</p>
                    <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        ) : (
                            homeData.featuredProducts.map(product => <ProductCard key={product.id} product={product} />)
                        )}
                    </div>
                </div>
            </AnimatedSection>
         )}

        <AnimatedSection className="py-24 bg-cream">
             <h2 className="text-center font-sans text-4xl text-brown-gray mb-12">Новинки</h2>
             {loading ? (
                <div className="group w-full overflow-hidden">
                    <div className="flex justify-center">
                        <div className="w-full max-w-7xl px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                           {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    </div>
                </div>
             ) : (
                <InfiniteProductCarousel products={homeData.newProducts} />
             )}
        </AnimatedSection>

        <AnimatedSection className="py-24">
             <div className="container mx-auto px-6">
                <h2 className="text-center font-sans text-4xl text-brown-gray">Наши мастера</h2>
                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-12">
                   {loading ? (
                       Array.from({ length: 3 }).map((_, i) => <AuthorCardSkeleton key={i} />)
                   ) : (
                       homeData.authors.map(author => <AuthorCard key={author.id} author={author} />)
                   )}
                </div>
            </div>
        </AnimatedSection>
    </>
    );
};