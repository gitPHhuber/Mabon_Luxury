import React, { useMemo } from 'react';
import { useReview } from '../../context/ReviewContext';
import { useData } from '../../context/DataContext';
import { Review } from '../../data/db';
import { StarRating } from '../../components/ui/reviews/StarRating';
import { Pagination } from '../../components/ui/Pagination';
import { usePagination } from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

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
    const reviews = useMemo(() => getAllReviews(), [getAllReviews]);

    const { 
        currentPage, 
        totalPages, 
        paginatedData: paginatedReviews, 
        setCurrentPage 
    } = usePagination(reviews, ITEMS_PER_PAGE);


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
            
            {/* Desktop Table */}
            <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
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
                            {paginatedReviews.map(review => {
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
                                        <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm"><StarRating rating={review.rating} /></td>
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
                </div>
            </div>

             {/* Mobile Card List */}
            <div className="md:hidden space-y-4">
                {paginatedReviews.map(review => {
                    const product = getProductById(review.productId);
                    return (
                        <div key={review.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-gray-900 font-semibold">{review.authorName}</p>
                                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                                </div>
                                <StatusBadge status={review.status} />
                            </div>
                             <div className="mt-2">
                                <StarRating rating={review.rating} />
                            </div>
                            <p className="text-sm mt-2">
                                <span className="font-semibold">Товар: </span>
                                <a href={`/#/products/${product?.id}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">{product?.name || 'Неизвестный товар'}</a>
                            </p>
                            <div className="mt-2 text-sm">
                                <p className="font-bold">{review.title}</p>
                                <p className="text-gray-600 line-clamp-3">{review.text}</p>
                            </div>
                            <div className="flex justify-end space-x-2 mt-4 text-sm font-medium">
                                {review.status !== 'approved' && <button onClick={() => handleStatusChange(review, 'approved')} className="text-green-600 hover:text-green-900">Одобрить</button>}
                                {review.status !== 'rejected' && <button onClick={() => handleStatusChange(review, 'rejected')} className="text-yellow-600 hover:text-yellow-900">Отклонить</button>}
                                <button onClick={() => handleDelete(review)} className="text-red-600 hover:text-red-900">Удалить</button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {reviews.length === 0 && (
                <div className="bg-white rounded-lg shadow-md text-center p-8 text-gray-500">
                    <p>Отзывов пока нет.</p>
                </div>
            )}

            {reviews.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};