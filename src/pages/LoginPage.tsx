import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const validateEmail = (email: string) => {

    if (email.toLowerCase() === 'admin') return true;
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const { login, user } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setEmailError('');

        if (!validateEmail(email)) {
            setEmailError('Пожалуйста, введите корректный email или имя пользователя.');
            return;
        }

        const result = await login(email, password);
        if (result.success) {
            showNotification('С возвращением!', 'success');
            const targetRoute = from === "/login" ? (email === 'admin' ? '/admin' : '/') : from;
            setTimeout(() => {
                navigate(targetRoute, { replace: true });
            }, 1500);
        } else {
            if (result.error === 'USER_NOT_FOUND') {
                setError('Пользователь не найден.');
            } else if (result.error === 'INCORRECT_PASSWORD') {
                setError('Неверный пароль.');
            } else {
                setError('Произошла ошибка входа.');
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 flex justify-center fade-in font-sans">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-center font-sans text-4xl text-brown-gray mb-8">Вход</h1>
                    {error && <p className="bg-red-100 text-red-700 p-3 mb-4 text-center">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-brown-gray text-sm font-bold mb-2" htmlFor="email">
                            Email или Имя пользователя
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-brown-gray placeholder-brown-gray/70 leading-tight focus:outline-none focus:shadow-outline focus:border-brown-gray"
                            id="email"
                            type="text"
                            placeholder="Email или admin"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        {emailError && <p className="text-red-500 text-xs italic mt-2">{emailError}</p>}
                    </div>
                    <div className="mb-6">
                        <label className="block text-brown-gray text-sm font-bold mb-2" htmlFor="password">
                            Пароль
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-brown-gray placeholder-brown-gray/70 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:border-brown-gray"
                            id="password"
                            type="password"
                            placeholder="******************"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button className="btn btn-primary w-full !py-2" type="submit">
                            Войти
                        </button>
                    </div>
                     <p className="text-center mt-6">
                        Нет аккаунта? <Link to="/signup" className="font-bold text-brown-gray hover:underline">Создайте</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};