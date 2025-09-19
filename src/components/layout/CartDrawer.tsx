import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { ImageWithLoader } from '../ui/ImageWithLoader';

export const CartDrawer = () => {
    const { isCartOpen, toggleCart, cartItems, removeFromCart, updateQuantity, subtotal } = useCart();
    const navigate = useNavigate();

    const handleCheckout = () => {
        toggleCart();
        navigate('/checkout');
    }

    return (
        <>
            <div className={`fixed inset-0 bg-brown-gray bg-opacity-50 z-[90] transition-opacity duration-300 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={toggleCart} aria-hidden="true"></div>
            <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[100] shadow-2xl transform transition-transform duration-500 ease-in-out ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`} role="dialog" aria-modal="true" aria-labelledby="cart-heading">
                <div className="flex flex-col h-full">
                    <div className="flex justify-between items-center p-6 border-b">
                        <h2 id="cart-heading" className="font-sans text-2xl text-brown-gray">Ваша корзина</h2>
                        <button onClick={toggleCart} aria-label="Закрыть корзину" className="btn-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>
                    
                    {cartItems.length === 0 ? (
                        <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
                            <p className="font-serif text-lg">Ваша корзина пуста.</p>
                             <button onClick={toggleCart} className="mt-8 btn btn-primary">
                                Продолжить покупки
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                {cartItems.map(item => (
                                    <div key={item.id} className="flex items-start space-x-4">
                                        <Link to={`/products/${item.id}`} onClick={toggleCart} className="flex-shrink-0 w-24 h-32 bg-gray-200">
                                            <ImageWithLoader src={item.imageUrl} alt={item.name} className="w-full h-full" imageClassName="w-full h-full object-cover" />
                                        </Link>
                                        <div className="flex-grow font-sans">
                                            <Link to={`/products/${item.id}`} onClick={toggleCart}><h3 className="text-lg text-brown-gray hover:underline">{item.name}</h3></Link>
                                            <p className="mt-1 font-bold text-brown-gray">{item.price.toLocaleString('ru-RU')} ₽</p>
                                            <div className="flex items-center mt-3 border w-fit">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 text-lg" aria-label={`Уменьшить количество ${item.name}`}>-</button>
                                                <span className="px-3 py-1" aria-live="polite">{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 text-lg" aria-label={`Увеличить количество ${item.name}`}>+</button>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFromCart(item.id)} className="flex-shrink-0 btn-icon" aria-label={`Удалить ${item.name} из корзины`}>
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <div className="p-6 border-t bg-cream font-sans">
                                <div className="flex justify-between items-center font-bold text-lg">
                                    <span className="text-brown-gray">Итог</span>
                                    <span className="text-brown-gray">{subtotal.toLocaleString('ru-RU')} ₽</span>
                                </div>
                                <p className="text-sm mt-2 text-brown-gray">Доставка и налоги рассчитываются при оформлении заказа.</p>
                                <button
                                    onClick={handleCheckout}
                                    className="block text-center mt-4 btn btn-primary w-full"
                                >
                                    Перейти к оформлению
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
};