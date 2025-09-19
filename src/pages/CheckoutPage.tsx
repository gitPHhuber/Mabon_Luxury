import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { ImageWithLoader } from '../components/ui/ImageWithLoader';

export const CheckoutPage = () => {
    const { cartItems, subtotal, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [paymentMethod, setPaymentMethod] = useState('sbp');
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSbpModal, setShowSbpModal] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });
    const orderId = useMemo(() => `MBN-${Date.now()}`, []);

    useEffect(() => {
        if (cartItems.length === 0 && !isProcessing) {
            navigate('/');
        }
    }, [cartItems, isProcessing, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formData).some(val => val === '')) {
            alert('Пожалуйста, заполните все контактные данные и адрес.');
            return;
        }

        setIsProcessing(true);
        if (paymentMethod === 'sbp') {
            setShowSbpModal(true);
            setTimeout(() => {
                setShowSbpModal(false);
                clearCart();
                navigate('/order-success', { state: { orderId: orderId, orderItems: cartItems, orderTotal: subtotal } });
            }, 5000);
        } else {

            setTimeout(() => {
                setIsProcessing(false);
                clearCart();
                navigate('/order-success', { state: { orderId: orderId, orderItems: cartItems, orderTotal: subtotal } });
            }, 3000);
        }
    };
    
    const SbpModal = () => (
         <div className="fixed inset-0 bg-brown-gray bg-opacity-70 z-[110] flex items-center justify-center font-sans fade-in">
            <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full">
                <h3 className="text-2xl font-bold text-brown-gray mb-4">Оплата через СБП</h3>
                <p className="text-brown-gray mb-4">Отсканируйте QR-код в приложении вашего банка для оплаты.</p>
                <div className="w-48 h-48 mx-auto my-4 bg-gray-100 p-2 border text-brown-gray">
                    <svg viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M110 110h36v36h-36z"/><path fill="currentColor" d="M0 0h90v90H0zm10 10v70h70V10z"/><path fill="currentColor" d="M30 30h30v30H30z"/><path fill="currentColor" d="M166 0h90v90h-90zm10 10v70h70V10z"/><path fill="currentColor" d="M196 30h30v30h-30z"/><path fill="currentColor" d="M0 166h90v90H0zm10 10v70h70v-70z"/><path fill="currentColor" d="M30 196h30v30H30z"/><path fill="currentColor" d="M166 110h10v10h-10zm-36 0h10v10h-10zm-10 10h10v10h-10zm-10-20h10v10h-10zm-10 10h10v10h-10zm0 10h10v10h-10zm-10 10h10v10h-10zm-10-20h10v10h-10zm10-10h10v10h-10zm-30 0h10v10h-10zm10-10h10v10h-10zm-10-10h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm-50-10h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm10 0h10v10h-10zm10 0h10v10h-10zm10 0h10v10h-10zm10 0h10v10h-10zm36 0h10v10h-10zm-10-10h10v10h-10zm-10-10h10v10h-10zm-10 10h10v10h-10zm-10-10h10v10h-10zm0 10h10v10h-10zm10 10h10v10h-10zm10 0h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm10 10h10v10h-10zm10-10h10v10h-10zm10 10h10v10h-10zm10 10h10v10h-10zm0-30h10v10h-10zm0 10h10v10h-10zm10 10h10v10h-10zm10-10h10v10h-10zm10-10h10v10h-10zm0 10h10v10h-10zm-36 26h10v10h-10zm-10 10h10v10h-10zm-10 10h10v10h-10zm-10 10h10v10h-10zm-10-10h10v10h-10zm-10-10h10v10h-10zm-10-10h10v10h-10zm-10 0h10v10h-10zm-10-10h10v10h-10zm10-10h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm10 10h10v10h-10zm10 10h10v10h-10zm0 10h10v10h-10zm0 10h10v10h-10zm10-10h10v10h-10zm10 0h10v10h-10zm10-10h10v10h-10zm-36 26h10v10h-10zm10 10h10v10h-10zm-20 0h10v10h-10zm10 10h10v10h-10zm0-30h10v10h-10z"/></svg>
                </div>
                <div className="flex items-center justify-center text-brown-gray">
                    <svg className="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    <span>Ожидаем подтверждения...</span>
                </div>
            </div>
        </div>
    );
    
    if (cartItems.length === 0) return null;

    return (
        <div className="container mx-auto px-6 py-12 fade-in">
            {isProcessing && showSbpModal && <SbpModal />}
            <h1 className="text-center font-sans text-5xl text-brown-gray mb-12">Оформление заказа</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <form onSubmit={handleSubmit} className="font-sans">
                    <div>
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Контактные данные</h2>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="ФИО" required value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                            <input type="tel" name="phone" placeholder="Телефон" required onChange={handleInputChange} className="w-full p-3 border border-gray-300 focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Доставка</h2>
                        <input type="text" name="address" placeholder="Адрес доставки" required onChange={handleInputChange} className="w-full p-3 border border-gray-300 focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                    </div>
                     <div className="mt-10">
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Способ оплаты</h2>
                        <div className="space-y-4">
                            <label className={`flex items-center p-4 border cursor-pointer ${paymentMethod === 'sbp' ? 'border-brown-gray ring-2 ring-brown-gray' : 'border-gray-300'}`}>
                                <input type="radio" name="paymentMethod" value="sbp" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} className="h-4 w-4 text-brown-gray focus:ring-brown-gray"/>
                                <span className="ml-4 text-brown-gray">СБП (QR-код)</span>
                            </label>
                            <label className={`flex items-center p-4 border cursor-pointer ${paymentMethod === 'card' ? 'border-brown-gray ring-2 ring-brown-gray' : 'border-gray-300'}`}>
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-brown-gray focus:ring-brown-gray"/>
                                <span className="ml-4 text-brown-gray">Банковская карта (макет)</span>
                            </label>
                        </div>
                    </div>
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="mt-8 btn btn-primary w-full">
                        {isProcessing ? 'Обработка...' : 'Оплатить'}
                    </button>
                </form>
                <div className="bg-cream p-8">
                    <h2 className="text-2xl font-bold text-brown-gray mb-6 font-sans">Ваш заказ</h2>
                    <div className="space-y-4">
                        {cartItems.map(item => (
                            <div key={item.id} className="flex justify-between items-center">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-20 bg-gray-200 flex-shrink-0">
                                        <ImageWithLoader src={item.imageUrl} alt={item.name} className="w-full h-full" imageClassName="w-full h-full object-cover"/>
                                    </div>
                                    <div>
                                        <p className="font-sans text-brown-gray">{item.name}</p>
                                        <p className="font-sans text-sm text-brown-gray">Кол-во: {item.quantity}</p>
                                    </div>
                                </div>
                                <p className="font-sans font-bold text-brown-gray">{(item.price * item.quantity).toLocaleString('ru-RU')} ₽</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 pt-4 border-t border-brown-gray/20 space-y-2 font-sans">
                        <div className="flex justify-between">
                            <span>Подытог</span>
                            <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                        </div>
                         <div className="flex justify-between">
                            <span>Доставка</span>
                            <span>Бесплатно</span>
                        </div>
                         <div className="flex justify-between font-bold text-lg text-brown-gray pt-2">
                            <span>Итог</span>
                            <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};