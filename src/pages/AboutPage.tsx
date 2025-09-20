import React from 'react';
import { BrandGraphic } from '../components/BrandGraphic';

export const AboutPage = () => (
    <div className="relative overflow-hidden">
        <BrandGraphic />
        <div className="container mx-auto px-6 py-24 fade-in min-h-[80vh]">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
                <div className="md:col-span-1">
                    <h1 className="font-sans text-5xl text-brown-gray md:sticky top-28">Наша философия</h1>
                </div>
                <div className="md:col-span-3">
                    <p className="text-lg leading-relaxed max-w-3xl">
                        Mabon — это гармония наследия и инноваций. Мы создаем фарфор, который превращает повседневную жизнь в искусство благодаря ручной работе и диалогу эпох в каждой детали.
                    </p>

                    <div className="mt-12 border-l-4 border-cream pl-8 py-4">
                        <p className="font-serif text-xl italic text-brown-gray leading-loose relative">
                            «В основе Mabon лежит философия, сотканная из нитей векового <strong className="font-sans not-italic font-bold tracking-wide">наследия и смелых инноваций</strong>. Мы верим, что истинная роскошь не просто видна, но и ощущается — это интимная связь с предметом, созданным с душой. Каждое изделие из фарфора, каждая скульптурная форма — это свидетельство рук, которые его создали, несущее наследие <strong className="font-sans not-italic font-bold tracking-wide">ремесленного мастерства</strong> в современный дом. Наши творения — это не просто предметы; это тихие беседы, эмоциональные якоря в быстро меняющемся мире, приглашающие вас остановиться, оценить красоту и найти искусство в повседневности. Это и есть обещание Mabon: создавать вечные произведения, которые резонируют с личными историями и обогащают полотно повседневной жизни».
                        </p>
                    </div>

                    <div className="mt-16 space-y-12 max-w-3xl">
                        <div>
                            <h2 className="font-sans text-3xl text-brown-gray">Наша миссия</h2>
                            <p className="mt-4 text-base leading-relaxed">
                                Наша миссия — возвращать искусство в повседневность, вдохновлять людей окружать себя вещами с характером и душой. Мы соединяем традиции и современность, сохраняя философию продуманного дизайна и высокого качества. Наши изделия соединяют в себе эстетику и функциональность, где ручная работа сохраняет живую энергетику, а исполнение остается безупречным.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className="font-sans text-3xl text-brown-gray">Наш стиль</h2>
                            <p className="mt-4 text-base leading-relaxed">
                                Мы создаем визуальный диалог между российской и европейской культурой. В наших изделиях на равных присутствуют и эстетика формы, и культурный контекст, обогащая опыт пользователя. Мы воплощаем традиционную роскошь, русский взгляд на европейское наследие и изысканность.
                            </p>
                             <p className="mt-4 text-base leading-relaxed">
                                Ключевые особенности нашего стиля включают сложные цветочные орнаменты, позолоту, рельефные детали и использование фарфора премиум-качества со сложной, но узнаваемой цветовой палитрой. Классические формы европейских брендов — основа нашего стиля.
                            </p>
                        </div>

                        <div>
                            <h2 className="font-sans text-3xl text-brown-gray">Ценности бренда</h2>
                             <ul className="mt-6 space-y-4 list-disc list-inside text-base">
                                <li><span className="font-sans font-bold">Искусство и культура:</span> Мы верим в силу искусства, во взаимодействие и диалог культур.</li>
                                <li><span className="font-sans font-bold">Мастерство:</span> Мы работаем только с высококлассными специалистами, внедряя современные технологии для совершенствования нашего ремесла.</li>
                                <li><span className="font-sans font-bold">Индивидуальность:</span> Каждое изделие — это свидетельство индивидуальности, выполненное вручную и расписанное первоклассными мастерами.</li>
                                <li><span className="font-sans font-bold">Эмоции и душа:</span> Мы создаем предметы, которые вызывают отклик. Их хочется держать в руках, рассматривать, ценить.</li>
                            </ul>
                        </div>

                        <div>
                            <h2 className="font-sans text-3xl text-brown-gray">Контакты</h2>
                             <div className="mt-6 space-y-2 text-base leading-relaxed">
                                <p>
                                    <a href="tel:+79024713728" className="hover:underline transition-colors duration-300">+7(902)471-37-28</a>
                                </p>
                                <p>Нахимовский проспект, 24</p>
                                <p>
                                     <a href="mailto:SALES@FARFOR-PRO.COM" className="hover:underline transition-colors duration-300">SALES@FARFOR-PRO.COM</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
);
