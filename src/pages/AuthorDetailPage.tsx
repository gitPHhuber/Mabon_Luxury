import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/skeletons/ProductCardSkeleton';
import { Skeleton } from '../components/ui/skeletons/Skeleton';
import { useData } from '../context/DataContext';
import { Author, Product } from '../data/db';
import { ImageWithLoader } from '../components/ui/ImageWithLoader';
import { TruncatedText } from '../components/ui/TruncatedText';

export const AuthorDetailPage = () => {
    const { id } = useParams<{ id: string }>();
    const { getAuthorById, getProductsByAuthorId } = useData();
    const [author, setAuthor] = useState<Author | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => {
            const foundAuthor = getAuthorById(id || '') || null;
            const authorProducts = getProductsByAuthorId(id || '');
            setAuthor(foundAuthor);
            setProducts(authorProducts);
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [id, getAuthorById, getProductsByAuthorId]);

    if (loading) {
        return (
            <div className="container mx-auto px-6 py-12 fade-in">
                <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-12">
                    <Skeleton className="w-48 h-48 rounded-full flex-shrink-0"/>
                    <div className="space-y-4 flex-grow">
                        <Skeleton className="h-12 w-3/4" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-5/6" />
                    </div>
                </div>
                <h2 className="font-sans text-3xl text-brown-gray mt-24 mb-8"><Skeleton className="h-9 w-1/3" /></h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                </div>
            </div>
        );
    }
    
    if (!author) return <div className="container mx-auto text-center py-24">Автор не найден.</div>;

    return (
        <div className="container mx-auto px-6 py-12 fade-in">
            <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-12">
                <ImageWithLoader 
                    src={author.imageUrl} 
                    alt={author.name} 
                    className="w-48 h-48 rounded-full flex-shrink-0 overflow-hidden bg-gray-200"
                    imageClassName="w-full h-full object-cover"
                />
                <div>
                    <h1 className="font-sans text-5xl text-brown-gray">{author.name}</h1>
                    <TruncatedText text={author.bio} maxLength={250} className="mt-4 max-w-2xl text-lg font-serif" />
                </div>
            </div>
            <h2 className="font-sans text-3xl text-brown-gray mt-24 mb-8">Работы {author.name}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
        </div>
    );
};