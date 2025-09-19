import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useReview } from '../../context/ReviewContext';

const PlusIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

const ViewIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const AdminDashboardPage = () => {
    const { user } = useAuth();
    const { products, authors } = useData();
    const { getAllReviews } = useReview();
    
    const reviews = getAllReviews();
    const pendingReviewsCount = reviews.filter(r => r.status === 'pending').length;

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800">Добро пожаловать, {user?.name}!</h1>
            <p className="mt-2 text-gray-600">Это ваша панель управления. Отсюда вы можете управлять контентом сайта.</p>

            <section className="mt-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Быстрые действия</h2>
                <div className="flex space-x-4">
                    <Link to="/admin/products/new" className="btn btn-primary">
                        <PlusIcon />
                        Добавить продукт
                    </Link>
                    <Link to="/admin/authors/new" className="btn btn-primary">
                        <PlusIcon />
                        Добавить автора
                    </Link>
                </div>
            </section>
            
            <section className="mt-12">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Обзор</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Продукты</h3>
                            <p className="mt-2 text-4xl font-bold text-brown-gray">{products.length}</p>
                            <p className="text-gray-500">Всего продуктов на сайте</p>
                        </div>
                        <Link to="/admin/products" className="mt-6 flex items-center justify-center bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-200 transition-all duration-300">
                            <ViewIcon />
                            Управлять продуктами
                        </Link>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Авторы</h3>
                            <p className="mt-2 text-4xl font-bold text-brown-gray">{authors.length}</p>
                            <p className="text-gray-500">Всего авторов на сайте</p>
                        </div>
                        <Link to="/admin/authors" className="mt-6 flex items-center justify-center bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-200 transition-all duration-300">
                            <ViewIcon />
                            Управлять авторами
                        </Link>
                    </div>
                     <div className="bg-white p-6 rounded-lg shadow-md flex flex-col justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-700">Отзывы</h3>
                            <p className="mt-2 text-4xl font-bold text-brown-gray">{reviews.length}</p>
                            <p className="text-gray-500">Всего отзывов</p>
                            {pendingReviewsCount > 0 && 
                                <p className="mt-2 text-yellow-600 font-bold animate-pulse">{pendingReviewsCount} в ожидании модерации</p>
                            }
                        </div>
                        <Link to="/admin/reviews" className="mt-6 flex items-center justify-center bg-gray-100 text-gray-800 font-bold py-2 px-4 rounded hover:bg-gray-200 transition-all duration-300">
                            <ViewIcon />
                            Управлять отзывами
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};