import React from 'react';
import { BrandGraphic } from '../components/BrandGraphic';

export const ContactsPage = () => (
    <div className="relative overflow-hidden">
        <BrandGraphic />
        <div className="container mx-auto px-6 py-24 fade-in min-h-[60vh] flex flex-col items-center justify-center text-center">
            <div className="max-w-2xl">
                <h1 className="font-sans text-5xl text-brown-gray">Контакты</h1>
                <p className="mt-8 text-lg leading-relaxed">
                    Тут могли быть ваши контакты
                </p>
                 <div className="mt-12 space-y-4 text-base leading-relaxed">
                    <p className="font-sans font-bold text-xl">Связаться с разработчиком:</p>
                    <a 
                        href="https://t.me/BrawlikSoul" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn btn-primary"
                    >
                        Telegram @BrawlikSoul
                    </a>
                </div>
            </div>
        </div>
    </div>
);