import React from 'react';
import { Author } from '../../data/db';

interface ActiveFiltersProps {
    priceRange: [number, number];
    selectedAuthors: string[];
    allAuthors: Author[];
    onRemovePrice: () => void;
    onRemoveAuthor: (authorId: string) => void;
    onClearAll: () => void;
    minPrice: number;
    maxPrice: number;
}

const CloseIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const ActiveFilters = ({
    priceRange,
    selectedAuthors,
    allAuthors,
    onRemovePrice,
    onRemoveAuthor,
    onClearAll,
    minPrice,
    maxPrice,
}: ActiveFiltersProps) => {

    const isPriceFiltered = priceRange[0] > minPrice || priceRange[1] < maxPrice;
    const hasActiveFilters = isPriceFiltered || selectedAuthors.length > 0;

    if (!hasActiveFilters) {
        return null;
    }

    return (
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-gray-200 font-sans">
            <span className="text-sm font-bold text-brown-gray mr-2">Активные фильтры:</span>
            {isPriceFiltered && (
                <div className="flex items-center bg-cream text-brown-gray text-sm px-3 py-1 rounded-full">
                    <span>{`Цена: ${priceRange[0].toLocaleString('ru-RU')} - ${priceRange[1].toLocaleString('ru-RU')} ₽`}</span>
                    <button onClick={onRemovePrice} className="ml-2" aria-label="Удалить фильтр по цене">
                        <CloseIcon />
                    </button>
                </div>
            )}
            {selectedAuthors.map(authorId => {
                const author = allAuthors.find(a => a.id === authorId);
                return (
                    <div key={authorId} className="flex items-center bg-cream text-brown-gray text-sm px-3 py-1 rounded-full">
                        <span>{author?.name || 'Unknown Author'}</span>
                        <button onClick={() => onRemoveAuthor(authorId)} className="ml-2" aria-label={`Удалить фильтр по автору ${author?.name}`}>
                           <CloseIcon />
                        </button>
                    </div>
                );
            })}
            <button onClick={onClearAll} className="text-sm text-brown-gray hover:underline font-bold ml-auto">
                Очистить все
            </button>
        </div>
    );
};
