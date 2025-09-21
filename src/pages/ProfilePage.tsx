import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };
    
    if (!user) {
        return null;
    }

    return (
        <div className="container mx-auto px-6 py-24 text-center fade-in min-h-[50vh]">
            <h1 className="font-sans text-4xl text-brown-gray">Добро пожаловать, {user.name}!</h1>
            <p className="mt-4 text-lg">Это страница вашего профиля. Здесь вы можете управлять своими данными.</p>
            <p className="mt-2 text-lg">Email: {user.email}</p>
            <button
                onClick={handleLogout}
                className="mt-8 btn btn-primary"
            >
                Выйти
            </button>
        </div>
    );
};