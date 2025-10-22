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
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [hasMounted, setHasMounted] = useState(false);
    
    const profileRef = useRef<HTMLDivElement>(null);
    const menuOverlayRef = useRef<HTMLDivElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);
    const searchOverlayRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);
    
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
        const body = document.body;
        if (isMenuOpen || isSearchOpen) {
            body.style.overflow = 'hidden';
            if (isMenuOpen) body.classList.add('menu-open');
        } else {
            body.style.overflow = 'auto';
            body.classList.remove('menu-open');
        }
        return () => {
            body.style.overflow = 'auto';
            body.classList.remove('menu-open');
        };
    }, [isMenuOpen, isSearchOpen]);

    useEffect(() => {
        if (isSearchOpen) {

            setTimeout(() => searchInputRef.current?.focus(), 300);
        }
    }, [isSearchOpen]);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSuggestions({ products: [], authors: [] });
            return;
        }

        const handler = setTimeout(() => {
            const lowercasedQuery = searchQuery.toLowerCase();
            
            const scoredProducts = products
                .map(product => {
                    const name = product.name.toLowerCase();
                    const description = product.description.toLowerCase();
                    const collection = product.collection.toLowerCase();
                    let score = 0;

                    if (name.startsWith(lowercasedQuery)) score += 10;
                    else if (name.includes(lowercasedQuery)) score += 5;
                    
                    if (collection.includes(lowercasedQuery)) score += 2;
                    if (description.includes(lowercasedQuery)) score += 1;

                    return { product, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.product);

            const scoredAuthors = authors
                .map(author => {
                    const name = author.name.toLowerCase();
                    const bio = author.bio.toLowerCase();
                    let score = 0;

                    if (name.startsWith(lowercasedQuery)) score += 10;
                    else if (name.includes(lowercasedQuery)) score += 5;
                    
                    if (bio.includes(lowercasedQuery)) score += 1;

                    return { author, score };
                })
                .filter(item => item.score > 0)
                .sort((a, b) => b.score - a.score)
                .map(item => item.author);

            setSuggestions({ products: scoredProducts.slice(0, 4), authors: scoredAuthors.slice(0, 3) });
        }, 300);

        return () => {
            clearTimeout(handler);
        };
    }, [searchQuery, products, authors]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
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
            setIsSearchOpen(false);
        }
    };
    
    const handleSuggestionClick = () => {
        setSearchQuery('');
        setIsSearchOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsProfileOpen(false);
        navigate('/');
    };
    
    const handleMenuLinkClick = () => {
        setIsMenuOpen(false);
    };
    
    const handleLogoutAndCloseMenu = () => {
        handleLogout();
        handleMenuLinkClick();
    };
    
    return (
        <header className={`sticky top-0 z-[200] ${isMenuOpen || isSearchOpen ? 'bg-white' : 'bg-white/95 backdrop-blur-md'} transition-colors duration-300 fade-in`}>
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                     <button onClick={() => setIsMenuOpen(true)} className="btn-icon" aria-label="Открыть меню" aria-expanded={isMenuOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <Link to="/" onClick={handleMenuLinkClick} className={`font-logo text-3xl font-bold tracking-widest text-brown-gray ${isInitialLoad ? 'animate-logo-fade-in' : ''}`}>MABON</Link>
                </div>
                
                <div className="flex items-center space-x-2">
                    {user ? (
                        <div ref={profileRef} className="relative hidden sm:block">
                            <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="btn-icon" aria-label="Открыть меню профиля" aria-haspopup="true" aria-expanded={isProfileOpen}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </button>
                            {isProfileOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 font-sans text-left" role="menu" aria-orientation="vertical">
                                    <div className="p-3 border-b">
                                        <p className="text-sm text-brown-gray font-bold truncate">Привет, {user.name}</p>
                                    </div>
                                    {user.name === 'admin' && (
                                        <Link to="/admin" onClick={() => setIsProfileOpen(false)} role="menuitem" className="block px-4 py-2 text-sm text-brown-gray hover:bg-gray-100 font-bold">Панель администратора</Link>
                                    )}
                                    <Link to="/profile" onClick={() => setIsProfileOpen(false)} role="menuitem" className="block px-4 py-2 text-sm text-brown-gray hover:bg-gray-100">Профиль</Link>
                                    <button onClick={handleLogout} role="menuitem" className="w-full text-left px-4 py-2 text-sm text-brown-gray hover:bg-gray-100">Выйти</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/login" className="text-sm uppercase tracking-wider text-brown-gray hover:underline font-sans hidden sm:block">Войти</Link>
                    )}
                    <Link to="/wishlist" className="relative group btn-icon" aria-label={`Открыть избранное с ${wishlistCount} товарами`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 016.364 0L12 7.664l1.318-1.346a4.5 4.5 0 116.364 6.364L12 20.364l-7.682-7.682a4.5 4.5 0 010-6.364z" />
                        </svg>
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{wishlistCount}</span>
                        )}
                    </Link>
                    <button onClick={() => setIsSearchOpen(true)} className="btn-icon" aria-label="Открыть поиск">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                    <button onClick={toggleCart} className="relative group btn-icon" aria-label={`Открыть корзину с ${cartCount} товарами`}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 flex items-center justify-center bg-brown-gray text-white text-xs rounded-full h-5 w-5 font-sans">{cartCount}</span>
                        )}
                    </button>
                </div>
            </div>

            {/* Search Overlay */}
            {hasMounted && (
                <CSSTransition
                    in={isSearchOpen}
                    timeout={300}
                    classNames="search-overlay"
                    unmountOnExit
                    nodeRef={searchOverlayRef}
                >
                    <div
                        ref={searchOverlayRef}
                        className="fixed inset-0 z-[1400] bg-white p-6 flex flex-col"
                        role="dialog"
                        aria-modal="true"
                    >
                        <div className="flex justify-end">
                            <button onClick={() => setIsSearchOpen(false)} aria-label="Закрыть поиск" className="btn-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        <div className="flex-grow flex flex-col items-center mt-4 md:mt-8">
                             <div className="w-full max-w-3xl">
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <input
                                        ref={searchInputRef}
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Поиск по коллекциям, авторам, товарам..."
                                        className="w-full bg-transparent border-b-2 border-brown-gray/30 py-4 px-2 text-xl md:text-3xl text-brown-gray placeholder-brown-gray/50 focus:outline-none focus:border-brown-gray transition-all"
                                        aria-label="Поиск по сайту"
                                    />
                                </form>
                                <div className="mt-8 text-left max-h-[65vh] overflow-y-auto pr-4">
                                     {searchQuery.length < 2 && (
                                        <div className="text-center text-brown-gray/60 pt-10">
                                            <p>Начните вводить, чтобы найти товары или авторов.</p>
                                        </div>
                                    )}
                                    {searchQuery.length >= 2 && !suggestions.products.length && !suggestions.authors.length && (
                                        <div className="text-center text-brown-gray/60 pt-10">
                                            <p>Ничего не найдено по запросу "{searchQuery}".</p>
                                            <p className="text-sm mt-2">Попробуйте изменить запрос или используйте более общие слова.</p>
                                        </div>
                                    )}
                                    {(suggestions.products.length > 0 || suggestions.authors.length > 0) && (
                                        <div className="space-y-8">
                                            {suggestions.products.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm uppercase text-brown-gray tracking-wider px-2 pb-2 border-b">Товары</h4>
                                                    <ul className="mt-4 space-y-2">
                                                        {suggestions.products.map(product => (
                                                            <li key={product.id}>
                                                                <Link to={`/products/${product.id}`} onClick={handleSuggestionClick} className="flex items-center p-2 hover:bg-cream rounded-md transition-colors duration-200 group">
                                                                    <ImageWithLoader src={product.imageUrl} alt={product.name} className="w-16 h-20 mr-4 flex-shrink-0 bg-gray-200 rounded" imageClassName="w-full h-full object-cover rounded" />
                                                                    <div className="flex-grow">
                                                                        <p className="text-md text-brown-gray font-bold leading-tight group-hover:underline">{product.name}</p>
                                                                        <p className="text-sm text-brown-gray/70 mt-1">{product.collection}</p>
                                                                    </div>
                                                                    <p className="text-md text-brown-gray font-semibold ml-4">{product.price.toLocaleString('ru-RU')} ₽</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            {suggestions.authors.length > 0 && (
                                                <div>
                                                    <h4 className="text-sm uppercase text-brown-gray tracking-wider px-2 pb-2 border-b">Авторы</h4>
                                                    <ul className="mt-4 space-y-2">
                                                        {suggestions.authors.map(author => (
                                                            <li key={author.id}>
                                                                <Link to={`/authors/${author.id}`} onClick={handleSuggestionClick} className="flex items-center p-2 hover:bg-cream rounded-md transition-colors duration-200 group">
                                                                    <ImageWithLoader src={author.imageUrl} alt={author.name} className="w-12 h-12 rounded-full mr-4 flex-shrink-0 overflow-hidden bg-gray-200" imageClassName="w-full h-full object-cover" />
                                                                    <p className="text-md text-brown-gray font-bold group-hover:underline">{author.name}</p>
                                                                </Link>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                            <div className="pt-4 text-center">
                                                <button onClick={() => handleSearchSubmit({ preventDefault: () => {} } as any)} className="btn btn-secondary w-full max-w-xs mx-auto">
                                                    Показать все результаты ({suggestions.products.length + suggestions.authors.length})
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </CSSTransition>
            )}

            {/* Main Menu Drawer */}
            {hasMounted && (
                <>
                    <CSSTransition
                        in={isMenuOpen}
                        timeout={300}
                        classNames="main-menu-overlay"
                        unmountOnExit
                        nodeRef={menuOverlayRef}
                    >
                        <div
                            ref={menuOverlayRef}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1200]"
                            onClick={() => setIsMenuOpen(false)}
                            aria-hidden="true"
                        ></div>
                    </CSSTransition>
                    
                    <CSSTransition
                        in={isMenuOpen}
                        timeout={300}
                        classNames="main-menu"
                        unmountOnExit
                        nodeRef={menuRef}
                    >
                        <div
                            ref={menuRef}
                            className="fixed top-0 left-0 h-dvh w-full max-w-sm z-[1300] bg-white shadow-2xl flex flex-col p-6"
                            role="dialog"
                            aria-modal="true"
                        >
                            {/* Menu Header */}
                            <div className="flex justify-between items-center">
                                <Link to="/" onClick={handleMenuLinkClick} className="font-logo text-3xl font-bold tracking-widest text-gray-900">MABON</Link>
                                <button onClick={() => setIsMenuOpen(false)} aria-label="Закрыть меню" className="btn-icon !text-gray-900">
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
                                    <button onClick={() => { setIsMenuOpen(false); setIsSearchOpen(true); }} className="w-full bg-transparent border-b border-gray-900/50 py-2 text-base text-gray-900/70 focus:outline-none focus:border-gray-900 transition-colors text-center">
                                        Поиск по сайту...
                                    </button>
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
