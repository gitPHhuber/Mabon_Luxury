import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const validateEmail = (email: string) => {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
};

export const SignupPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [emailError, setEmailError] = useState('');
    const { signup } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setEmailError('');
        
        if (!validateEmail(email)) {
            setEmailError('Пожалуйста, введите корректный email.');
            return;
        }

        if (password.length < 6) {
            setError('Пароль должен быть не менее 6 символов.');
            return;
        }
        const result = await signup(name, email, password);
        if (result.success) {
            showNotification('Аккаунт успешно создан!', 'success');
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
        } else {
            if (result.error === 'EMAIL_ALREADY_IN_USE') {
                setError('Пользователь с таким email уже существует.');
            } else {
                setError('Не удалось зарегистрироваться.');
            }
        }
    };

    return (
        <div className="container mx-auto px-6 py-24 flex justify-center fade-in font-sans">
            <div className="w-full max-w-md">
                <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <h1 className="text-center font-sans text-4xl text-brown-gray mb-8">Регистрация</h1>
                    {error && <p className="bg-red-100 text-red-700 p-3 mb-4 text-center">{error}</p>}
                    <div className="mb-4">
                        <label className="block text-brown-gray text-sm font-bold mb-2" htmlFor="name">
                            Имя
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-brown-gray placeholder-brown-gray/70 leading-tight focus:outline-none focus:shadow-outline focus:border-brown-gray"
                            id="name"
                            type="text"
                            placeholder="Ваше имя"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-brown-gray text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-brown-gray placeholder-brown-gray/70 leading-tight focus:outline-none focus:shadow-outline focus:border-brown-gray"
                            id="email"
                            type="email"
                            placeholder="Email"
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
                            Зарегистрироваться
                        </button>
                    </div>
                    <p className="text-center mt-6">
                        Уже есть аккаунт? <Link to="/login" className="font-bold text-brown-gray hover:underline">Войдите</Link>
                    </p>
                </form>
            </div>
        </div>
    );
};