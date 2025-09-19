import React from 'react';
import { useReview } from '../../context/ReviewContext';
import { useData } from '../../context/DataContext';
import { Review } from '../../data/db';

const StatusBadge = ({ status }: { status: Review['status'] }) => {
    const baseClasses = 'px-2 inline-flex text-xs leading-5 font-semibold rounded-full';
    switch (status) {
        case 'approved':
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Одобрен</span>;
        case 'pending':
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>В ожидании</span>;
        case 'rejected':
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Отклонен</span>;
        default:
            return null;
    }
};

export const ManageReviewsPage = () => {
    const { getAllReviews, updateReview, deleteReview } = useReview();
    const { getProductById } = useData();
    const reviews = getAllReviews();

    const handleStatusChange = (review: Review, newStatus: Review['status']) => {
        const statusMap = {
            'approved': 'Одобрить',
            'rejected': 'Отклонить',
            'pending': 'Переместить в ожидание'
        }
        if (window.confirm(`Вы уверены, что хотите выполнить действие: "${statusMap[newStatus]}"?`)) {
            updateReview({ ...review, status: newStatus });
        }
    };

    const handleDelete = (review: Review) => {
        if (window.confirm(`Вы уверены, что хотите удалить отзыв от ${review.authorName}?`)) {
            deleteReview(review.id);
        }
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Управление отзывами</h1>
            
            <div className="bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="min-w-full leading-normal">
                    <thead>
                        <tr>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Автор</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Товар</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Рейтинг</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Отзыв</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Статус</th>
                            <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => {
                            const product = getProductById(review.productId);
                            return (
                                <tr key={review.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap font-semibold">{review.authorName}</p>
                                        <p className="text-gray-600 whitespace-no-wrap text-xs">{new Date(review.createdAt).toLocaleDateString()}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <a href={`/#/products/${product?.id}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{product?.name || 'Неизвестный товар'}</a>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{review.rating} / 5</td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="font-bold">{review.title}</p>
                                        <p className="text-gray-600 whitespace-no-wrap max-w-sm truncate" title={review.text}>{review.text}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><StatusBadge status={review.status} /></td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right whitespace-nowrap">
                                        {review.status !== 'approved' && <button onClick={() => handleStatusChange(review, 'approved')} className="text-green-600 hover:text-green-900 mr-3 font-medium">Одобрить</button>}
                                        {review.status !== 'rejected' && <button onClick={() => handleStatusChange(review, 'rejected')} className="text-yellow-600 hover:text-yellow-900 mr-3 font-medium">Отклонить</button>}
                                        <button onClick={() => handleDelete(review)} className="text-red-600 hover:text-red-900 font-medium">Удалить</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                 {reviews.length === 0 && <p className="text-center p-8 text-gray-500">Отзывов пока нет.</p>}
            </div>
        </div>
    );
};