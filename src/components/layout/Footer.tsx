import React from 'react';
import { Link } from 'react-router-dom';

export const Footer = () => (
    <footer className="bg-cream mt-24 fade-in">
        <div className="container mx-auto px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                <div>
                    <h3 className="font-logo text-xl text-brown-gray">MABON</h3>
                    <p className="mt-4 text-sm font-sans">Вечный фарфор, созданный с душой.</p>
                </div>
                <div>
                    <h4 className="font-sans uppercase tracking-wider font-bold">Магазин</h4>
                    <ul className="mt-4 space-y-2 text-sm font-sans">
                        <li><Link to="/collections" className="hover:underline">Коллекции</Link></li>
                        <li><Link to="/authors" className="hover:underline">Авторы</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-sans uppercase tracking-wider font-bold">О нас</h4>
                     <ul className="mt-4 space-y-2 text-sm font-sans">
                        <li><Link to="/about" className="hover:underline">Наша история</Link></li>
                        <li><a href="#" className="hover:underline">Контакты</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-sans uppercase tracking-wider font-bold">Следите за нами</h4>
                     <ul className="mt-4 space-y-2 text-sm font-sans">
                        <li><a href="#" className="hover:underline">Инстаграм</a></li>
                        <li><a href="#" className="hover:underline">Pinterest</a></li>
                    </ul>
                </div>
            </div>
            <div className="mt-12 border-t border-brown-gray border-opacity-20 pt-8 text-center text-sm font-sans">
                <p>&copy; {new Date().getFullYear()} Mabon. Все права защищены.</p>
            </div>
        </div>
    </footer>
);