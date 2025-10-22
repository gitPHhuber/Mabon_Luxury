import React from 'react';
import { BrandGraphic } from '../components/BrandGraphic';

export const ContactsPage = () => (
    <div className="relative overflow-hidden">
        <BrandGraphic />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 fade-in min-h-[60vh] flex items-center">
            <div className="grid w-full gap-x-8 lg:gap-x-10 grid-cols-4 md:grid-cols-8 lg:grid-cols-12 xl:[grid-template-columns:repeat(16,minmax(0,1fr))]">
                <div className="text-center xl:col-span-8 xl:col-start-5 lg:col-span-8 lg:col-start-3 md:col-span-6 md:col-start-2 col-span-4">
                    <div className="max-w-2xl mx-auto">
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
        </div>
    </div>
);