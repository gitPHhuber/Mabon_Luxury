import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const ArrowLeftIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
);

export const Pagination = ({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 5;
        const half = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - half);
            let end = Math.min(totalPages, currentPage + half);

            if (currentPage <= half) {
                end = maxPagesToShow;
            }
            if (currentPage + half >= totalPages) {
                start = totalPages - maxPagesToShow + 1;
            }
            
            if (start > 1) {
                pageNumbers.push(1);
                if (start > 2) {
                     pageNumbers.push('...');
                }
            }

            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }

            if (end < totalPages) {
                if (end < totalPages - 1) {
                    pageNumbers.push('...');
                }
                pageNumbers.push(totalPages);
            }
        }

        return pageNumbers;
    };
    
    const pageNumbers = getPageNumbers();

    return (
        <nav className={`flex items-center justify-center mt-6 ${className}`} aria-label="Pagination">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="relative inline-flex items-center p-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="sr-only">Previous</span>
                <ArrowLeftIcon />
            </button>
            
            {pageNumbers.map((number, index) =>
                typeof number === 'number' ? (
                    <button
                        key={`${number}-${index}`}
                        onClick={() => onPageChange(number)}
                        aria-current={currentPage === number ? 'page' : undefined}
                        className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium ${currentPage === number ? 'z-10 bg-brown-gray border-brown-gray text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    >
                        {number}
                    </button>
                ) : (
                    <span key={`ellipsis-${index}`} className="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                        ...
                    </span>
                )
            )}

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="-ml-px relative inline-flex items-center p-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <span className="sr-only">Next</span>
                <ArrowRightIcon />
            </button>
        </nav>
    );
};