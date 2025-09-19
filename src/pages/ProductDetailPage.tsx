import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useData } from '../context/DataContext';
import { Product, Author } from '../data/db';
import { ProductDetailSkeleton } from '../components/ui/skeletons/ProductDetailSkeleton';
import { ImageZoom } from '../components/ui/ImageZoom';
import { ImageWithLoader } from '../components/ui/ImageWithLoader';
import { InfiniteProductCarousel } from '../components/ui/InfiniteProductCarousel';
import { ReviewsSection } from '../components/ui/reviews/ReviewsSection';

export const ProductDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { addToCart } = useCart();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { products, getProductById, getAuthorById } = useData();
    
    const [product, setProduct] = useState<Product | null>(null);
    const [author, setAuthor] = useState<Author | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [gallery, setGallery] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(false);
    
    const mainImage = gallery[currentIndex];

    useEffect(() => {
        setLoading(true);
        window.scrollTo(0, 0);
        const timer = setTimeout(() => {
            const foundProduct = getProductById(id || '') || null;
            const foundAuthor = foundProduct ? getAuthorById(foundProduct.authorId) : null;
            setProduct(foundProduct);
            setAuthor(foundAuthor || null);

            if (foundProduct) {
                const cleanGallery = [...new Set([foundProduct.imageUrl, ...foundProduct.gallery])];
                setGallery(cleanGallery);
                const initialIndex = cleanGallery.findIndex(img => img === foundProduct.imageUrl);
                setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);

                const relatedByCollection = products.filter(
                    p => p.collection === foundProduct.collection && p.id !== foundProduct.id
                );
                const relatedByAuthor = products.filter(
                    p => p.authorId === foundProduct.authorId && p.id !== foundProduct.id
                );
        
                const combinedRelated = [...relatedByCollection, ...relatedByAuthor];
                const uniqueRelatedProducts = Array.from(new Map(combinedRelated.map(p => [p.id, p])).values());
        
                setRelatedProducts(uniqueRelatedProducts);
            } else {
                setRelatedProducts([]);
                setGallery([]);
            }

            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [id, getProductById, getAuthorById, products]);

    const changeImage = (newIndex: number) => {
        if (newIndex === currentIndex || isTransitioning) return;
        
        setIsTransitioning(true); 
        setTimeout(() => {
            setCurrentIndex(newIndex); 
            setIsTransitioning(false); 
        }, 200); 
    };

    const handleNext = () => {
        const newIndex = (currentIndex + 1) % gallery.length;
        changeImage(newIndex);
    };

    const handlePrev = () => {
        const newIndex = (currentIndex - 1 + gallery.length) % gallery.length;
        changeImage(newIndex);
    };

    const handleWishlistToggle = () => {
        if (!product) return;
        if (isInWishlist(product.id)) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };

    if (loading) {
        return <ProductDetailSkeleton />;
    }

    if (!product) return <div className="container mx-auto text-center py-24">Товар не найден.</div>;

    return (
        <>
            <div className="container mx-auto px-6 pt-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                        <div className="relative group">
                            <div className={`transition-opacity duration-200 ease-in-out ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                                {mainImage && (
                                    <ImageZoom 
                                        src={mainImage} 
                                        alt={product.name}
                                        className="aspect-square bg-cream mb-4"
                                    />
                                )}
                            </div>
                            {gallery.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        aria-label="Previous image"
                                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 text-brown-gray hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        aria-label="Next image"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white/50 text-brown-gray hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="flex space-x-2">
                            {gallery.map((imgUrl, index) => (
                                 <button key={index} onClick={() => changeImage(index)} className={`w-24 h-24 bg-cream p-1 transition-all ${currentIndex === index ? 'ring-2 ring-brown-gray' : 'opacity-60 hover:opacity-100'}`}>
                                    <ImageWithLoader src={imgUrl} alt={`${product.name} thumbnail ${index + 1}`} className="w-full h-full" imageClassName="w-full h-full object-cover" />
                                 </button>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h1 className="font-sans text-4xl text-brown-gray">{product.name}</h1>
                        {author && <p className="mt-2 text-lg font-sans"><Link to={`/authors/${author.id}`} className="hover:underline">{author.name}</Link></p>}
                        <p className="mt-4 font-sans text-2xl font-bold text-brown-gray">{product.price.toLocaleString('ru-RU')} ₽</p>
                        <p className="mt-6 text-base leading-relaxed font-serif">{product.description}</p>
                        <div className="flex items-center space-x-4 mt-8">
                            <button 
                                onClick={() => addToCart(product)}
                                className="btn btn-primary w-full md:w-auto">
                                Добавить в корзину
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className={`p-3 border rounded-sm transition-all duration-300 ${isInWishlist(product.id) ? 'border-red-500 text-red-500 bg-red-50' : 'border-brown-gray text-brown-gray hover:bg-cream hover:-translate-y-px'}`}
                                aria-label={isInWishlist(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isInWishlist(product.id) ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.664l1.318-1.346a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <ReviewsSection productId={product.id} />
            
            {relatedProducts.length > 0 && (
                <div className="mt-24 pb-12">
                    <h2 className="text-center font-sans text-4xl text-brown-gray mb-12">Вам также может понравиться</h2>
                    <InfiniteProductCarousel products={relatedProducts} />
                </div>
            )}
        </>
    );
};