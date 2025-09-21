import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { AuthorCard } from '../components/ui/AuthorCard';
import { ProductCardSkeleton } from '../components/ui/skeletons/ProductCardSkeleton';
import { AuthorCardSkeleton } from '../components/ui/skeletons/AuthorCardSkeleton';
import { SortDropdown } from '../components/ui/SortDropdown';
import { useData } from '../context/DataContext';
import { Product, Author } from '../data/db';

export const SearchPage = () => {
    const { products, authors } = useData();
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    const [results, setResults] = useState<{ foundProducts: Product[]; foundAuthors: Author[] }>({ foundProducts: [], foundAuthors: [] });
    const [loading, setLoading] = useState(false);
    const [sortOption, setSortOption] = useState('default');

    useEffect(() => {
        if (!query) {
            setResults({ foundProducts: [], foundAuthors: [] });
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            const foundProducts = products.filter(p => 
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query) ||
                p.collection.toLowerCase().includes(query)
            );
    
            const foundAuthors = authors.filter(a => 
                a.name.toLowerCase().includes(query) ||
                a.bio.toLowerCase().includes(query)
            );
            
            setResults({ foundProducts, foundAuthors });
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [query, products, authors]);
    
    const sortedProducts = useMemo(() => {
        const sortableProducts = [...results.foundProducts];
        switch (sortOption) {
            case 'newest':
                return sortableProducts.sort((a, b) => parseInt(b.id.slice(1)) - parseInt(a.id.slice(1)));
            case 'price-asc':
                return sortableProducts.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortableProducts.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return results.foundProducts;
        }
    }, [results.foundProducts, sortOption]);

    const hasResults = results.foundProducts.length > 0 || results.foundAuthors.length > 0;

    return (
        <div className="container mx-auto px-6 py-12 fade-in min-h-[60vh]">
            <h1 className="text-center font-sans text-4xl text-brown-gray mb-4">
                Результаты поиска
            </h1>
            <p className="text-center text-lg text-brown-gray mb-12">
                {query ? `По запросу: "${searchParams.get('q')}"` : 'Введите запрос для поиска'}
            </p>

            {loading && (
                <>
                    <section>
                        <h2 className="font-sans text-3xl text-brown-gray mb-8">Поиск товаров...</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                        </div>
                    </section>
                    <section className="mt-24">
                        <h2 className="font-sans text-3xl text-brown-gray mb-8">Поиск авторов...</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                            {Array.from({ length: 3 }).map((_, i) => <AuthorCardSkeleton key={i} />)}
                        </div>
                    </section>
                </>
            )}

            {!loading && query && !hasResults && (
                 <div className="text-center">
                    <p className="text-xl">Ничего не найдено.</p>
                    <Link to="/" className="mt-8 btn btn-primary">
                        Вернуться на главную
                    </Link>
                </div>
            )}
            
            {!loading && results.foundProducts.length > 0 && (
                <section>
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8">
                         <h2 className="font-sans text-3xl text-brown-gray mb-4 sm:mb-0">Найденные товары ({results.foundProducts.length})</h2>
                         <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                    </div>
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {sortedProducts.map(product => <ProductCard key={product.id} product={product} />)}
                    </div>
                </section>
            )}

            {!loading && results.foundAuthors.length > 0 && (
                <section className="mt-24">
                    <h2 className="font-sans text-3xl text-brown-gray mb-8">Найденные авторы ({results.foundAuthors.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                        {results.foundAuthors.map(author => <AuthorCard key={author.id} author={author} />)}
                    </div>
                </section>
            )}
        </div>
    );
};