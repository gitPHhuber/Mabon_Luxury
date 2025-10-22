import React, { useState, createContext, useContext, PropsWithChildren } from 'react';
import { Product } from '../data/db';
import { QuickViewModal } from '../components/ui/modals/QuickViewModal';

interface QuickViewContextType {
    openQuickView: (product: Product) => void;
    closeQuickView: () => void;
}

const QuickViewContext = createContext<QuickViewContextType | undefined>(undefined);

export const useQuickView = () => {
    const context = useContext(QuickViewContext);
    if (!context) {
        throw new Error('useQuickView must be used within a QuickViewProvider');
    }
    return context;
};

export const QuickViewProvider = ({ children }: PropsWithChildren) => {
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const openQuickView = (product: Product) => {
        setQuickViewProduct(product);
    };

    const closeQuickView = () => {
        setQuickViewProduct(null);
    };

    const value = { openQuickView, closeQuickView };

    return (
        <QuickViewContext.Provider value={value}>
            {children}
            {quickViewProduct && <QuickViewModal product={quickViewProduct} onClose={closeQuickView} />}
        </QuickViewContext.Provider>
    );
};