import React, { useMemo } from 'react';
import { Review } from '../../../data/db';
import { StarRating } from './StarRating';

export const RatingSummary = ({ reviews }: { reviews: Review[] }) => {
    const { averageRating, ratingCounts, totalReviews } = useMemo(() => {
        const total = reviews.length;
        if (total === 0) {
            return { averageRating: 0, ratingCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, totalReviews: 0 };
        }
        
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        const avg = sum / total;
        
        const counts = reviews.reduce((acc, review) => {
            acc[review.rating] = (acc[review.rating] || 0) + 1;
            return acc;
        }, {} as Record<number, number>);

        return {
            averageRating: Math.round(avg * 10) / 10,
            ratingCounts: {
                5: counts[5] || 0,
                4: counts[4] || 0,
                3: counts[3] || 0,
                2: counts[2] || 0,
                1: counts[1] || 0,
            },
            totalReviews: total,
        };
    }, [reviews]);

    return (
        <div className="my-8 p-8 bg-cream rounded-lg font-sans">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="text-center">
                    <p className="text-5xl font-bold text-brown-gray">{averageRating.toFixed(1)}</p>
                    <StarRating rating={averageRating} />
                    <p className="text-sm text-brown-gray mt-2">на основе {totalReviews} отзывов</p>
                </div>
                <div className="w-full flex-1">
                    {Object.entries(ratingCounts).reverse().map(([star, count]) => (
                        <div key={star} className="flex items-center space-x-2 my-1">
                            <span className="text-sm w-12">{star} звезд</span>
                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                <div 
                                    className="bg-brown-gray h-2.5 rounded-full" 
                                    style={{ width: `${totalReviews > 0 ? (count / totalReviews) * 100 : 0}%` }}
                                ></div>
                            </div>
                            <span className="text-sm w-8 text-right">{count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};