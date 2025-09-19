import React, { useState, useEffect, createContext, useContext, useCallback } from 'react';
import { REVIEWS as mockReviews, Review } from '../data/db';

type NewReviewData = Omit<Review, 'id' | 'createdAt' | 'status'>;

interface ReviewContextType {
    getAllReviews: () => Review[];
    getReviewsByProductId: (productId: string) => Review[];
    addReview: (reviewData: NewReviewData) => void;
    updateReview: (updatedReview: Review) => void;
    deleteReview: (reviewId: string) => void;
}

const ReviewContext = createContext<ReviewContextType | undefined>(undefined);

export const useReview = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReview must be used within a ReviewProvider');
    }
    return context;
};

export const ReviewProvider = ({ children }: { children: React.ReactNode }) => {
    const [reviews, setReviews] = useState<Review[]>([]);

    useEffect(() => {
        // Initialize reviews from localStorage or fall back to mock data
        try {
            const localData = localStorage.getItem('mabon_reviews');
            if (localData) {
                setReviews(JSON.parse(localData));
            } else {
                setReviews(mockReviews);
                localStorage.setItem('mabon_reviews', JSON.stringify(mockReviews));
            }
        } catch (error) {
            console.error("Failed to parse reviews from localStorage", error);
            setReviews(mockReviews);
        }
    }, []);
    
    const updateLocalStorage = (updatedReviews: Review[]) => {
        setReviews(updatedReviews);
        localStorage.setItem('mabon_reviews', JSON.stringify(updatedReviews));
    };

    const getAllReviews = useCallback(() => {
        return [...reviews].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [reviews]);

    const getReviewsByProductId = useCallback((productId: string) => {
        return reviews
            .filter(review => review.productId === productId && review.status === 'approved')
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }, [reviews]);

    const addReview = useCallback((reviewData: NewReviewData) => {
        const newReview: Review = {
            ...reviewData,
            id: `r${Date.now()}`,
            createdAt: new Date().toISOString(),
            status: 'pending',
        };
        updateLocalStorage([...reviews, newReview]);
    }, [reviews]);
    
    const updateReview = useCallback((updatedReview: Review) => {
        const updatedReviews = reviews.map(r => r.id === updatedReview.id ? updatedReview : r);
        updateLocalStorage(updatedReviews);
    }, [reviews]);

    const deleteReview = useCallback((reviewId: string) => {
        const updatedReviews = reviews.filter(r => r.id !== reviewId);
        updateLocalStorage(updatedReviews);
    }, [reviews]);

    const value = { getAllReviews, getReviewsByProductId, addReview, updateReview, deleteReview };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};