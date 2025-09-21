import React, { useState, useEffect, createContext, useContext, useMemo, useCallback } from 'react';
import { Product, Author, INITIAL_PRODUCTS, INITIAL_AUTHORS, getCollections } from '../data/db';

interface DataContextType {
    products: Product[];
    authors: Author[];
    collections: { name: string; imageUrl: string }[];
    getProductById: (id: string) => Product | undefined;
    getAuthorById: (id: string) => Author | undefined;
    getProductsByAuthorId: (authorId: string) => Product[];
    addProduct: (product: Omit<Product, 'id'>) => void;
    updateProduct: (product: Product) => void;
    deleteProduct: (id: string) => void;
    addAuthor: (author: Omit<Author, 'id'>) => void;
    updateAuthor: (author: Author) => void;
    deleteAuthor: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
    const context = useContext(DataContext);
    if (!context) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {
        try {
            const localProducts = localStorage.getItem('mabon_products');
            setProducts(localProducts ? JSON.parse(localProducts) : INITIAL_PRODUCTS);

            const localAuthors = localStorage.getItem('mabon_authors');
            setAuthors(localAuthors ? JSON.parse(localAuthors) : INITIAL_AUTHORS);

        } catch (error) {
            console.error("Failed to parse data from localStorage", error);
            setProducts(INITIAL_PRODUCTS);
            setAuthors(INITIAL_AUTHORS);
        }
    }, []);

    useEffect(() => {
        try {
            if (products.length > 0) {
                 localStorage.setItem('mabon_products', JSON.stringify(products));
            }
        } catch (error) {
            console.error("Failed to save products to localStorage", error);
        }
    }, [products]);

    useEffect(() => {
        try {
            if (authors.length > 0) {
                localStorage.setItem('mabon_authors', JSON.stringify(authors));
            }
        } catch (error) {
            console.error("Failed to save authors to localStorage", error);
        }
    }, [authors]);

    const collections = useMemo(() => getCollections(products), [products]);

    const getProductById = useCallback((id: string) => products.find(p => p.id === id), [products]);
    const getAuthorById = useCallback((id: string) => authors.find(a => a.id === id), [authors]);
    const getProductsByAuthorId = useCallback((authorId: string) => products.filter(p => p.authorId === authorId), [products]);

    const addProduct = (productData: Omit<Product, 'id'>) => {
        const newProduct: Product = { ...productData, id: `p${Date.now()}` };
        setProducts(prev => [...prev, newProduct]);
    };

    const updateProduct = (updatedProduct: Product) => {
        setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    };

    const deleteProduct = (id: string) => {
        setProducts(prev => prev.filter(p => p.id !== id));
    };
    
    const addAuthor = (authorData: Omit<Author, 'id'>) => {
        const newAuthor: Author = { ...authorData, id: `a${Date.now()}` };
        setAuthors(prev => [...prev, newAuthor]);
    };
    
    const updateAuthor = (updatedAuthor: Author) => {
        setAuthors(prev => prev.map(a => a.id === updatedAuthor.id ? updatedAuthor : a));
    };

    const deleteAuthor = (id: string) => {
        setAuthors(prev => prev.filter(a => a.id !== id));
    };


    const value = {
        products,
        authors,
        collections,
        getProductById,
        getAuthorById,
        getProductsByAuthorId,
        addProduct,
        updateProduct,
        deleteProduct,
        addAuthor,
        updateAuthor,
        deleteAuthor,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
