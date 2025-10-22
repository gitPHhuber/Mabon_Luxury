import React from 'react';

export const CookieConsentBanner = ({ onConsent }: { onConsent: (consent: boolean) => void}) => (
    <div className="fixed bottom-0 left-0 right-0 bg-cream p-4 shadow-lg z-[100] flex justify-center items-center fade-in-up font-sans">
        <p className="text-sm text-brown-gray mr-4">Мы используем файлы cookie, чтобы запомнить вашу корзину. Вы согласны?</p>
        <button onClick={() => onConsent(true)} className="btn btn-primary !py-2 !px-4 !text-sm">Принять</button>
        <button onClick={() => onConsent(false)} className="btn btn-text !text-sm ml-2">Отклонить</button>
    </div>
);