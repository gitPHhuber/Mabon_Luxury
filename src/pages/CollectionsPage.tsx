import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { ProductCard } from '../components/ui/ProductCard';
import { ProductCardSkeleton } from '../components/ui/skeletons/ProductCardSkeleton';
import { SortDropdown } from '../components/ui/SortDropdown';
import { FilterPanel } from '../components/ui/FilterPanel';
import { ActiveFilters } from '../components/ui/ActiveFilters';
import { useData } from '../context/DataContext';
import { Product } from '../data/db';

const FilterIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9M3 12h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
    </svg>
);

export const CollectionsPage = () => {
    const { products, collections, authors } = useData();
    const location = useLocation();
    
    const [collectionFilter, setCollectionFilter] = useState(location.state?.filter || 'Все');
    const [loading, setLoading] = useState(true);
    const [sortOption, setSortOption] = useState('default');
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    const { minPrice, maxPrice } = useMemo(() => {
        if (products.length === 0) return { minPrice: 0, maxPrice: 100000 };
        const prices = products.map(p => p.price);
        return {
            minPrice: Math.floor(Math.min(...prices) / 1000) * 1000,
            maxPrice: Math.ceil(Math.max(...prices) / 1000) * 1000
        };
    }, [products]);

    const [priceRange, setPriceRange] = useState<[number, number]>([minPrice, maxPrice]);
    const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
    

    useEffect(() => {
        resetFilters();
    }, [collectionFilter, minPrice, maxPrice]);

    const resetFilters = useCallback(() => {
        setPriceRange([minPrice, maxPrice]);
        setSelectedAuthors([]);
    }, [minPrice, maxPrice]);

    const filteredProducts = useMemo(() => {
        let tempProducts = collectionFilter === 'Все' ? products : products.filter(p => p.collection === collectionFilter);
        

        tempProducts = tempProducts.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);


        if (selectedAuthors.length > 0) {
            tempProducts = tempProducts.filter(p => selectedAuthors.includes(p.authorId));
        }

        return tempProducts;

    }, [collectionFilter, products, priceRange, selectedAuthors]);

    useEffect(() => {
        setLoading(true);
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [filteredProducts]);

    const sortedProducts = useMemo(() => {
        const sortableProducts = [...filteredProducts];
        switch (sortOption) {
            case 'newest':
                 return sortableProducts.sort((a, b) => parseInt(b.id.replace('p', '')) - parseInt(a.id.replace('p', '')));
            case 'price-asc':
                return sortableProducts.sort((a, b) => a.price - b.price);
            case 'price-desc':
                return sortableProducts.sort((a, b) => b.price - a.price);
            case 'name-asc':
                return sortableProducts.sort((a, b) => a.name.localeCompare(b.name));
            case 'name-desc':
                return sortableProducts.sort((a, b) => b.name.localeCompare(a.name));
            default:
                return filteredProducts;
        }
    }, [filteredProducts, sortOption]);
    
    const handleAuthorChange = (authorId: string) => {
        setSelectedAuthors(prev =>
            prev.includes(authorId) ? prev.filter(id => id !== authorId) : [...prev, authorId]
        );
    };

    const removeAuthorFilter = (authorId: string) => {
        setSelectedAuthors(prev => prev.filter(id => id !== authorId));
    };

    const removePriceFilter = () => {
        setPriceRange([minPrice, maxPrice]);
    };
    
    const activeFilterCount = (selectedAuthors.length) + (priceRange[0] !== minPrice || priceRange[1] !== maxPrice ? 1 : 0);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 fade-in">
            <h1 className="text-center font-sans text-5xl text-brown-gray mb-4">Коллекции</h1>
            <div className="flex justify-center flex-wrap gap-x-4 gap-y-2 mb-12 font-sans">
                <button onClick={() => setCollectionFilter('Все')} className={`px-4 py-2 text-sm uppercase tracking-wider ${collectionFilter === 'Все' ? 'font-bold underline' : 'hover:underline'}`}>Все</button>
                {collections.map(c => (
                    <button key={c.name} onClick={() => setCollectionFilter(c.name)} className={`px-4 py-2 text-sm uppercase tracking-wider ${collectionFilter === c.name ? 'font-bold underline' : 'hover:underline'}`}>{c.name}</button>
                ))}
            </div>

            <div className="grid gap-x-8 lg:gap-x-10 grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:[grid-template-columns:repeat(16,minmax(0,1fr))]">
                {/* Filter Panel - Desktop Sidebar */}
                <aside className="xl:col-span-4 lg:col-span-3 hidden lg:block xl:sticky xl:top-28 self-start">
                     <FilterPanel
                        authors={authors}
                        priceRange={priceRange}
                        onPriceChange={setPriceRange}
                        selectedAuthors={selectedAuthors}
                        onAuthorChange={handleAuthorChange}
                        onResetFilters={resetFilters}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />
                </aside>

                {/* Main Content */}
                <main className="xl:col-span-12 lg:col-span-9 col-span-4 md:col-span-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6">
                         <button onClick={() => setIsFilterOpen(true)} className="lg:hidden flex items-center mb-4 sm:mb-0 bg-white border border-gray-300 text-brown-gray py-2 px-4 rounded hover:bg-gray-50 font-sans relative">
                            <FilterIcon />
                            Фильтры
                            {activeFilterCount > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{activeFilterCount}</span>}
                        </button>
                        <p className="text-sm text-brown-gray mb-4 sm:mb-0">Найдено товаров: {sortedProducts.length}</p>
                        <SortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                    </div>
                    
                    <ActiveFilters
                        priceRange={priceRange}
                        selectedAuthors={selectedAuthors}
                        allAuthors={authors}
                        onRemovePrice={removePriceFilter}
                        onRemoveAuthor={removeAuthorFilter}
                        onClearAll={resetFilters}
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {loading ? (
                            Array.from({ length: 9 }).map((_, i) => <ProductCardSkeleton key={i} />)
                        ) : sortedProducts.length > 0 ? (
                            sortedProducts.map((product: Product) => <ProductCard key={product.id} product={product} />)
                        ) : (
                            <div className="col-span-full text-center py-16">
                                <p className="text-xl">Товары не найдены.</p>
                                <p className="mt-2">Попробуйте изменить фильтры или сбросить их.</p>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Filter Panel - Mobile Drawer */}
            <>
                <div className={`fixed inset-0 bg-black bg-opacity-40 z-[90] transition-opacity lg:hidden ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsFilterOpen(false)} aria-hidden="true"></div>
                <div className={`fixed top-0 right-0 h-full w-full max-w-xs bg-white z-[100] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true">
                     <div className="flex flex-col h-full">
                        <div className="flex justify-between items-center p-4 border-b">
                            <h2 className="text-xl font-bold text-brown-gray font-sans">Фильтры</h2>
                            <button onClick={() => setIsFilterOpen(false)} aria-label="Закрыть фильтры" className="text-brown-gray hover:opacity-80 transition-opacity">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        <div className="flex-grow overflow-y-auto p-4">
                            <FilterPanel
                                authors={authors}
                                priceRange={priceRange}
                                onPriceChange={setPriceRange}
                                selectedAuthors={selectedAuthors}
                                onAuthorChange={handleAuthorChange}
                                onResetFilters={resetFilters}
                                minPrice={minPrice}
                                maxPrice={maxPrice}
                            />
                        </div>
                        <div className="p-4 border-t">
                            <button onClick={() => setIsFilterOpen(false)} className="w-full bg-brown-gray text-white font-bold py-3 px-8 uppercase tracking-wider hover:brightness-90 transition-all duration-300 font-sans">
                                Показать ({sortedProducts.length})
                            </button>
                        </div>
                     </div>
                </div>
            </>
        </div>
    );
};