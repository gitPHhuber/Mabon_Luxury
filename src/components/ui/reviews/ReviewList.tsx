import React, { useState, useMemo } from 'react';
import { Review } from '../../../data/db';
import { ReviewCard } from './ReviewCard';

export const ReviewList = ({ reviews }: { reviews: Review[] }) => {
    const [sortOption, setSortOption] = useState('newest');
    const [filterPhotos, setFilterPhotos] = useState(false);

    const filteredAndSortedReviews = useMemo(() => {
        let processedReviews = [...reviews];

        if (filterPhotos) {
            processedReviews = processedReviews.filter(r => r.images && r.images.length > 0);
        }

        switch (sortOption) {
            case 'newest':
                processedReviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'oldest':
                processedReviews.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
                break;
            case 'rating-desc':
                processedReviews.sort((a, b) => b.rating - a.rating);
                break;
            case 'rating-asc':
                processedReviews.sort((a, b) => a.rating - b.rating);
                break;
        }

        return processedReviews;
    }, [reviews, sortOption, filterPhotos]);

    return (
        <div className="mt-12">
            <div className="flex flex-col sm:flex-row justify-between items-baseline mb-6 font-sans">
                <div className="flex items-center space-x-4">
                    <label htmlFor="sort-reviews" className="sr-only">Сортировать отзывы</label>
                    <select
                        id="sort-reviews"
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 text-brown-gray py-2 pl-3 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-brown-gray"
                    >
                        <option value="newest">Сначала новые</option>
                        <option value="oldest">Сначала старые</option>
                        <option value="rating-desc">Рейтинг: по убыванию</option>
                        <option value="rating-asc">Рейтинг: по возрастанию</option>
                    </select>
                </div>
                 <div className="mt-4 sm:mt-0">
                    <label className="flex items-center cursor-pointer">
                        <input type="checkbox" checked={filterPhotos} onChange={() => setFilterPhotos(!filterPhotos)} className="h-4 w-4 text-brown-gray focus:ring-brown-gray border-gray-300 rounded"/>
                        <span className="ml-2 text-brown-gray">Только с фото</span>
                    </label>
                </div>
            </div>

            {filteredAndSortedReviews.length > 0 ? (
                <div className="space-y-8">
                    {filteredAndSortedReviews.map((review: Review) => (
                        <ReviewCard key={review.id} review={review} />
                    ))}
                </div>
            ) : (
                 <p className="text-center py-12 text-lg">Нет отзывов, соответствующих вашим фильтрам.</p>
            )}
        </div>
    );
};