import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModalProvider } from '../../context/ConfirmationModalContext';

export const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200";
    const activeLinkClasses = "bg-brown-gray text-white hover:bg-brown-gray";

    return (
        <ConfirmationModalProvider>
            <div className="flex h-screen bg-gray-100 font-sans">
                <aside className="w-64 bg-white shadow-md flex-shrink-0">
                    <div className="p-6">
                        <NavLink to="/" className="font-logo text-3xl font-bold tracking-widest text-brown-gray">MABON</NavLink>
                        <p className="text-sm text-gray-500 mt-1">Панель администратора</p>
                    </div>
                    <nav className="mt-6 px-4 space-y-2">
                        <NavLink to="/admin/dashboard" end className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <span className="mx-4">Главная</span>
                        </NavLink>
                        <NavLink to="/admin/products" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <span className="mx-4">Продукты</span>
                        </NavLink>
                        <NavLink to="/admin/authors" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <span className="mx-4">Авторы</span>
                        </NavLink>
                        <NavLink to="/admin/reviews" className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                            <span className="mx-4">Отзывы</span>
                        </NavLink>
                    </nav>
                    <div className="absolute bottom-0 w-64 p-4 border-t">
                        <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200">
                            <span className="mx-4">Выйти</span>
                        </button>
                    </div>
                </aside>
                <main className="flex-1 overflow-y-auto p-8">
                    <div className="container mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </ConfirmationModalProvider>
    );
};