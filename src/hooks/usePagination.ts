import { useState, useMemo, useEffect, Dispatch, SetStateAction } from 'react';

interface PaginationResult<T> {
    currentPage: number;
    totalPages: number;
    paginatedData: T[];

    setCurrentPage: Dispatch<SetStateAction<number>>;
}

export const usePagination = <T>(data: T[], itemsPerPage: number): PaginationResult<T> => {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length, itemsPerPage]);

    useEffect(() => {

        const lastPage = totalPages > 0 ? totalPages : 1;
        if (currentPage > lastPage) {
            setCurrentPage(lastPage);
        }
    }, [currentPage, totalPages]);

    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return data.slice(startIndex, startIndex + itemsPerPage);
    }, [data, currentPage, itemsPerPage]);

    return {
        currentPage,
        totalPages,
        paginatedData,
        setCurrentPage,
    };
};