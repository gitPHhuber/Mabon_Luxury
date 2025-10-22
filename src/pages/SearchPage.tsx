import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
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
    const navigate = useNavigate();
    const query = searchParams.get('q')?.toLowerCase() || '';
    
    const [results, setResults] = useState<{ foundProducts: Product[]; foundAuthors: Author[] }>({ foundProducts: [], foundAuthors: [] });
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('default');
    const [activeTab, setActiveTab] = useState<'all' | 'products' | 'authors'>('all');
    const [localQuery, setLocalQuery] = useState(searchParams.get('q') || '');

    useEffect(() => {
        setLocalQuery(searchParams.get('q') || '');
        if (!query) {
            setResults({ foundProducts: [], foundAuthors: [] });
            setLoading(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(() => {
            const scoredProducts = products
                .map(product => {
                    const name = product.name.toLowerCase();
                    const description = product.description.toLowerCase();
                    const collection = product.collection.toLowerCase();
                    let score = 0;

                    if (name.startsWith(query)) score += 10;
                    else if (name.includes(query)) score += 5;
                    
                    if (collection.includes(query)) score += 2;
                    if (description.includes(query)) score += 1;

                    return { product, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.product);

            const scoredAuthors = authors
                .map(author => {
                    const name = author.name.toLowerCase();
                    const bio = author.bio.toLowerCase();
                    let score = 0;

                    if (name.startsWith(query)) score += 10;
                    else if (name.includes(query)) score += 5;
                    
                    if (bio.includes(query)) score += 1;

                    return { author, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.author);
            
            setResults({ foundProducts: scoredProducts, foundAuthors: scoredAuthors });
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, [query, products, authors, searchParams]);
    
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

    const handleNewSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (localQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(localQuery.trim())}`);
        }
    }

    const hasResults = results.foundProducts.length > 0 || results.foundAuthors.length > 0;
    
    const tabClasses = "px-4 py-2 text-lg transition-colors duration-200";
    const activeTabClasses = "font-bold border-b-2 border-brown-gray text-brown-gray";
    const inactiveTabClasses = "text-brown-gray/60 hover:text-brown-gray";

    return (
        <div className="container mx-auto px-6 py-12 fade-in min-h-[60vh]">
            <h1 className="text-center font-sans text-4xl text-brown-gray mb-4">
                Поиск по сайту
            </h1>
            
            {!query && !loading && (
                 <div className="text-center py-16">
                     <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brown-gray/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <h2 className="mt-4 text-2xl font-semibold text-brown-gray">Что вы хотите найти?</h2>
                    <form onSubmit={handleNewSearch} className="mt-8 max-w-lg mx-auto">
                        <div className="relative">
                            <input 
                                type="search" 
                                value={localQuery} 
                                onChange={(e) => setLocalQuery(e.target.value)} 
                                placeholder="Введите ваш запрос..."
                                className="w-full py-3 px-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-gray focus:border-transparent transition-all"
                            />
                            <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 btn-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                            </button>
                        </div>
                    </form>
                 </div>
            )}
            
            {query && (
                <>
                    <p className="text-center text-lg text-brown-gray mb-12">
                        Результаты по запросу: <span className="font-bold">"{searchParams.get('q')}"</span>
                    </p>

                    {loading && (
                        <>
                            <section>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                    {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                                </div>
                            </section>
                            <section className="mt-24">
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                                    {Array.from({ length: 3 }).map((_, i) => <AuthorCardSkeleton key={i} />)}
                                </div>
                            </section>
                        </>
                    )}

                    {!loading && !hasResults && (
                        <div className="text-center py-16">
                             <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-brown-gray/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h2 className="mt-4 text-2xl font-semibold text-brown-gray">Ничего не найдено</h2>
                            <p className="mt-2 text-brown-gray/80">К сожалению, по вашему запросу ничего не найдено. Попробуйте изменить его.</p>
                            <form onSubmit={handleNewSearch} className="mt-8 max-w-lg mx-auto">
                                <div className="relative">
                                    <input 
                                        type="search" 
                                        value={localQuery} 
                                        onChange={(e) => setLocalQuery(e.target.value)} 
                                        className="w-full py-3 px-5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brown-gray focus:border-transparent transition-all"
                                    />
                                    <button type="submit" className="absolute top-1/2 right-3 -translate-y-1/2 btn-icon">
                                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {!loading && hasResults && (
                        <>
                            <div className="flex justify-center border-b mb-8 font-sans">
                                <button onClick={() => setActiveTab('all')} className={`${tabClasses} ${activeTab === 'all' ? activeTabClasses : inactiveTabClasses}`}>
                                    Все ({results.foundProducts.length + results.foundAuthors.length})
                                </button>
                                <button onClick={() => setActiveTab('products')} className={`${tabClasses} ${activeTab === 'products' ? activeTabClasses : inactiveTabClasses}`}>
                                    Товары ({results.foundProducts.length})
                                </button>
                                <button onClick={() => setActiveTab('authors')} className={`${tabClasses} ${activeTab === 'authors' ? activeTabClasses : inactiveTabClasses}`}>
                                    Авторы ({results.foundAuthors.length})
                                </button>
                            </div>
                            
                            {(activeTab === 'all' || activeTab === 'products') && results.foundProducts.length > 0 && (
                                <section>
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="font-sans text-3xl text-brown-gray">
                                            {activeTab === 'all' ? 'Найденные товары' : 'Товары'}
                                        </h2>
                                        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                        {/* FIX: Add explicit type to map callback parameter to resolve typing error. */}
                                        {sortedProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)}
                                    </div>
                                </section>
                            )}

                            {(activeTab === 'all' || activeTab === 'authors') && results.foundAuthors.length > 0 && (
                                <section className={results.foundProducts.length > 0 && activeTab === 'all' ? 'mt-24' : ''}>
                                    <h2 className="font-sans text-3xl text-brown-gray mb-8">
                                        {activeTab === 'all' ? 'Найденные авторы' : 'Авторы'}
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                                        {/* FIX: Add explicit type to map callback parameter to resolve typing error. */}
                                        {results.foundAuthors.map((author: Author) => <AuthorCard key={author.id} author={author} />)}
                                    </div>
                                </section>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    );
};