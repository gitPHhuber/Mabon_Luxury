import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Pagination } from '../../components/ui/Pagination';
import { useConfirmationModal } from '../../context/ConfirmationModalContext';
import { ImageWithLoader } from '../../components/ui/ImageWithLoader';
import { usePagination } from '../../hooks/usePagination';

const ITEMS_PER_PAGE = 10;

export const ManageAuthorsPage = () => {
    const { authors, deleteAuthor } = useData();
    const { showConfirmation } = useConfirmationModal();

    const sortedAuthors = useMemo(() => 
        [...authors].sort((a, b) => a.name.localeCompare(b.name)),
        [authors]
    );

    const { 
        currentPage, 
        totalPages, 
        paginatedData: paginatedAuthors, 
        setCurrentPage 
    } = usePagination(sortedAuthors, ITEMS_PER_PAGE);


    const handleDelete = (id: string, name: string) => {
        showConfirmation(
            'Подтвердите удаление',
            `Вы уверены, что хотите навсегда удалить автора "${name}"? Это действие нельзя отменить.`,
            () => {
                deleteAuthor(id);
            }
        );
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Управление авторами</h1>
                <Link to="/admin/authors/new" className="btn btn-primary">
                    Добавить автора
                </Link>
            </div>

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full leading-normal">
                        <thead>
                            <tr>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Автор
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Биография
                                </th>
                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedAuthors.map(author => (
                                <tr key={author.id}>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 w-12 h-12">
                                                <ImageWithLoader src={author.imageUrl} alt={author.name} imageClassName="w-full h-full rounded-full object-cover" />
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-gray-900 whitespace-no-wrap font-semibold">{author.name}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                        <p className="text-gray-900 whitespace-no-wrap max-w-lg truncate" title={author.bio}>{author.bio}</p>
                                    </td>
                                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right whitespace-nowrap space-x-2">
                                        <Link to={`/admin/authors/edit/${author.id}`} className="btn btn-secondary btn-sm">
                                            Редактировать
                                        </Link>
                                        <button onClick={() => handleDelete(author.id, author.name)} className="btn btn-danger btn-sm">
                                            Удалить
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                 {authors.length === 0 && (
                    <p className="text-center p-8 text-gray-500">Авторов пока нет. <Link to="/admin/authors/new" className="text-indigo-600 hover:underline">Добавить первого автора</Link>.</p>
                )}
            </div>
             {authors.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            )}
        </div>
    );
};