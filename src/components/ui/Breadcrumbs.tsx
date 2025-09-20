import React from 'react';
import { Link } from 'react-router-dom';

export interface BreadcrumbItem {
    label: string;
    path?: string;
    state?: any;
}

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-brown-gray/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const Breadcrumbs = ({ items }: { items: BreadcrumbItem[] }) => {
    if (!items || items.length <= 1) return null;

    return (
        <nav aria-label="Breadcrumb" className="bg-cream">
            <ol className="container mx-auto px-6 py-3 flex items-center space-x-2 text-sm font-sans text-brown-gray">
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        {index > 0 && <ChevronRightIcon />}
                        {item.path && index < items.length - 1 ? (
                            <Link to={item.path} state={item.state} className="hover:underline opacity-80 hover:opacity-100 transition-opacity">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="font-medium" aria-current="page">
                                {item.label}
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
};