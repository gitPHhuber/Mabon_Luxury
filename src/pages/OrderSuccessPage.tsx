import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CartItem } from '../data/db';

export const OrderSuccessPage = () => {
    const location = useLocation();
    const { orderId, orderItems, orderTotal } = location.state || {};
    
    if (!orderId) {
       return (
         <div className="container mx-auto px-6 py-24 text-center fade-in">
            <h1 className="font-sans text-4xl text-brown-gray">Что-то пошло не так</h1>
            <p className="mt-4">Не удалось найти информацию о заказе.</p>
            <Link to="/" className="mt-8 btn btn-primary">
                Вернуться на главную
            </Link>
        </div>
       );
    }
    
    return (
         <div className="container mx-auto px-6 py-24 text-center fade-in">
            <svg className="w-16 h-16 mx-auto text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <h1 className="font-sans text-4xl text-brown-gray mt-6">Спасибо за ваш заказ!</h1>
            <p className="mt-2 text-lg">Ваш заказ <span className="font-bold">{orderId}</span> успешно оформлен.</p>
            <div className="mt-8 max-w-lg mx-auto bg-cream p-6 text-left font-sans">
                 <h2 className="text-xl font-bold text-brown-gray mb-4">Детали заказа</h2>
                 {orderItems.map((item: CartItem) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b border-brown-gray/20">
                         <div>
                            <p className="text-brown-gray">{item.name}</p>
                            <p className="text-sm text-brown-gray">Кол-во: {item.quantity}</p>
                        </div>
                        <p className="font-bold text-brown-gray">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                    </div>
                 ))}
                 <div className="flex justify-between font-bold text-lg text-brown-gray pt-4">
                    <span>Итог</span>
                    <span>{orderTotal.toLocaleString('ru-RU')} ₽</span>
                 </div>
            </div>
            <Link to="/" className="mt-12 btn btn-primary">
                Продолжить покупки
            </Link>
        </div>
    );
};