import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CSSTransition } from 'react-transition-group';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { Product, Author } from '../../data/db';
import { ImageWithLoader } from '../ui/ImageWithLoader';

export const Header = () => {
    const { toggleCart, cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const { user, logout } = useAuth();
    const { products, authors } = useData();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const [suggestions, setSuggestions] = useState<{ products: Product[], authors: Author[] }>({ products: [], authors: [] });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    const searchContainerRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);
    const mobileMenuOverlayRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    
    const [isInitialLoad] = useState(() => !sessionStorage.getItem('logoAnimated'));

    useEffect(() => {
      if (isInitialLoad) {
        sessionStorage.setItem('logoAnimated', 'true');
      }
    }, [isInitialLoad]);
    
    useEffect(() => {
        setHasMounted(true);
    }, []);

    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('menu-open');
        } else {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('menu-open');
        }
        return () => {
            document.body.style.overflow = 'auto';
            document.body.classList.remove('menu-open');
        };
    }, [isMobileMenuOpen]);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSuggestions({ products: [], authors: [] });
            setIsDropdownOpen(false);
            return;
        }

        const handler = setTimeout(() => {
            const lowercasedQuery = searchQuery.toLowerCase();
            const foundProducts = products.filter(p =>
                p.name.toLowerCase().includes(lowercasedQuery) ||
                p.description.toLowerCase().includes(lowercasedQuery) ||
                p.collection.toLowerCase().includes(lowercasedQuery)
            ).slice(0, 5);

            const foundAuthors = authors.filter(a =>
                a.name.toLowerCase().includes(lowercasedQuery) ||
                a.bio.toLowerCase().includes(lowercasedQuery)
            ).slice(0, 3);

            const hasResults = foundProducts.length > 0 || foundAuthors.length > 0;
            setSuggestions({ products: foundProducts, authors: foundAuthors });
            setIsDropdownOpen(hasResults);
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, products, authors]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const trimmedQuery = searchQuery.trim();
        if (trimmedQuery) {
            navigate(`/search?q=${encodeURIComponent(trimmedQuery)}`);
            setSearchQuery('');
            setIsDropdownOpen(false);
            setIsMobileMenuOpen(false);
        }
    };
    
    const handleSuggestionClick = () => {
        setSearchQuery('');
        setIsDropdownOpen(false);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };
    
    const handleMenuLinkClick = () => {
        setIsMobileMenuOpen(false);
    };
    
    const handleLogoutAndCloseMenu = () => {
        handleLogout();
        handleMenuLinkClick();
    };
    
    return (
        <header className="sticky top-0 z-50 bg-white bg-opacity-95 backdrop-blur-md fade-in">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link to="/" onClick={handleMenuLinkClick} className={`font-logo text-3xl font-bold tracking-widest text-brown-gray ${isInitialLoad ? 'animate-logo-fade-in' : ''}`}>MABON</Link>
                
                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-4 md:space-x-6">
                    <div className="flex items-center space-x-8 font-sans">
                        <Link to="/collections" className="text-sm uppercase tracking-wider text-brown-gray hover:underline">Коллекции</Link>
                        <Link to="/authors" className="text-sm uppercase tracking-wider text-brown-gray hover:underline">Авторы</Link>
                        <Link to="/about" className="text-sm uppercase tracking-wider text-brown-gray hover:underline">О нас</Link>
                        <Link to="/contacts" className="text-sm uppercase tracking-wider text-brown-gray hover:underline">Контакты</Link>
                    </div>
                     <div ref={searchContainerRef} className="relative">
                        <form onSubmit={handleSearchSubmit}>
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={() => searchQuery.length >= 2 && setIsDropdownOpen(true)}
                                placeholder="Поиск..."
                                className="w-32 md:w-40 px-4 py-1.5 border border-gray-300 rounded-full text-sm text-brown-gray placeholder-brown-gray/70 focus:outline-none focus:ring-1 focus:ring-brown-gray focus:border-brown-gray transition-all duration-300"
                                aria-label="Поиск по сайту"
                            />
                             <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-brown-gray transition-opacity hover:opacity-80" aria-label="Начать поиск">
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </form>
                        {isDropdownOpen && (
                            <div className="absolute top-full mt-2 w-80 bg-white rounded-md shadow-lg z-10 max-h-96 overflow-y-auto text-left font-sans">
                                {suggestions.products.length > 0 && (
                                    <div>
                                        <h4 className="text-xs uppercase text-brown-gray tracking-wider px-4 py-2 bg-cream">Товары</h4>
                                        <ul>
                                            {suggestions.products.map(product => (
                                                <li key={product.id}>
                                                    <Link to={`/products/${product.id}`} onClick={handleSuggestionClick} className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200">
                                                        <ImageWithLoader src={product.imageUrl} alt={product.name} className="w-12 h-16 mr-4 flex-shrink-0 bg-gray-200" imageClassName="w-full h-full object-cover" />
                                                        <div>
                                                            <p className="text-sm text-brown-gray font-bold leading-tight">{product.name}</p>
                                                            <p className="text-xs text-brown-gray mt-1">{product.price.toLocaleString('ru-RU')} ₽</p>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                {suggestions.authors.length > 0 && (
                                     <div>
                                        <h4 className="text-xs uppercase text-brown-gray tracking-wider px-4 py-2 bg-cream border-t border-gray-200">Авторы</h4>
                                        <ul>
                                            {suggestions.authors.map(author => (
                                                <li key={author.id}>
                                                    <Link to={`/authors/${author.id}`} onClick={handleSuggestionClick} className="flex items-center p-3 hover:bg-gray-100 transition-colors duration-200">
                                                        <ImageWithLoader src={author.imageUrl} alt={author.name} className="w-10 h-10 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-200" imageClassName="w-full h-full object-cover" />
                                                        <p className="text-sm text-brown-gray font-bold">{author.name}</p>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                                <Link to={`/search?q=${encodeURIComponent(searchQuery)}`} onClick={handleSuggestionClick} className="block text-center font-bold text-sm py-3 bg-gray-50 hover:bg-gray-100 text-brown-gray transition-colors duration-200 border-t border-gray-200">
                                    Показать все результаты
                                </Link>
                            </div>
                        )}
                    </div>
                    {user ? (
                        <div ref={profileRef} className="relative">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="btn-icon" aria-label="Открыть меню профиля">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 font-sans text-left">
                                    <div className="p-3 border-b">
                                        <p className="text-sm text-brown-gray font-bold truncate">Привет, {user.name}</p>
                                    </div>
                                    {user.name === 'admin' && (
                                         <Link to="/admin" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-brown-gray hover:bg-gray-100 font-bold">Панель администратора</Link>
                                    )}
                                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="block px-4 py-2 text-sm text-brown-gray hover:bg-gray-100">Профиль</Link>
                                    <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-brown-gray hover:bg-gray-100">Выйти</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm uppercase tracking-wider text-brown-gray hover:underline font-sans">Войти</Link>
                    )}
                    <Link to="/wishlist" className="relative group btn-icon" aria-label={`Открыть избранное с ${wishlistCount} товарами`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.664l1.318-1.346a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                        {wishlistCount > 0 && (
                             <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{wishlistCount}</span>
                        )}
                    </Link>
                    <button onClick={toggleCart} className="relative group btn-icon" aria-label={`Открыть корзину с ${cartCount} товарами`}>
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                             <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{cartCount}</span>
                        )}
                    </button>
                </nav>

                {/* Mobile Icons & Hamburger */}
                <div className="flex items-center space-x-2 md:hidden">
                    <Link to="/wishlist" className="relative group btn-icon" aria-label={`Открыть избранное с ${wishlistCount} товарами`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.664l1.318-1.346a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                        {wishlistCount > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{wishlistCount}</span>}
                    </Link>
                    <button onClick={toggleCart} className="relative group btn-icon" aria-label={`Открыть корзину с ${cartCount} товарами`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{cartCount}</span>}
                    </button>
                    <button onClick={() => setIsMobileMenuOpen(true)} className="btn-icon" aria-label="Открыть меню" aria-expanded={isMobileMenuOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Drawer */}
            {hasMounted && (
                <>
                    <CSSTransition
                        in={isMobileMenuOpen}
                        timeout={300}
                        classNames="mobile-menu-overlay"
                        unmountOnExit
                        nodeRef={mobileMenuOverlayRef}
                    >
                        <div
                            ref={mobileMenuOverlayRef}
                            className="fixed inset-0 bg-brown-gray bg-opacity-50 z-[99] md:hidden"
                            onClick={() => setIsMobileMenuOpen(false)}
                            aria-hidden="true"
                        ></div>
                    </CSSTransition>
                    
                    <CSSTransition
                        in={isMobileMenuOpen}
                        timeout={300}
                        classNames="mobile-menu"
                        unmountOnExit
                        nodeRef={mobileMenuRef}
                    >
                        <div
                            ref={mobileMenuRef}
                            className="fixed top-0 right-0 h-full w-full max-w-sm z-[100] bg-cream shadow-2xl md:hidden flex flex-col p-6"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* Menu Header */}
                            <div className="flex justify-between items-center">
                                <Link to="/" onClick={handleMenuLinkClick} className="font-logo text-3xl font-bold tracking-widest text-gray-900">MABON</Link>
                                <button onClick={() => setIsMobileMenuOpen(false)} aria-label="Закрыть меню" className="btn-icon !text-gray-900">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                </button>
                            </div>

                            {/* Menu Content (Centered) */}
                            <div className="flex-grow flex flex-col justify-center items-center text-center font-sans text-gray-900">
                                <nav className="flex flex-col space-y-6">
                                    <Link to="/collections" onClick={handleMenuLinkClick} className="text-xl font-serif hover:underline">Коллекции</Link>
                                    <Link to="/authors" onClick={handleMenuLinkClick} className="text-xl font-serif hover:underline">Авторы</Link>
                                    <Link to="/about" onClick={handleMenuLinkClick} className="text-xl font-serif hover:underline">О нас</Link>
                                    <Link to="/contacts" onClick={handleMenuLinkClick} className="text-xl font-serif hover:underline">Контакты</Link>
                                </nav>

                                <div className="mt-12 w-full">
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <input
                                            type="search"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Поиск по сайту..."
                                            className="w-full bg-transparent border-b border-gray-900/50 py-2 text-base text-gray-900 placeholder-gray-900/70 focus:outline-none focus:border-gray-900 transition-colors text-center"
                                            aria-label="Поиск по сайту"
                                        />
                                        <button type="submit" className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-900 transition-opacity hover:opacity-80" aria-label="Начать поиск">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                            </svg>
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Menu Footer */}
                            <div className="text-center pb-4 text-gray-900 w-full">
                                {user ? (
                                    <div className="text-base">
                                        <p className="font-bold truncate">Привет, {user.name}</p>
                                        <div className="flex flex-col items-stretch space-y-3 mt-6">
                                            {user.name === 'admin' && (
                                                <Link to="/admin" onClick={handleMenuLinkClick} className="block py-3 text-center border border-gray-900/50 rounded-md hover:bg-brown-gray/10 transition-colors">Админ панель</Link>
                                            )}
                                            <Link to="/profile" onClick={handleMenuLinkClick} className="block py-3 text-center border border-gray-900/50 rounded-md hover:bg-brown-gray/10 transition-colors">Профиль</Link>
                                            <button onClick={handleLogoutAndCloseMenu} className="block w-full py-3 text-center border border-gray-900/50 rounded-md hover:bg-brown-gray/10 transition-colors">Выйти</button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link to="/login" onClick={handleMenuLinkClick} className="block py-3 text-base text-center border border-gray-900/50 rounded-md hover:bg-brown-gray/10 transition-colors">Войти / Регистрация</Link>
                                )}
                            </div>
                        </div>
                    </CSSTransition>
                </>
            )}
        </header>
    );
};