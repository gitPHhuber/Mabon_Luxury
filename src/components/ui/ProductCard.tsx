import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../data/db';
import { useWishlist } from '../../context/WishlistContext';
import { useQuickView } from '../../context/QuickViewContext';
import { ImageWithLoader } from './ImageWithLoader';
import { useCart } from '../../context/CartContext';
import { useData } from '../../context/DataContext';

export const ProductCard = ({ product }: { product: Product }) => {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const { openQuickView } = useQuickView();
    const { addToCart } = useCart();
    const { getAuthorById } = useData();
    const author = getAuthorById(product.authorId);
    const isWishlisted = isInWishlist(product.id);

    const handleWishlistToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product.id);
        }
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        openQuickView(product);
    };
    
    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(product);
    };
    
    return (
        <div className="group transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2">
            <Link to={`/products/${product.id}`} className="block">
                <div className="relative aspect-[3/4] overflow-hidden bg-cream">
                    <ImageWithLoader 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full"
                        imageClassName="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute top-3 right-3 z-10 flex flex-col items-center space-y-2">
                        <button
                            onClick={handleQuickView}
                            className="p-2 rounded-full text-white bg-brown-gray/30 hover:bg-brown-gray/50 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-100"
                            aria-label="Быстрый просмотр"
                        >
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleAddToCart}
                            className="p-2 rounded-full text-white bg-brown-gray/30 hover:bg-brown-gray/50 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-100"
                            aria-label="Добавить в корзину"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                        </button>
                        <button
                            onClick={handleWishlistToggle}
                            className={`p-2 rounded-full transition-all duration-300 ${isWishlisted ? 'text-red-500 bg-white/80 scale-110' : 'text-white bg-brown-gray/30 hover:bg-brown-gray/50 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-100'}`}
                            aria-label={isWishlisted ? 'Удалить из избранного' : 'Добавить в избранное'}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isWishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={isWishlisted ? 0 : 2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.664l1.318-1.346a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="mt-4 text-center font-sans">
                    <h3 className="text-lg text-brown-gray">{product.name}</h3>
                    <p className="mt-1 text-sm text-brown-gray">{author?.name}</p>
                    <p className="mt-2 font-bold text-brown-gray">{product.price.toLocaleString('ru-RU')} ₽</p>
                </div>
            </Link>
        </div>
    );
};