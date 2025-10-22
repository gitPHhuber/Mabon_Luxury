import React, { useEffect } from 'react';

interface ImageLightboxProps {
    src: string;
    onClose: () => void;
}

export const ImageLightbox = ({ src, onClose }: ImageLightboxProps) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'auto';
        };
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 bg-brown-gray bg-opacity-80 z-[110] flex items-center justify-center p-4 fade-in" 
            role="dialog" 
            aria-modal="true"
            aria-labelledby="lightbox-title"
            onClick={onClose}
        >
            <div className="relative max-w-4xl max-h-[90vh]" onClick={e => e.stopPropagation()}>
                <h2 id="lightbox-title" className="absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 [clip:rect(0,0,0,0)]">
                    Увеличенное изображение
                </h2>
                <img src={src} alt="Enlarged review" className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
                <button 
                    onClick={onClose} 
                    className="absolute -top-2 -right-2 bg-white text-brown-gray rounded-full w-8 h-8 flex items-center justify-center text-xl hover:bg-cream"
                    aria-label="Close image view"
                >
                    &times;
                </button>
            </div>
        </div>
    );
};