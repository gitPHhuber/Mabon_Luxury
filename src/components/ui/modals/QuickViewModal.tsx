import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Product } from '../../../data/db';
import { useCart } from '../../../context/CartContext';
import { useData } from '../../../context/DataContext';
import { ImageWithLoader } from '../ImageWithLoader';

interface QuickViewModalProps {
    product: Product;
    onClose: () => void;
}

export const QuickViewModal = ({ product, onClose }: QuickViewModalProps) => {
    const { addToCart } = useCart();
    const { getAuthorById } = useData();
    const navigate = useNavigate();
    const author = getAuthorById(product.authorId);

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

    const handleAddToCart = () => {
        addToCart(product);
        onClose();
    };

    const handleViewFullDetails = () => {
        onClose();
        navigate(`/products/${product.id}`);
    };

    return (
        <div className="fixed inset-0 bg-brown-gray bg-opacity-70 z-[100] flex items-center justify-center fade-in font-sans" role="dialog" aria-modal="true" aria-labelledby="quick-view-title">
            <div className="fixed inset-0" onClick={onClose} aria-hidden="true"></div>
            <div className="relative bg-white w-full max-w-4xl max-h-[90vh] rounded-lg shadow-2xl m-4 flex flex-col md:flex-row animate-slide-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 z-20 btn-icon" aria-label="Close quick view">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
                <div className="w-full md:w-1/2 h-64 md:h-auto bg-cream">
                     <ImageWithLoader 
                        src={product.imageUrl} 
                        alt={product.name} 
                        className="w-full h-full"
                        imageClassName="w-full h-full object-cover"
                    />
                </div>
                <div className="w-full md:w-1/2 p-8 flex flex-col overflow-y-auto">
                    <div>
                        <h2 id="quick-view-title" className="font-sans text-3xl text-brown-gray">{product.name}</h2>
                        {author && <p className="mt-2 text-md font-sans"><Link to={`/authors/${author.id}`} onClick={onClose} className="hover:underline">{author.name}</Link></p>}
                        <p className="mt-4 font-sans text-2xl font-bold text-brown-gray">{product.price.toLocaleString('ru-RU')} ₽</p>
                        <p className="mt-6 text-base leading-relaxed font-serif max-h-48 overflow-y-auto">{product.description}</p>
                    </div>
                    <div className="mt-auto pt-6">
                        <button 
                            onClick={handleAddToCart}
                            className="btn btn-primary w-full">
                            Добавить в корзину
                        </button>
                        <button 
                            onClick={handleViewFullDetails}
                            className="btn btn-text mt-2 w-full !font-bold">
                            Посмотреть детали
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};