import React, { useState, useMemo } from 'react';
import { useReview } from '../../../context/ReviewContext';
import { RatingSummary } from './RatingSummary';
import { ReviewList } from './ReviewList';
import { ReviewForm } from './ReviewForm';

export const ReviewsSection = ({ productId }: { productId: string }) => {
    const { getReviewsByProductId } = useReview();
    const [showForm, setShowForm] = useState(false);

    const reviews = useMemo(() => getReviewsByProductId(productId), [getReviewsByProductId, productId]);
    
    return (
        <div className="mt-24 border-t pt-12">
            <div className="container mx-auto px-6">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="font-sans text-4xl text-brown-gray">Отзывы покупателей</h2>
                    <button 
                        onClick={() => setShowForm(!showForm)}
                        className="btn btn-primary !py-2 !px-6"
                        aria-expanded={showForm}
                    >
                        {showForm ? 'Закрыть' : 'Оставить отзыв'}
                    </button>
                </div>

                {showForm && <ReviewForm productId={productId} onReviewSubmitted={() => setShowForm(false)} />}
                
                {reviews.length > 0 ? (
                    <>
                        <RatingSummary reviews={reviews} />
                        <ReviewList reviews={reviews} />
                    </>
                ) : (
                    <p className="text-center py-12 text-lg">На этот товар пока нет отзывов. Станьте первым!</p>
                )}
            </div>
        </div>
    );
};