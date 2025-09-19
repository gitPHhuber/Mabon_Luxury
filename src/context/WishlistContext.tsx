import React, { useState, useEffect, createContext, useContext, useMemo } from 'react';
import { useCookieConsent } from './CookieConsentContext';
import { useData } from './DataContext';
import { Product } from '../data/db';


interface WishlistContextType {
    wishlistItems: string[];
    wishlistedProducts: Product[];
    addToWishlist: (productId: string) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
    wishlistCount: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlistItems, setWishlistItems] = useState<string[]>([]);
    const { cookieConsent } = useCookieConsent();
    const { products } = useData();

    useEffect(() => {
        if (cookieConsent === true) {
            try {
                const localData = localStorage.getItem('mabon_wishlist');
                if (localData) {
                    setWishlistItems(JSON.parse(localData));
                }
            } catch (error) {
                console.error("Failed to parse wishlist from localStorage", error);
                localStorage.removeItem('mabon_wishlist');
            }
        } else if (cookieConsent === false) {
            setWishlistItems([]);
            localStorage.removeItem('mabon_wishlist');
        }
    }, [cookieConsent]);

    useEffect(() => {
        if (cookieConsent === true) {
            localStorage.setItem('mabon_wishlist', JSON.stringify(wishlistItems));
        }
    }, [wishlistItems, cookieConsent]);
    
    const wishlistedProducts = useMemo(() => {
        return products.filter(product => wishlistItems.includes(product.id));
    }, [wishlistItems, products]);


    const addToWishlist = (productId: string) => {
        setWishlistItems(prevItems => {
            if (prevItems.includes(productId)) {
                return prevItems;
            }
            return [...prevItems, productId];
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlistItems(prevItems => prevItems.filter(id => id !== productId));
    };

    const isInWishlist = (productId: string) => {
        return wishlistItems.includes(productId);
    };

    const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

    const value = {
        wishlistItems,
        wishlistedProducts,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        wishlistCount
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};
