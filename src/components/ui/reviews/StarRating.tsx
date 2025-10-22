import React, { useState } from 'react';

interface StarRatingProps {
    rating: number;
    totalStars?: number;
    isInteractive?: boolean;
    onRatingChange?: (rating: number) => void;
    className?: string;
}

export const StarRating = ({ rating, totalStars = 5, isInteractive = false, onRatingChange, className = '' }: StarRatingProps) => {
    const [hoverRating, setHoverRating] = useState(0);

    const handleMouseOver = (index: number) => {
        if (isInteractive) {
            setHoverRating(index);
        }
    };
    
    const handleMouseLeave = () => {
        if (isInteractive) {
            setHoverRating(0);
        }
    };

    const handleClick = (index: number) => {
        if (isInteractive && onRatingChange) {
            onRatingChange(index);
        }
    };

    if (isInteractive) {
        return (
            <div 
                className={`flex items-center ${className}`} 
                onMouseLeave={handleMouseLeave}
                role="group"
                aria-label="Оценка товара"
            >
                {[...Array(totalStars)].map((_, i) => {
                    const starIndex = i + 1;
                    const displayRating = hoverRating || rating;
                    
                    return (
                        <button
                            key={starIndex}
                            type="button"
                            className={`transition-colors duration-150 ease-in-out ${displayRating >= starIndex ? 'text-yellow-400' : 'text-gray-300 hover:text-yellow-300'}`}
                            onClick={() => handleClick(starIndex)}
                            onMouseOver={() => handleMouseOver(starIndex)}
                            aria-pressed={rating === starIndex}
                            aria-label={`Оценить в ${starIndex} ${starIndex === 1 ? 'звезду' : (starIndex > 1 && starIndex < 5) ? 'звезды' : 'звезд'}`}
                        >
                            <svg
                                className="w-6 h-6"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                                aria-hidden="true"
                            >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </button>
                    );
                })}
            </div>
        )
    }

    return (
        <div 
            className={`flex items-center ${className}`} 
            role="img"
            aria-label={`Рейтинг: ${rating} из ${totalStars} звезд.`}
        >
            {[...Array(totalStars)].map((_, i) => {
                const starIndex = i + 1;
                return (
                    <svg
                        key={starIndex}
                        className={`w-5 h-5 ${rating >= starIndex ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                );
            })}
        </div>
    );
};