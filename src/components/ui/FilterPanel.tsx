import React from 'react';
import { Author } from '../../data/db';
import { PriceRangeSlider } from './PriceRangeSlider';

interface FilterPanelProps {
    authors: Author[];
    priceRange: [number, number];
    onPriceChange: (newRange: [number, number]) => void;
    selectedAuthors: string[];
    onAuthorChange: (authorId: string) => void;
    onResetFilters: () => void;
    minPrice: number;
    maxPrice: number;
}

export const FilterPanel = ({
    authors,
    priceRange,
    onPriceChange,
    selectedAuthors,
    onAuthorChange,
    onResetFilters,
    minPrice,
    maxPrice,
}: FilterPanelProps) => {
    return (
        <div className="space-y-8 font-sans">
            <div>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-brown-gray">Фильтры</h3>
                    <button onClick={onResetFilters} className="btn btn-text !p-0 !text-sm hover:underline">
                        Сбросить все
                    </button>
                </div>
            </div>

            {/* Price Filter */}
            <fieldset>
                <legend className="font-bold text-brown-gray mb-4">Цена</legend>
                <PriceRangeSlider
                    min={minPrice}
                    max={maxPrice}
                    value={priceRange}
                    onChange={onPriceChange}
                    step={1000}
                />
            </fieldset>

            {/* Author Filter */}
            <fieldset>
                <legend className="font-bold text-brown-gray mb-4">Авторы</legend>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {authors.map(author => (
                        <label key={author.id} className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedAuthors.includes(author.id)}
                                onChange={() => onAuthorChange(author.id)}
                                className="h-4 w-4 text-brown-gray focus:ring-brown-gray border-gray-300 rounded"
                            />
                            <span className="ml-3 text-brown-gray">{author.name}</span>
                        </label>
                    ))}
                </div>
            </fieldset>
        </div>
    );
};