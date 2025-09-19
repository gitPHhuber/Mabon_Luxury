import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { useReview } from '../../../context/ReviewContext';
import { useNotification } from '../../../context/NotificationContext';
import { StarRating } from './StarRating';

const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

export const ReviewForm = ({ productId, onReviewSubmitted }: { productId: string, onReviewSubmitted: () => void }) => {
    const { user } = useAuth();
    const { addReview } = useReview();
    const { showNotification } = useNotification();
    
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [text, setText] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [errors, setErrors] = useState<{ rating?: string; title?: string; text?: string; images?: string; }>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const totalImages = images.length + files.length;

            if (totalImages > 3) {
                setErrors(prev => ({ ...prev, images: 'Вы можете загрузить не более 3 изображений.' }));
                return;
            }
            
            const newImages = [...images, ...files].slice(0, 3);
            setImages(newImages);
            
            const newPreviews = [...imagePreviews];
            files.slice(0, 3 - images.length).forEach(file => {
                 newPreviews.push(URL.createObjectURL(file));
            });
            setImagePreviews(newPreviews);
            setErrors(prev => ({ ...prev, images: undefined }));
        }
    };
    
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => {
            const url = prev[index];
            if (url) URL.revokeObjectURL(url);
            return prev.filter((_, i) => i !== index);
        });
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};
        if (rating === 0) newErrors.rating = 'Пожалуйста, выберите рейтинг.';
        if (!title.trim()) newErrors.title = 'Пожалуйста, введите заголовок.';
        if (text.trim().length < 10) newErrors.text = 'Отзыв должен содержать не менее 10 символов.';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm() || !user) return;

        setIsSubmitting(true);

        const imageBase64Strings = await Promise.all(images.map(file => toBase64(file)));
        
        addReview({
            productId,
            authorName: user.name,
            rating,
            title,
            text,
            images: imageBase64Strings,
            isVerifiedPurchase: true, 
        });
        
        showNotification('Спасибо! Ваш отзыв отправлен на модерацию.', 'success');
        setIsSubmitting(false);
        onReviewSubmitted();
    };
    
    if (!user) {
        return (
            <div className="my-8 p-8 bg-cream rounded-lg text-center font-sans">
                <p>Пожалуйста, <Link to="/login" className="font-bold underline hover:no-underline">войдите в свой аккаунт</Link>, чтобы оставить отзыв.</p>
            </div>
        );
    }

    return (
        <div className="my-8 p-8 bg-cream rounded-lg font-sans transition-all duration-500">
            <h3 className="text-2xl font-bold text-brown-gray mb-6">Написать отзыв</h3>
            <form onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold mb-2">Ваша оценка *</label>
                        <StarRating rating={rating} onRatingChange={setRating} isInteractive />
                        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
                    </div>
                    <div>
                        <label htmlFor="review-title" className="block text-sm font-bold mb-2">Заголовок *</label>
                        <input id="review-title" type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full p-2 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray" required/>
                        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
                    </div>
                     <div className="md:col-span-2">
                        <label htmlFor="review-text" className="block text-sm font-bold mb-2">Ваш отзыв *</label>
                        <textarea id="review-text" value={text} onChange={e => setText(e.target.value)} rows={5} className="w-full p-2 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray" required />
                        {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text}</p>}
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="review-images" className="block text-sm font-bold mb-2">Добавить фото (до 3)</label>
                        <input id="review-images" type="file" onChange={handleImageChange} accept="image/*" multiple className="block w-full text-sm text-brown-gray file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cream file:text-brown-gray hover:file:bg-brown-gray/20" />
                        {errors.images && <p className="text-red-500 text-xs mt-1">{errors.images}</p>}
                         <div className="mt-4 flex space-x-2">
                            {imagePreviews.map((preview, index) => (
                                <div key={index} className="relative w-24 h-24">
                                    <img src={preview} alt={`Preview ${index}`} className="w-full h-full object-cover rounded"/>
                                    <button type="button" onClick={() => removeImage(index)} className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">&times;</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                 <div className="mt-6 text-right">
                    <button type="submit" disabled={isSubmitting} className="btn btn-primary !py-2 !px-6">
                        {isSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                    </button>
                 </div>
            </form>
        </div>
    );
};