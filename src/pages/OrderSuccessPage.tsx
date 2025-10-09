import React from 'react';
import { useLocation, Link } from 'react-router-dom';

export const OrderSuccessPage = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderId = params.get('o');

    return (
        <div className="container mx-auto px-6 py-24 text-center fade-in">
            <svg className="w-16 h-16 mx-auto text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="font-sans text-4xl text-brown-gray mt-6">Оплата выполняется…</h1>
            {orderId && (
                <p className="mt-4 text-lg text-brown-gray">
                    Номер вашего заказа: <span className="font-bold">{orderId}</span>
                </p>
            )}
            <p className="mt-6 text-brown-gray">
                После подтверждения оплаты мы отправим ваш заказ и уведомление на указанную почту.
            </p>
            <Link to="/" className="mt-12 btn btn-primary">
                Вернуться на главную
            </Link>
        </div>
    );
};