import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ConfirmationModalProvider } from '../../context/ConfirmationModalContext';

const MenuIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
);

export const AdminLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const linkClasses = "flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200";
    const activeLinkClasses = "bg-brown-gray text-white hover:bg-brown-gray";

    const SidebarContent = () => (
        <>
            <div className="p-6">
                <NavLink to="/" className="font-logo text-3xl font-bold tracking-widest text-brown-gray">MABON</NavLink>
                <p className="text-sm text-gray-500 mt-1">Панель администратора</p>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                <NavLink to="/admin/dashboard" end onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <span className="mx-4">Главная</span>
                </NavLink>
                <NavLink to="/admin/products" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <span className="mx-4">Продукты</span>
                </NavLink>
                <NavLink to="/admin/authors" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <span className="mx-4">Авторы</span>
                </NavLink>
                <NavLink to="/admin/reviews" onClick={() => setIsSidebarOpen(false)} className={({isActive}) => `${linkClasses} ${isActive ? activeLinkClasses : ''}`}>
                    <span className="mx-4">Отзывы</span>
                </NavLink>
            </nav>
            <div className="absolute bottom-0 w-64 p-4 border-t">
                <button onClick={handleLogout} className="w-full text-left flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200">
                    <span className="mx-4">Выйти</span>
                </button>
            </div>
        </>
    );

    return (
        <ConfirmationModalProvider>
            <div className="flex h-screen bg-gray-100 font-sans">
                {/* Mobile Sidebar Overlay */}
                <div 
                    className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                    onClick={() => setIsSidebarOpen(false)}
                ></div>

                {/* Sidebar */}
                <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow-md flex-shrink-0 z-30 transform transition-transform md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                    <SidebarContent />
                </aside>

                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Mobile Header */}
                    <header className="md:hidden bg-white shadow-md">
                        <div className="flex justify-between items-center px-4 py-2">
                            <button onClick={() => setIsSidebarOpen(true)} className="text-gray-500 focus:outline-none focus:text-gray-700">
                                <MenuIcon />
                            </button>
                            <h2 className="text-lg font-semibold text-gray-800">Mabon Admin</h2>
                        </div>
                    </header>
                    <main className="flex-1 overflow-y-auto p-4 md:p-8">
                        <div className="container mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </ConfirmationModalProvider>
    );
};