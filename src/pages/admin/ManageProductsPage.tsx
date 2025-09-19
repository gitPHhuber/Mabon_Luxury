import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Pagination } from '../../components/ui/Pagination';
import { useConfirmationModal } from '../../context/ConfirmationModalContext';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import { usePagination } from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

export const ManageProductsPage = () => {
    const { products, deleteProduct } = useData();
    const { showConfirmation } = useConfirmationModal();

    const sortedProducts = useMemo(() => 
        [...products].sort((a, b) => parseInt(b.id.replace('p', '')) - parseInt(a.id.replace('p', ''))), 
        [products]
    );
    
    const { 
        currentPage, 
        totalPages, 
        paginatedData: paginatedProducts, 
        setCurrentPage 
    } = usePagination(sortedProducts, ITEMS_PER_PAGE);

    const handleDelete = (id: string, name: string) => {
        showConfirmation(
            'Подтвердите удаление',
            `Вы уверены, что хотите навсегда удалить продукт "${name}"? Это действие нельзя отменить.`,
            () => {
                deleteProduct(id);
            }
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Управление продуктами</h1>
                <Link to="/admin/products/new" className="btn btn-primary">
                    Добавить продукт
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Продукт
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Цена
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Коллекция
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Избранный
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedProducts.map(product => (
                                <tr key={product.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-16 h-20">
                                                <ImageWithLoader src={product.imageUrl} alt={product.name} imageClassName="w-full h-full object-cover" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap font-semibold">{product.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.price.toLocaleString('ru-RU')} ₽</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap">{product.collection}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center">
                                        {product.isFeatured && (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400 mx-auto" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        )}
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right whitespace-nowrap space-x-2">
                                        <Link to={`/admin/products/edit/${product.id}`} className="btn btn-secondary btn-sm">
                                            Редактировать
                                        </Link>
                                        <button onClick={() => handleDelete(product.id, product.name)} className="btn btn-danger btn-sm">
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {products.length === 0 && (
                    <p className="text-center p-8 text-gray-500">Продуктов пока нет. <Link to="/admin/products/new" className="text-indigo-600 hover:underline">Добавить первый продукт</Link>.</p>
                )}
            </div>

            {products.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};