import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/ui/ProductCard';

export const WishlistPage = () => {
    const { wishlistedProducts } = useWishlist();

    return (
        <div className="container mx-auto px-6 py-12 fade-in min-h-[60vh]">
            <h1 className="text-center font-sans text-5xl text-brown-gray mb-12">Избранное</h1>
            
            {wishlistedProducts.length === 0 ? (
                <div className="text-center">
                    <p className="text-xl">Ваш список избранного пуст.</p>
                    <p className="mt-2">Добавьте товары, которые вам понравились, чтобы не потерять их.</p>
                    <Link to="/collections" className="mt-8 btn btn-primary">
                        Перейти в каталог
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {wishlistedProducts.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};