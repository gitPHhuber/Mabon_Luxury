import React, { useState, useEffect } from 'react';
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
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: ''
    });

    const [cardDetails, setCardDetails] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    const [cardErrors, setCardErrors] = useState({
        number: '',
        expiry: '',
        cvc: ''
    });

    useEffect(() => {
        if (cartItems.length === 0 && !isProcessing) {
            navigate('/');
        }
    }, [cartItems, isProcessing, navigate]);

    const payWithSBP = async (items: typeof cartItems, email: string) => {
        const payload = {
            items: items.map(item => ({ price: item.price, qty: item.quantity })),
            email,
        };

        const response = await fetch('/api/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        let data: { redirectUrl?: string; error?: unknown } | null = null;
        try {
            data = await response.json();
        } catch (err) {
            console.error('Failed to parse create-payment response', err);
        }

        if (!response.ok) {
            const errorMessage =
                (typeof data?.error === 'string' && data.error) ||
                (data?.error && typeof (data.error as { message?: string }) === 'object' && (data.error as { message?: string }).message) ||
                (data && 'message' in data && typeof data.message === 'string' ? data.message : null) ||
                'Не удалось создать платёж. Попробуйте ещё раз.';
            throw new Error(errorMessage);
        }

        const redirectUrl = data?.redirectUrl;
        if (!redirectUrl) {
            throw new Error('Не удалось получить ссылку на оплату. Попробуйте позже.');
        }

        window.location.href = redirectUrl;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCardInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { name, value } = e.target;
        setCardErrors(prev => ({ ...prev, [name]: '' })); // Clear error on change

        let processedValue = value.replace(/\D/g, '');

        if (name === 'number') {
            processedValue = processedValue.substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
        } else if (name === 'expiry') {
            if (processedValue.length > 2) {
                processedValue = `${processedValue.substring(0, 2)}/${processedValue.substring(2, 4)}`;
            }
        } else if (name === 'cvc') {
            processedValue = processedValue.substring(0, 3);
        }
        
        setCardDetails(prev => ({...prev, [name]: processedValue}));
    };

    const validateCardDetails = () => {
        const errors = { number: '', expiry: '', cvc: '' };
        const { number, expiry, cvc } = cardDetails;

        if (number.replace(/\s/g, '').length !== 16) {
            errors.number = 'Номер карты должен состоять из 16 цифр.';
        }
        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry)) {
            errors.expiry = 'Неверный формат даты (ММ/ГГ).';
        } else {
            const [month, year] = expiry.split('/');
            const currentYear = new Date().getFullYear() % 100;
            const currentMonth = new Date().getMonth() + 1;
            if (Number(year) < currentYear || (Number(year) === currentYear && Number(month) < currentMonth)) {
                errors.expiry = 'Срок действия карты истек.';
            }
        }
        if (cvc.length !== 3) {
            errors.cvc = 'CVC должен состоять из 3 цифр.';
        }

        setCardErrors(errors);
        return Object.values(errors).every(e => !e);
    }
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (Object.values(formData).some(val => val === '')) {
            alert('Пожалуйста, заполните все контактные данные и адрес.');
            return;
        }
        
        if (paymentMethod === 'card' && !validateCardDetails()) {
            return;
        }

        setIsProcessing(true);

        if (paymentMethod === 'sbp') {
            try {
                await payWithSBP(cartItems, formData.email);
            } catch (error) {
                console.error(error);
                const message = error instanceof Error ? error.message : 'Не удалось создать платёж. Попробуйте ещё раз.';
                alert(message);
                setIsProcessing(false);
            }
            return;
        }

        setTimeout(() => {
            setIsProcessing(false);
            clearCart();
            navigate('/checkout/success');
        }, 3000);
    };

    const ProcessingModal = () => (
        <div className="fixed inset-0 bg-brown-gray bg-opacity-70 z-[110] flex items-center justify-center font-sans fade-in">
            <div className="bg-white p-8 rounded-lg text-center max-w-sm w-full">
                <h3 className="text-2xl font-bold text-brown-gray mb-4">Обработка платежа</h3>
                <div className="flex items-center justify-center text-brown-gray">
                    <svg className="animate-spin h-8 w-8 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Пожалуйста, подождите...</span>
                </div>
            </div>
        </div>
    );
    
    if (cartItems.length === 0) return null;

    return (
        <div className="container mx-auto px-6 py-12 fade-in">
            {isProcessing && paymentMethod === 'card' && <ProcessingModal />}
            <h1 className="text-center font-sans text-5xl text-brown-gray mb-12">Оформление заказа</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <form onSubmit={handleSubmit} className="font-sans">
                    <div>
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Контактные данные</h2>
                        <div className="space-y-4">
                            <input type="text" name="name" placeholder="ФИО" required value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                            <input type="email" name="email" placeholder="Email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                            <input type="tel" name="phone" placeholder="Телефон" required onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                        </div>
                    </div>
                    <div className="mt-10">
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Доставка</h2>
                        <input type="text" name="address" placeholder="Адрес доставки" required onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"/>
                    </div>
                     <div className="mt-10">
                        <h2 className="text-2xl font-bold text-brown-gray mb-6">Способ оплаты</h2>
                        <div className="space-y-4">
                            <label className={`flex items-center p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'sbp' ? 'border-brown-gray ring-2 ring-brown-gray' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input type="radio" name="paymentMethod" value="sbp" checked={paymentMethod === 'sbp'} onChange={() => setPaymentMethod('sbp')} className="h-4 w-4 text-brown-gray focus:ring-brown-gray"/>
                                <span className="ml-4 text-brown-gray">СБП (QR-код)</span>
                            </label>
                            <label className={`flex items-center p-4 border rounded cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-brown-gray ring-2 ring-brown-gray' : 'border-gray-300 hover:border-gray-400'}`}>
                                <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="h-4 w-4 text-brown-gray focus:ring-brown-gray"/>
                                <span className="ml-4 text-brown-gray">Банковская карта</span>
                            </label>
                        </div>
                    </div>
                    {paymentMethod === 'card' && (
                        <div className="mt-6 p-6 border border-gray-200 rounded-lg space-y-4 fade-in">
                            <h3 className="font-bold text-lg text-brown-gray">Данные карты</h3>
                            <div>
                                <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">Номер карты</label>
                                <input 
                                    id="card-number"
                                    name="number"
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    value={cardDetails.number}
                                    onChange={handleCardInputChange}
                                    maxLength={19}
                                    className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"
                                    required
                                />
                                {cardErrors.number && <p className="text-red-500 text-xs mt-1">{cardErrors.number}</p>}
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-1">Срок действия</label>
                                    <input
                                        id="card-expiry"
                                        name="expiry"
                                        type="text"
                                        placeholder="ММ/ГГ"
                                        value={cardDetails.expiry}
                                        onChange={handleCardInputChange}
                                        maxLength={5}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"
                                        required
                                    />
                                    {cardErrors.expiry && <p className="text-red-500 text-xs mt-1">{cardErrors.expiry}</p>}
                                </div>
                                <div className="flex-1">
                                    <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                                    <input
                                        id="card-cvc"
                                        name="cvc"
                                        type="password"
                                        placeholder="123"
                                        value={cardDetails.cvc}
                                        onChange={handleCardInputChange}
                                        maxLength={3}
                                        className="w-full p-3 border border-gray-300 rounded focus:ring-brown-gray focus:border-brown-gray text-brown-gray placeholder-brown-gray/70"
                                        required
                                    />
                                    {cardErrors.cvc && <p className="text-red-500 text-xs mt-1">{cardErrors.cvc}</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    <button 
                        type="submit"
                        disabled={isProcessing}
                        className="mt-8 btn btn-primary w-full disabled:opacity-50 disabled:cursor-wait"
                    >
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