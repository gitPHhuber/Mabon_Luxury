import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useOutlet, matchPath } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { Header } from './Header';
import { Footer } from './Footer';
import { CartDrawer } from './CartDrawer';
import { ChatWidget } from '../ui/ChatWidget';
import { publicRoutes } from '../../routes';
import { Breadcrumbs, BreadcrumbItem } from '../ui/Breadcrumbs';
import { useData } from '../../context/DataContext';

export const MainLayout = () => {
    const location = useLocation();
    const { getProductById, getAuthorById } = useData();
    const currentOutlet = useOutlet();
    const [isLoading, setIsLoading] = useState(false);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (isInitialLoad.current) {
            isInitialLoad.current = false;
            return;
        }

        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, [location.pathname]);

    const { nodeRef } = publicRoutes.find(route => {
        const pattern = route.path === '/' ? '/' : `/${route.path}`;
        return matchPath(pattern, location.pathname);
    }) ?? {};
    
    const breadcrumbItems = useMemo(() => {
        const pathnames = location.pathname.split('/').filter(x => x);
        if (pathnames.length === 0) return [];

        const breadcrumbs: BreadcrumbItem[] = [{ label: 'Главная', path: '/' }];

        const routeConfig: { [key: string]: string } = {
            'collections': 'Коллекции',
            'authors': 'Авторы',
            'about': 'О нас',
            'contacts': 'Контакты',
            'wishlist': 'Избранное',
            'search': 'Поиск',
            'login': 'Вход',
            'signup': 'Регистрация',
            'profile': 'Профиль',
            'checkout': 'Оформление заказа',
            'order-success': 'Заказ оформлен',
        };

        const firstPath = pathnames[0];

        if (routeConfig[firstPath] && pathnames.length === 1) {
            breadcrumbs.push({ label: routeConfig[firstPath] });
            return breadcrumbs;
        }

        if (firstPath === 'products' && pathnames[1]) {
            const product = getProductById(pathnames[1]);
            if (product) {
                breadcrumbs.push({ label: 'Коллекции', path: '/collections' });
                if (product.collection) {
                    breadcrumbs.push({
                        label: product.collection,
                        path: '/collections',
                        state: { filter: product.collection },
                    });
                }
                breadcrumbs.push({ label: product.name });
                return breadcrumbs;
            }
        }

        if (firstPath === 'authors' && pathnames[1]) {
            const author = getAuthorById(pathnames[1]);
            if (author) {
                breadcrumbs.push({ label: 'Авторы', path: '/authors' });
                breadcrumbs.push({ label: author.name });
                return breadcrumbs;
            }
        }
        
        return breadcrumbs.length > 1 ? breadcrumbs : [];
    }, [location.pathname, getProductById, getAuthorById]);

    return (
        <>
            {isLoading && <div className="loading-bar" />}
            <Header />
            <Breadcrumbs items={breadcrumbItems} />
            <main>
                <TransitionGroup component={null}>
                    <CSSTransition
                        key={location.pathname}
                        nodeRef={nodeRef}
                        timeout={300}
                        classNames="page-transition"
                        unmountOnExit
                    >
                        {(state) => (
                            <div ref={nodeRef} className="page-transition-wrapper">
                                {currentOutlet}
                            </div>
                        )}
                    </CSSTransition>
                </TransitionGroup>
            </main>
            <Footer />
            <CartDrawer />
            <ChatWidget />
        </>
    );
};
