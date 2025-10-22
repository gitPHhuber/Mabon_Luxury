import React, { useState, useEffect, useMemo, useRef } from 'react';
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

const heroVideos = [
    { 
        src: "https://videos.pexels.com/video-files/3796398/3796398-hd_1920_1080_25fps.mp4",
        poster: "https://images.pexels.com/videos/3796398/pexels-photo-3796398.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    },
    { 
        src: "https://videos.pexels.com/video-files/3015502/3015502-hd_1920_1080_25fps.mp4",
        poster: "https://images.pexels.com/videos/3015502/pexels-photo-3015502.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    },
    { 
        src: "https://videos.pexels.com/video-files/8063940/8063940-hd_1920_1080_30fps.mp4",
        poster: "https://images.pexels.com/videos/8063940/pexels-photo-8063940.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    },
    { 
        src: "https://videos.pexels.com/video-files/8061655/8061655-hd_1920_1080_25fps.mp4",
        poster: "https://images.pexels.com/videos/8061655/pexels-photo-8061655.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
    }
];

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
    const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
    
    const memoizedCollections = useMemo(() => collections, [collections]);

    useEffect(() => {
        const handleScroll = () => {
            setOffsetY(window.pageYOffset);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentVideoIndex(prevIndex => (prevIndex + 1) % heroVideos.length);
        }, 8000); // Switch video every 8 seconds
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const currentVideo = videoRefs.current[currentVideoIndex];
        if (!currentVideo) return;

        currentVideo.currentTime = 0;
        const playPromise = currentVideo.play();

        if (playPromise !== undefined) {
            playPromise.catch(error => {
               
                if (error.name !== 'AbortError') {
                    console.error("Video autoplay failed:", error);
                }
            });
        }

        return () => {
            currentVideo.pause();
        };
    }, [currentVideoIndex]);


    useEffect(() => {
        const timer = setTimeout(() => {
            setHomeData({
                collections: memoizedCollections.slice(0, 3),
                newProducts: [...products].sort((a, b) => parseInt(b.id.replace('p', '')) - parseInt(a.id.replace('p', ''))).slice(0, 16),
                authors: authors.slice(0, 3),
                featuredProducts: products.filter(p => p.isFeatured).slice(0, 4),
            });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [products, authors, memoizedCollections]);
    
    return (
    <>
        <section className="relative h-[65vh] md:h-[80vh] min-h-[450px] md:min-h-[500px] flex items-center justify-center text-white text-center fade-in">
            <div className="absolute inset-0 overflow-hidden">
                 {heroVideos.map((video, index) => (
                     <video
                        key={video.src}
                        ref={el => { videoRefs.current[index] = el }}
                        loop
                        muted
                        playsInline
                        className={`w-full h-full object-cover absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentVideoIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                        poster={video.poster}
                        style={{ transform: `translateY(${offsetY * 0.4}px)` }}
                    >
                        <source src={video.src} type="video/mp4" />
                        Ваш браузер не поддерживает видео тег.
                    </video>
                 ))}
            </div>
            <div className="absolute inset-0 bg-brown-gray opacity-50"></div>
            <div className="relative z-10 p-6 animate-slide-in-up font-sans">
                <h1 className="text-4xl md:text-7xl font-bold tracking-wider">Гармония Наследия и Инноваций</h1>
                <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg">Фарфор, который превращает повседневность в искусство.</p>
                <Link to="/collections" className="mt-8 btn btn-inverted">
                    Изучить коллекции
                </Link>
            </div>
        </section>

        <AnimatedSection className="py-24">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid gap-x-8 lg:gap-x-10 gap-y-10 grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:[grid-template-columns:repeat(16,minmax(0,1fr))]">
                    <aside className="xl:col-span-4 lg:col-span-3 md:col-span-8 col-span-4 xl:sticky xl:top-28 self-start">
                        <h2 className="font-sans text-4xl text-brown-gray leading-tight">Избранные коллекции</h2>
                    </aside>
                    <main className="xl:col-span-12 lg:col-span-9 md:col-span-8 col-span-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {loading ? (
                                Array.from({ length: 3 }).map((_, i) => <CollectionCardSkeleton key={i} />)
                            ) : (
                                homeData.collections.map((c) => <CollectionCard key={c.name} collection={c} />)
                            )}
                        </div>
                    </main>
                </div>
            </div>
        </AnimatedSection>
        
        {(loading || homeData.featuredProducts.length > 0) && (
            <AnimatedSection className="py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                     <div className="grid gap-x-8 lg:gap-x-10 gap-y-10 grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:[grid-template-columns:repeat(16,minmax(0,1fr))]">
                        <main className="xl:col-span-12 lg:col-span-9 md:col-span-8 col-span-4">
                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {loading ? (
                                    Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
                                ) : (
                                    homeData.featuredProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)
                                )}
                            </div>
                        </main>
                        <aside className="xl:col-span-4 xl:[grid-column-start:13] lg:col-span-3 lg:[grid-column-start:10] md:col-span-8 col-span-4 xl:sticky xl:top-28 self-start">
                            <h2 className="font-sans text-4xl text-brown-gray leading-tight">Рекомендованные товары</h2>
                             <p className="mt-4 text-lg">Отобранные вручную шедевры, олицетворяющие суть мастерства и элегантности Mabon.</p>
                        </aside>
                    </div>
                </div>
            </AnimatedSection>
         )}

        <AnimatedSection className="py-24 bg-cream overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-center font-sans text-4xl text-brown-gray mb-12">Новинки</h2>
            </div>
            {loading ? (
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 opacity-50">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                </div>
            ) : (
                <InfiniteProductCarousel products={homeData.newProducts} />
            )}
        </AnimatedSection>

        <AnimatedSection className="py-24">
             <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                 <div className="grid gap-x-8 lg:gap-x-10 gap-y-10 grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:[grid-template-columns:repeat(16,minmax(0,1fr))]">
                    <aside className="xl:col-span-4 lg:col-span-3 md:col-span-8 col-span-4 xl:sticky xl:top-28 self-start">
                        <h2 className="font-sans text-4xl text-brown-gray leading-tight">Наши мастера</h2>
                    </aside>
                    <main className="xl:col-span-12 lg:col-span-9 md:col-span-8 col-span-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {loading ? (
                            Array.from({ length: 3 }).map((_, i) => <AuthorCardSkeleton key={i} />)
                        ) : (
                            homeData.authors.map((author: Author) => <AuthorCard key={author.id} author={author} />)
                        )}
                        </div>
                    </main>
                </div>
            </div>
        </AnimatedSection>
    </>
    );
};