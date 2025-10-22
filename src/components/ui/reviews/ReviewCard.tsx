import React, { useState } from 'react';
import { Review } from '../../../data/db';
import { StarRating } from './StarRating';
import { ImageWithLoader } from '../ImageWithLoader';
import { ImageLightbox } from '../modals/ImageLightbox';


interface ReviewCardProps {
    review: Review;
}


export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);
    const reviewDate = new Date(review.createdAt).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <>
            <article className="border-t border-gray-200 pt-8">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 rounded-full bg-cream flex items-center justify-center font-bold text-brown-gray text-xl font-sans flex-shrink-0">
                        {review.authorName.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-bold text-brown-gray font-sans">{review.authorName}</h4>
                                {review.isVerifiedPurchase && (
                                    <span className="text-xs font-bold text-green-700 bg-green-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                                        ✓ Подтвержденная покупка
                                    </span>
                                )}
                            </div>
                            <time dateTime={review.createdAt} className="text-sm text-gray-500">{reviewDate}</time>
                        </div>
                        <div className="flex items-center my-2">
                            <StarRating rating={review.rating} />
                        </div>
                        <h5 className="font-bold text-lg my-2 font-serif">{review.title}</h5>
                        <p className="text-base leading-relaxed">{review.text}</p>
                        
                        {review.images && review.images.length > 0 && (
                            <div className="mt-4 flex space-x-2">
                                {review.images.map((img, index) => (
                                    <button key={index} onClick={() => setLightboxImage(img)} className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden hover:opacity-80 transition-opacity">
                                        <ImageWithLoader 
                                            src={img} 
                                            alt={`Review image ${index + 1} for ${review.title}`}
                                            className="w-full h-full"
                                            imageClassName="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </article>
            {lightboxImage && (
                <ImageLightbox src={lightboxImage} onClose={() => setLightboxImage(null)} />
            )}
        </>
    );
};