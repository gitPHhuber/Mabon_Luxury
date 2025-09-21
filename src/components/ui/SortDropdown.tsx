import React from 'react';

interface SortDropdownProps {
    sortOption: string;
    setSortOption: (option: string) => void;
    className?: string;
}

export const SortDropdown = ({ sortOption, setSortOption, className = '' }: SortDropdownProps) => {
    return (
        <div className={`relative ${className}`}>
            <label htmlFor="sort-products" className="sr-only">Сортировать товары</label>
            <select
                id="sort-products"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="appearance-none w-full md:w-auto bg-white border border-gray-300 text-brown-gray py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-brown-gray font-sans"
            >
                <option value="default">По умолчанию</option>
                <option value="newest">Сначала новые</option>
                <option value="price-asc">Цена: по возрастанию</option>
                <option value="price-desc">Цена: по убыванию</option>
                <option value="name-asc">Название: А-Я</option>
                <option value="name-desc">Название: Я-А</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-brown-gray">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
    );
};
